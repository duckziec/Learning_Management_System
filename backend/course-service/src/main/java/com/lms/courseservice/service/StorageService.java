package com.lms.courseservice.service;

import com.lms.courseservice.dto.response.PresignedUrlResponse;

public interface StorageService {
    PresignedUrlResponse generatePresignedUrl(String fileName, String fileType, String folder);
    void deleteFile(String fileUrl);
}
