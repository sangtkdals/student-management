package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    @Query(value = "SELECT p FROM Post p WHERE p.board.boardCode = :boardCode ORDER BY p.createdAt DESC",
           countQuery = "SELECT count(p) FROM Post p WHERE p.board.boardCode = :boardCode")
    Page<Post> findByBoardCode(@Param("boardCode") String boardCode, Pageable pageable);

    // Spring Data JPA 쿼리 메서드 명명 규칙을 따르는 메서드 추가
    Page<Post> findByBoardBoardCode(String boardCode, Pageable pageable);
}
