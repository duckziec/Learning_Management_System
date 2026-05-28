package com.lms.identityservice.service;

import com.lms.identityservice.dto.response.CachedAdminUsersPage;
import com.lms.identityservice.dto.response.UserDashboardResponse;
import com.lms.identityservice.dto.response.UserFullResponse;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {
    CachedAdminUsersPage getAllUser(Pageable pageable, String role, String keyword);

    UserFullResponse getUserById(String userId);

    UserFullResponse toggleActive(String id);

    UserDashboardResponse getUserStats();
}
