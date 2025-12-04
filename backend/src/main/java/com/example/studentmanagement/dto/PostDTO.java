package com.example.studentmanagement.dto;

import com.example.studentmanagement.beans.Post;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private Integer postId;
    private String postTitle;
    private String postContent;
    private String writerNo;
    private String writerName;
    private Integer viewCount;
    private Date createdAt;
    private Date updatedAt;
    private String boardCode;

    public PostDTO(Post post) {
        this.postId = post.getPostId();
        this.postTitle = post.getPostTitle();
        this.postContent = post.getPostContent();
        this.writerNo = post.getWriter() != null ? post.getWriter().getMemberNo() : null;
        this.writerName = post.getWriter() != null ? post.getWriter().getName() : null;
        this.viewCount = post.getViewCount();
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
        this.boardCode = post.getBoard() != null ? post.getBoard().getBoardCode() : null;
    }
}
