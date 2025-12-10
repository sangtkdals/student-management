package com.example.studentmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseAnnouncementDTO {
    private Integer noticeId;
    private String courseCode;
    private String writerId;
    private String writerName;
    private String title;
    private String content;
    private Integer viewCount;
    private LocalDateTime createdAt;
}