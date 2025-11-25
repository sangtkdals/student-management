package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attachment")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attachment_id")
    private Integer attachmentId;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @Column(name = "filename", length = 500)
    private String filename;
}
