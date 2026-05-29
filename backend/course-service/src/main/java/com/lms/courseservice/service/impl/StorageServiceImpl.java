package com.lms.courseservice.service.impl;

import com.lms.courseservice.dto.response.PresignedUrlResponse;
import com.lms.courseservice.exception.CourseException;
import com.lms.courseservice.exception.ErrorCode;
import com.lms.courseservice.service.MinioService;
import com.lms.courseservice.service.StorageService;
import io.minio.MinioClient;
import io.minio.http.Method;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StorageServiceImpl implements StorageService {

    final MinioClient publicMinioClient;
    final MinioService minioService;

    public StorageServiceImpl(@Qualifier("publicMinioClient") MinioClient publicMinioClient,
                              MinioService minioService) {
        this.publicMinioClient = publicMinioClient;
        this.minioService = minioService;
    }

    @Value("${minio.bucket-name}")
    String bucketName;

    @Value("${minio.url}")
    String minioUrl;

    @Value("${minio.public-url:${minio.url}}")
    String minioPublicUrl;

    @Value("${minio.presigned-expiry-minutes:5}")
    int presignedExpiryMinutes;

    @Override
    public PresignedUrlResponse generatePresignedUrl(String fileName, String fileType, String folder) {
        try {
            String ext = extractExtension(fileName, fileType);
            String objectName = folder + "/" + UUID.randomUUID() + ext;

            String presignedUrl = publicMinioClient.getPresignedObjectUrl(
                    io.minio.GetPresignedObjectUrlArgs.builder()
                            .method(Method.PUT)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(presignedExpiryMinutes, TimeUnit.MINUTES)
                            .build()
            );

            String publicUrl = minioPublicUrl + "/" + bucketName + "/" + objectName;

            return PresignedUrlResponse.builder()
                    .presignedUrl(presignedUrl)
                    .publicUrl(publicUrl)
                    .build();
        } catch (Exception e) {
            log.error("Failed to generate presigned URL for file: {} (type: {}, folder: {}, bucket: {})",
                    fileName, fileType, folder, bucketName, e);
            throw new CourseException(ErrorCode.INTERNAL_ERROR);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        minioService.deleteFile(fileUrl);
    }

    private String extractExtension(String fileName, String fileType) {
        if (fileName != null && fileName.contains(".")) {
            String ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
            if (ext.matches("\\.(jpg|jpeg|png|gif|webp|bmp|svg|mp4|mov|webm|avi|mkv|pdf|doc|docx|ppt|pptx|xls|xlsx|zip|txt)")) {
                return ext;
            }
        }
        if (fileType != null) {
            return switch (fileType) {
                case "image/jpeg" -> ".jpg";
                case "image/png"  -> ".png";
                case "image/gif"  -> ".gif";
                case "image/webp" -> ".webp";
                case "image/bmp"  -> ".bmp";
                case "image/svg+xml" -> ".svg";
                case "video/mp4"  -> ".mp4";
                case "video/quicktime" -> ".mov";
                case "video/webm" -> ".webm";
                case "video/x-msvideo" -> ".avi";
                case "video/x-matroska" -> ".mkv";
                case "application/pdf" -> ".pdf";
                case "application/msword" -> ".doc";
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" -> ".docx";
                case "application/vnd.ms-powerpoint" -> ".ppt";
                case "application/vnd.openxmlformats-officedocument.presentationml.presentation" -> ".pptx";
                default -> "";
            };
        }
        return "";
    }
}
