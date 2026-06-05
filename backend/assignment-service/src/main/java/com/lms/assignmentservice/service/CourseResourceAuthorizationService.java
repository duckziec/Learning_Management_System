package com.lms.assignmentservice.service;

public interface CourseResourceAuthorizationService {
    void checkManager(String courseId, String createdBy);
}
