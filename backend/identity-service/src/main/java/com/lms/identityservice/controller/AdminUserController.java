package com.lms.identityservice.controller;

import com.lms.identityservice.dto.ApiResponse;
import com.lms.identityservice.dto.response.UserDashboardResponse;
import com.lms.identityservice.dto.response.UserFullResponse;
import com.lms.identityservice.dto.response.UserSummaryResponse;
import com.lms.identityservice.service.AdminUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminUserController {

    AdminUserService adminService;

    @GetMapping
    ApiResponse<Page<UserSummaryResponse>> getUsers(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.<Page<UserSummaryResponse>>builder()
                .data(adminService.getAllUser(pageable, role, keyword).toPage(pageable))
                .build();
    }

    @GetMapping("/stats")
    ApiResponse<UserDashboardResponse> getUserStats() {
        return ApiResponse.<UserDashboardResponse>builder()
                .data(adminService.getUserStats())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<UserFullResponse> getUser(@PathVariable String id) {
        return ApiResponse.<UserFullResponse>builder()
                .data(adminService.getUserById(id))
                .build();
    }

    @PatchMapping("/{id}/active")
    ApiResponse<UserFullResponse> toggleActive(@PathVariable String id) {
        return ApiResponse.<UserFullResponse>builder()
                .data(adminService.toggleActive(id))
                .build();
    }
}
