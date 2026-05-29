package com.lms.courseservice.service.impl;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.services.calendar.Calendar;
import com.lms.courseservice.configuration.GoogleCalendarConfig;
import com.lms.courseservice.dto.MeetingInfo;
import com.lms.courseservice.service.GoogleMeetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.UUID;

/**
 * Google Meet Service Implementation.
 *
 * <p><b>⚠ THÔNG BÁO QUAN TRỌNG CHO GIẢNG VIÊN / IMPORTANT NOTICE:</b></p>
 * <p>
 * Tính năng tạo Google Meet tự động yêu cầu một Google Workspace Service Account
 * có domain-wide delegation được cấu hình riêng cho từng tổ chức.
 * Do project này không thể chia sẻ thông tin xác thực Google của hệ thống gốc,
 * tính năng này được <b>vô hiệu hóa</b> trong bản build này.
 * </p>
 * <p>
 * Link Google Meet được trả về là <b>link giả (placeholder)</b> và KHÔNG thể truy cập.
 * Xem README.md để biết thêm chi tiết.
 * </p>
 *
 * <hr>
 *
 * <p><b>English:</b> Google Meet auto-generation requires a Google Workspace Service Account
 * with domain-wide delegation. This build returns a placeholder URL instead of calling
 * the Google Calendar API. See README.md for details.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleMeetServiceImpl implements GoogleMeetService {

    private final GoogleCalendarConfig googleCalendarConfig;

    @Value("${google.calendar.calendar-id}")
    private String calendarId;

    /**
     * Trả về một link Google Meet giả (placeholder).
     *
     * <p>Link này KHÔNG thể truy cập và chỉ dùng để hệ thống hoạt động bình thường
     * mà không phụ thuộc vào thông tin xác thực Google Workspace.</p>
     */
    @Override
    public MeetingInfo createMeeting(String title) {
        String placeholderEventId = "placeholder-" + UUID.randomUUID();
        log.warn(
            "[GoogleMeet] Integration disabled – returning placeholder link for course: '{}'. " +
            "Event ID: {}. See README.md for details.",
            title, placeholderEventId
        );
        return MeetingInfo.builder()
                .meetingUrl("https://meet.google.com/xxx-xxxx-xxx")
                .eventId(placeholderEventId)
                .build();
    }

    /**
     * Xóa Google Calendar event. Với placeholder event ID sẽ bỏ qua (no-op).
     */
    @Override
    public void deleteMeeting(String eventId) {
        if (eventId == null || eventId.startsWith("placeholder-")) {
            log.debug("[GoogleMeet] Skipping delete for placeholder event: {}", eventId);
            return;
        }
        try {
            Calendar calendar = googleCalendarConfig.buildCalendarClient();
            calendar.events().delete(calendarId, eventId).execute();

        } catch (GoogleJsonResponseException e) {
            if (e.getStatusCode() == 404) return;
            log.warn("[GoogleMeet] Could not delete event [{}]: {}", eventId, e.getMessage());

        } catch (IOException | GeneralSecurityException e) {
            log.warn("[GoogleMeet] Error deleting event [{}]: {}", eventId, e.getMessage());
        }
    }
}
