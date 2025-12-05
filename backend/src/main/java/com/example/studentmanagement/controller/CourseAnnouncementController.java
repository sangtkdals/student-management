package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.CourseAnnouncement;
import com.example.studentmanagement.repository.CourseAnnouncementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-notices")
public class CourseAnnouncementController {

    private final CourseAnnouncementRepository repository;

    public CourseAnnouncementController(CourseAnnouncementRepository repository) {
        this.repository = repository;
    }

    // 1. 공지사항 목록 조회 (GET /api/course-notices/{courseCode})
    @GetMapping("/{courseCode}")
    public ResponseEntity<List<CourseAnnouncement>> getNotices(@PathVariable String courseCode) {
        return ResponseEntity.ok(repository.findByCourseCodeOrderByCreatedAtDesc(courseCode));
    }

    // 2. 공지사항 작성 (POST /api/course-notices)
    @PostMapping
    public ResponseEntity<?> createNotice(@RequestBody CourseAnnouncement notice) {
        try {
            // 기본값 설정 (혹시 null이면 0으로)
            if (notice.getViewCount() == null) notice.setViewCount(0);
            
            repository.save(notice);
            return ResponseEntity.ok("공지사항이 등록되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("등록 실패: " + e.getMessage());
        }
    }
}