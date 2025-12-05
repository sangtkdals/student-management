package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.CourseAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseAnnouncementRepository extends JpaRepository<CourseAnnouncement, Integer> {
    
    //공지사항을 최신순(내림차순)으로 가져오기
    List<CourseAnnouncement> findByCourseCodeOrderByCreatedAtDesc(String courseCode);
}