package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "post")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Integer postId;

    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;

    @Column(name = "post_title", length = 500)
    private String postTitle;

    @Column(name = "post_content", columnDefinition = "TEXT")
    private String postContent;

    @ManyToOne
    @JoinColumn(name = "writer_id", referencedColumnName = "m_no")
    private Member writer;

    @Column(name = "view_count")
    private Integer viewCount;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}
