package com.lms.identityservice.service.impl;

import com.lms.identityservice.constant.CacheNames;
import com.lms.identityservice.dto.response.UserFullResponse;
import com.lms.identityservice.entity.User;
import com.lms.identityservice.exception.ErrorCode;
import com.lms.identityservice.exception.IdentityException;
import com.lms.identityservice.mapper.UserMapper;
import com.lms.identityservice.repository.UserRepository;
import com.lms.identityservice.service.InternalUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InternalUserServiceImpl implements InternalUserService {

    UserRepository userRepository;
    UserMapper userMapper;

    @Override
    @Cacheable(value = CacheNames.USER_FULL, key = "#userId")
    public UserFullResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IdentityException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserFullResponse(user);
    }

    @Override
    @Cacheable(value = CacheNames.USER_EXISTS, key = "#userId")
    public boolean existsById(String userId) {
        return userRepository.existsById(userId);
    }

    @Override
    public UserFullResponse findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toUserFullResponse)
                .orElse(null);
    }

}
