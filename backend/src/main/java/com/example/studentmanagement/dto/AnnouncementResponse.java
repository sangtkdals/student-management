package com.example.studentmanagement.dto;

import com.example.studentmanagement.beans.Announcement;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AnnouncementResponse {
    private Integer postId;
    private Integer boardId;
    private String postTitle;
    private String postContent;
    private String writerId;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AnnouncementResponse fromEntity(Announcement announcement) {
        return AnnouncementResponse.builder()
                .postId(announcement.getPostId())
                .boardId(announcement.getBoardId())
                .postTitle(announcement.getPostTitle())
                .postContent(announcement.getPostContent())
                .writerId(announcement.getWriterId())
                .viewCount(announcement.getViewCount())
                .createdAt(announcement.getCreatedAt())
                .updatedAt(announcement.getUpdatedAt())
                .build();
    }
}
