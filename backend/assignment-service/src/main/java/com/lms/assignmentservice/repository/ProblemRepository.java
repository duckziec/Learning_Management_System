package com.lms.assignmentservice.repository;

import com.lms.assignmentservice.entity.Problem;
import com.lms.assignmentservice.enums.DifficultyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProblemRepository extends JpaRepository<Problem, Integer> {
    Optional<Problem> findBySlug(String slug);

    boolean existsBySlug(String Slug);

    // Student chỉ thấy problem public + chưa xóa
    Page<Problem> findByCourseIdAndDifficultyAndIsPublicTrueAndDeletedFalse(String courseId, DifficultyType difficulty, Pageable pageable);

    Page<Problem> findByCourseIdAndIsPublicTrueAndDeletedFalse(String courseId, Pageable pageable);

    // Instructor thấy tất cả (kể cả deleted)
    Page<Problem> findByCourseIdAndDifficulty(String courseId, DifficultyType difficulty, Pageable pageable);

    Page<Problem> findByCourseId(String courseId, Pageable pageable);

    @Modifying
    @Query("UPDATE Problem p SET p.totalSubmit = p.totalSubmit + 1 WHERE p.problemId = :id")
    void incrementTotalSubmit(@Param("id") Integer problemId);

    @Modifying
    @Query("UPDATE Problem p SET p.totalAccepted = p.totalAccepted + 1 WHERE p.problemId = :id")
    void incrementTotalAccepted(@Param("id") Integer problemId);

    @Modifying
    @Query("UPDATE Problem p SET p.totalSubmit = :count WHERE p.problemId = :id")
    void setTotalSubmit(@Param("id") Integer problemId, @Param("count") Integer count);

    @Modifying
    @Query("UPDATE Problem p SET p.totalAccepted = :count WHERE p.problemId = :id")
    void setTotalAccepted(@Param("id") Integer problemId, @Param("count") Integer count);

    long countByCourseId(String courseId);

    long countByCourseIdAndIsPublicTrueAndDeletedFalse(String courseId);

    @Query("SELECT p.courseId, COUNT(p) FROM Problem p WHERE p.courseId IN :courseIds AND p.deleted = false GROUP BY p.courseId")
    List<Object[]> countGroupByCourseIds(@Param("courseIds") List<String> courseIds);
}
