package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "board")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Integer boardId;

    @Column(name = "board_code", length = 50, unique = true)
    private String boardCode;

    @Column(name = "board_name", length = 100)
    private String boardName;

    @Column(name = "write_auth", length = 50)
    private String writeAuth;
}
