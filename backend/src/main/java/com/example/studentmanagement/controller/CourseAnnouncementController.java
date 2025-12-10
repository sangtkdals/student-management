package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.CourseAnnouncement;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.dto.CourseAnnouncementDTO; // DTO import
import com.example.studentmanagement.repository.CourseAnnouncementRepository;
import com.example.studentmanagement.repository.EnrollmentRepository;
import com.example.studentmanagement.repository.MemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/course-notices")
public class CourseAnnouncementController {

    private final CourseAnnouncementRepository repository;
    private final EnrollmentRepository enrollmentRepository;
    private final MemberRepository memberRepository;

    public CourseAnnouncementController(CourseAnnouncementRepository repository, EnrollmentRepository enrollmentRepository, MemberRepository memberRepository) {
        this.repository = repository;
        this.enrollmentRepository = enrollmentRepository;
        this.memberRepository = memberRepository;
    }

    // 1. 목록 조회 (DTO로 반환해서 이름까지 보냄)
    @GetMapping("/{courseCode}")
    public ResponseEntity<List<CourseAnnouncementDTO>> getNotices(@PathVariable("courseCode") String courseCode) {
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
    public ResponseEntity<?> increaseViewCount(@PathVariable("noticeId") Integer noticeId) {
        repository.incrementViewCount(noticeId);
        return ResponseEntity.ok().build();
    }

    // 4. 학생이 수강 중인 모든 강의의 최신 공지사항 조회
    @GetMapping("/my-latest")
    public ResponseEntity<List<CourseAnnouncementDTO>> getMyLatestAnnouncements() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String studentLoginId = authentication.getName();

        Optional<Member> memberOptional = memberRepository.findById(studentLoginId);
        if (memberOptional.isEmpty()) {
            return ResponseEntity.status(404).body(List.of());
        }
        String studentNo = memberOptional.get().getMemberNo();

        List<com.example.studentmanagement.beans.Course> courses = enrollmentRepository.findCoursesByStudentNoWithDetails(studentNo);
        List<String> courseCodes = courses.stream().map(com.example.studentmanagement.beans.Course::getCourseCode).collect(Collectors.toList());

        if (courseCodes.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<CourseAnnouncementDTO> announcements = repository.findLatestAnnouncementForEachCourse(courseCodes);

        return ResponseEntity.ok(announcements);
    }

    // 5. 학생이 수강 중인 모든 강의의 모든 공지사항 조회
    @GetMapping("/my")
    public ResponseEntity<List<CourseAnnouncementDTO>> getMyAllAnnouncements() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String studentLoginId = authentication.getName();

        Optional<Member> memberOptional = memberRepository.findById(studentLoginId);
        if (memberOptional.isEmpty()) {
            return ResponseEntity.status(404).body(List.of());
        }
        String studentNo = memberOptional.get().getMemberNo();

        List<com.example.studentmanagement.beans.Course> courses = enrollmentRepository.findCoursesByStudentNoWithDetails(studentNo);
        List<String> courseCodes = courses.stream().map(com.example.studentmanagement.beans.Course::getCourseCode).collect(Collectors.toList());

        if (courseCodes.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<CourseAnnouncementDTO> announcements = repository.findAllByCourseCodes(courseCodes);

        return ResponseEntity.ok(announcements);
    }
}
