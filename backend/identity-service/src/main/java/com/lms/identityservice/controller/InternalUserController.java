package com.lms.identityservice.controller;

import com.lms.identityservice.dto.response.UserFullResponse;
import com.lms.identityservice.service.InternalUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
@RequestMapping("/internal")
@Slf4j
public class InternalUserController {

    InternalUserService internalUserService;

    @GetMapping("/user/{id}")
    UserFullResponse getUserDetails(@PathVariable String id) {
        return internalUserService.getUserById(id);

    }

    @GetMapping("/users/{userId}/exists")
    boolean existsById(@PathVariable String userId) {
        return internalUserService.existsById(userId);
    }

    @GetMapping("/users/search/by-email")
    UserFullResponse findByEmail(@RequestParam String email) {
        return internalUserService.findByEmail(email);
    }
}
