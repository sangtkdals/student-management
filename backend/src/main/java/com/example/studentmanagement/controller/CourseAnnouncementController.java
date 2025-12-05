package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.CourseAnnouncement;
import com.example.studentmanagement.dto.CourseAnnouncementDTO; // DTO import
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

    // 1. 목록 조회 (DTO로 반환해서 이름까지 보냄)
    @GetMapping("/{courseCode}")
    public ResponseEntity<List<CourseAnnouncementDTO>> getNotices(@PathVariable String courseCode) {
        return ResponseEntity.ok(repository.findDTOByCourseCode(courseCode));
    }

    // 2. 공지사항 작성
    @PostMapping
    public ResponseEntity<?> createNotice(@RequestBody CourseAnnouncement notice) {
        try {
            if (notice.getViewCount() == null) notice.setViewCount(0);
            repository.save(notice);
            return ResponseEntity.ok("공지사항이 등록되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("등록 실패: " + e.getMessage());
        }
    }

    // 3. [추가] 조회수 증가 API
    @PostMapping("/{noticeId}/view")
    public ResponseEntity<?> increaseViewCount(@PathVariable Integer noticeId) {
        repository.incrementViewCount(noticeId);
        return ResponseEntity.ok().build();
    }
}