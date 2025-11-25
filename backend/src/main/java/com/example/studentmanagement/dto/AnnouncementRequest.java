package com.example.studentmanagement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnnouncementRequest {
    private Integer boardId;
    private String postTitle;
    private String postContent;
    private String writerId;
}
