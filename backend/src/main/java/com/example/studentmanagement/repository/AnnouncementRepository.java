package com.example.studentmanagement.repository;
import com.example.studentmanagement.beans.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {

    List<Announcement> findAllByOrderByCreatedAtDesc();

    List<Announcement> findByWriterIdOrderByCreatedAtDesc(String writerId);

    List<Announcement> findByPostTitleContainingOrderByCreatedAtDesc(String postTitle);

    List<Announcement> findByBoardId(Integer boardId);

    List<Announcement> findByBoardIdOrderByCreatedAtDesc(Integer boardId);
}
