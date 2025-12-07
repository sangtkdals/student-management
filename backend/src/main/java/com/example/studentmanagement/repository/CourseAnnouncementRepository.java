package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.CourseAnnouncement;
import com.example.studentmanagement.dto.CourseAnnouncementDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CourseAnnouncementRepository extends JpaRepository<CourseAnnouncement, Integer> {

    // 1. [수정] 작성자 ID와 Member 테이블을 조인해서 '이름'까지 DTO로 가져오는 쿼리
    @Query("SELECT new com.example.studentmanagement.dto.CourseAnnouncementDTO(" +
           "c.noticeId, c.courseCode, c.writerId, m.name, c.title, c.content, c.viewCount, c.createdAt) " +
           "FROM CourseAnnouncement c " +
           "JOIN Member m ON c.writerId = m.memberNo " + // 교수 번호로 조인
           "WHERE c.courseCode = :courseCode " +
           "ORDER BY c.createdAt DESC")
    List<CourseAnnouncementDTO> findDTOByCourseCode(@Param("courseCode") String courseCode);

    // 2. [추가] 조회수 1 증가시키는 쿼리
    @Modifying
    @Transactional
    @Query("UPDATE CourseAnnouncement c SET c.viewCount = c.viewCount + 1 WHERE c.noticeId = :noticeId")
    void incrementViewCount(@Param("noticeId") Integer noticeId);

    @Query("SELECT new com.example.studentmanagement.dto.CourseAnnouncementDTO(" +
           "c.noticeId, c.courseCode, c.writerId, m.name, c.title, c.content, c.viewCount, c.createdAt) " +
           "FROM CourseAnnouncement c " +
           "JOIN Member m ON c.writerId = m.memberNo " +
           "WHERE c.courseCode IN :courseCodes AND c.createdAt = (" +
           "SELECT MAX(c2.createdAt) FROM CourseAnnouncement c2 WHERE c2.courseCode = c.courseCode" +
           ")")
    List<CourseAnnouncementDTO> findLatestAnnouncementForEachCourse(@Param("courseCodes") List<String> courseCodes);

    @Query("SELECT new com.example.studentmanagement.dto.CourseAnnouncementDTO(" +
           "c.noticeId, c.courseCode, c.writerId, m.name, c.title, c.content, c.viewCount, c.createdAt) " +
           "FROM CourseAnnouncement c " +
           "JOIN Member m ON c.writerId = m.memberNo " +
           "WHERE c.courseCode IN :courseCodes " +
           "ORDER BY c.createdAt DESC")
    List<CourseAnnouncementDTO> findAllByCourseCodes(@Param("courseCodes") List<String> courseCodes);
}
