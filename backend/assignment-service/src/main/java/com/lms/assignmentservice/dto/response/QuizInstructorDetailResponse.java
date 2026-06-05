package com.lms.assignmentservice.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Response cho Instructors khi xem danh sách quiz hoặc chi tiết quiz.
 * Chứa tất cả các thông tin quản lý: metadata, thông tin tạo, trạng thái publish, etc.
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuizInstructorDetailResponse {
    Integer quizId;
    String courseId;
    String lessonId;
    String title;
    String description;
    Integer duration; // Nullable: null = unlimited
    Short totalScore;
    Byte passScore;
    Byte maxAttempts;
    boolean shuffleQuestions;
    boolean shuffleAnswers;
    String showResult; // IMMEDIATELY, AFTER_SUBMIT, AFTER_DEADLINE
    LocalDateTime startTime; // Nullable: null = unlimited
    LocalDateTime endTime; // Nullable: null = unlimited
    boolean published;
    int questionCount;
    long attemptCount;
    boolean deleted;
    LocalDateTime deletedAt;
    String createdBy;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

