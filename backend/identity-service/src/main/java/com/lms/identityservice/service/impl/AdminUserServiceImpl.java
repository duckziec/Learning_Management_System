package com.lms.identityservice.service.impl;

import com.lms.identityservice.configuration.GatewayAuthentication;
import com.lms.identityservice.constant.CacheNames;
import com.lms.identityservice.dto.response.CachedAdminUsersPage;
import com.lms.identityservice.dto.response.UserDashboardResponse;
import com.lms.identityservice.dto.response.UserFullResponse;
import com.lms.identityservice.dto.response.UserSummaryResponse;
import com.lms.identityservice.entity.User;
import com.lms.identityservice.enums.RoleType;
import com.lms.identityservice.exception.ErrorCode;
import com.lms.identityservice.exception.IdentityException;
import com.lms.identityservice.mapper.UserMapper;
import com.lms.identityservice.repository.RefreshTokenRepository;
import com.lms.identityservice.repository.UserRepository;
import com.lms.identityservice.service.AdminUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminUserServiceImpl implements AdminUserService {

    UserRepository userRepository;
    RefreshTokenRepository refreshTokenRepository;
    UserMapper userMapper;

    @Override
    @Cacheable(value = CacheNames.ADMIN_LIST, key = "#root.target.buildAdminListCacheKey(#pageable, #role, #keyword)")
    public CachedAdminUsersPage getAllUser(Pageable pageable, String role, String keyword) {
        return getCachedAdminUsersPage(pageable, role, keyword);
    }

    @Override
    @Cacheable(value = CacheNames.USER_FULL, key = "#userId")
    public UserFullResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IdentityException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserFullResponse(user);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CacheNames.USER_FULL, key = "#id"),
            @CacheEvict(value = CacheNames.USER_EXISTS, key = "#id"),
            @CacheEvict(value = CacheNames.ADMIN_LIST, allEntries = true),
            @CacheEvict(value = CacheNames.ADMIN_STATS, allEntries = true),
            @CacheEvict(value = CacheNames.AUTH_USERNAME, allEntries = true),
            @CacheEvict(value = CacheNames.AUTH_EMAIL, allEntries = true),
            @CacheEvict(value = CacheNames.AUTH_PROVIDER, allEntries = true)
    })
    public UserFullResponse toggleActive(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IdentityException(ErrorCode.USER_NOT_EXISTED));

        if (user.getRole() == RoleType.ADMIN) {
            throw new IdentityException(ErrorCode.CANNOT_DEACTIVATE_ADMIN);
        }

        boolean newStatus = !user.getActive();
        user.setActive(newStatus);
        userRepository.save(user);

        log.info("Admin {} {} user {}",
                GatewayAuthentication.currentUserId(),
                newStatus ? "activated" : "deactivated",
                id);

        if (!newStatus) {
            refreshTokenRepository.revokeAllByUserId(id);
        }

        return userMapper.toUserFullResponse(user);
    }

    @Override
    @Cacheable(value = CacheNames.ADMIN_STATS, key = "'all'")
    public UserDashboardResponse getUserStats() {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        Instant startOfWeek = today
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();
        Instant startOfMonth = today.withDayOfMonth(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        List<Object[]> stats = userRepository.countUserDashboardStats(startOfWeek, startOfMonth);
        Object[] row = stats.isEmpty() ? new Object[5] : stats.get(0);

        return UserDashboardResponse.builder()
                .totalStudents(toLong(row[0]))
                .newStudentsThisWeek(toLong(row[1]))
                .totalInstructors(toLong(row[2]))
                .newInstructorsThisMonth(toLong(row[3]))
                .totalAdmins(toLong(row[4]))
                .build();
    }

    private long toLong(Object value) {
        return value == null ? 0L : ((Number) value).longValue();
    }

    public String buildAdminListCacheKey(Pageable pageable, String role, String keyword) {
        return normalizeRole(role) + ':'
                + normalizeKeyword(keyword) + ':'
                + pageable.getPageNumber() + ':'
                + pageable.getPageSize() + ':'
                + pageable.getSort();
    }

    private CachedAdminUsersPage getCachedAdminUsersPage(Pageable pageable, String role, String keyword) {
        String normalizedRole = normalizeRole(role);
        RoleType roleType = normalizedRole != null ? RoleType.valueOf(normalizedRole) : null;
        String searchKeyword = normalizeKeyword(keyword);
        Page<UserSummaryResponse> users = userRepository.findUsersByFilters(roleType, searchKeyword, pageable)
                .map(userMapper::toUserSummaryResponse);

        return CachedAdminUsersPage.builder()
                .content(users.getContent())
                .totalElements(users.getTotalElements())
                .build();
    }

    private String normalizeRole(String role) {
        return StringUtils.hasText(role) ? role.trim().toUpperCase() : null;
    }

    private String normalizeKeyword(String keyword) {
        return StringUtils.hasText(keyword) ? keyword.trim() : null;
    }
}
