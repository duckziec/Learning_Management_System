package com.lms.identityservice.service;

import com.lms.identityservice.dto.response.UserFullResponse;

public interface InternalUserService {
    UserFullResponse getUserById(String userId);
    boolean existsById(String userId);
    UserFullResponse findByEmail(String email);
}

