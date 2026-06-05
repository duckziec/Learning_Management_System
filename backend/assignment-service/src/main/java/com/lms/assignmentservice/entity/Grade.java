package com.lms.assignmentservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "grades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;

    @Column(name = "user_id", nullable = false, length = 36, columnDefinition = "CHAR(36)")
    String userId;

    @Column(name = "course_id", nullable = false, length = 36, columnDefinition = "CHAR(36)")
    String courseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    Quiz quiz;

    @Column(name = "best_score", nullable = false)
    @Builder.Default
    Float bestScore = 0f;

    @Column(name = "attempts_count", nullable = false)
    @Builder.Default
    Integer attemptsCount = 0;

    @Column(name = "last_attempt_at")
    LocalDateTime lastAttemptAt;

    @Column(name = "updated_at", nullable = false)
    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
