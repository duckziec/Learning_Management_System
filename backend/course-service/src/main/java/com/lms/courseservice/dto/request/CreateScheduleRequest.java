package com.lms.courseservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateScheduleRequest {

    @NotBlank(message = "SCHEDULE_TITLE_BLANK")
    @Size(max = 500, message = "SCHEDULE_TITLE_SIZE")
    String title;

    @NotNull(message = "SCHEDULE_START_TIME_NULL")
    LocalDateTime startTime;

    @NotNull(message = "SCHEDULE_END_TIME_NULL")
    LocalDateTime endTime;

    String note;
}
