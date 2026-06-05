package com.lms.assignmentservice.service.impl;

import com.lms.assignmentservice.dto.response.InternalCourseResponse;
import com.lms.assignmentservice.exception.AssignmentException;
import com.lms.assignmentservice.exception.ErrorCode;
import com.lms.assignmentservice.repository.httpClient.CourseClient;
import com.lms.assignmentservice.service.AssignmentAuthorizationService;
import com.lms.assignmentservice.service.CourseResourceAuthorizationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseResourceAuthorizationServiceImpl implements CourseResourceAuthorizationService {

    AssignmentAuthorizationService authorizationService;
    CourseClient courseClient;

    @Override
    public void checkManager(String courseId, String createdBy) {
        if (authorizationService.isAdmin()) {
            return;
        }

        String userId = authorizationService.currentUserId();
        if (userId.equals(createdBy)) {
            return;
        }

        InternalCourseResponse course = courseClient.getCourse(courseId);
        if (course != null && userId.equals(course.getInstructorId())) {
            return;
        }

        throw new AssignmentException(ErrorCode.ACCESS_DENIED);
    }
}
