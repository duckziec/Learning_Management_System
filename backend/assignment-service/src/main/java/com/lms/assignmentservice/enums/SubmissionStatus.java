package com.lms.assignmentservice.enums;

public enum SubmissionStatus {
    // ===== Enums — chuẩn hóa status từ mọi engine =====
    PENDING, //       — vừa tạo, chưa gửi Judge0
    JUDGING,
    ACCEPTED,
    WRONG_ANSWER,
    TIME_LIMIT_EXCEEDED,
    MEMORY_LIMIT_EXCEEDED,
    RUNTIME_ERROR,
    COMPILATION_ERROR,
    INTERNAL_ERROR
}