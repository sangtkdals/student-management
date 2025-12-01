package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.StudentMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentMemberRepository extends JpaRepository<StudentMember, String> {
    
    // m_id로 조회
    Optional<StudentMember> findByMemberId(String memberId);
    
    // 휴학 중인 학생 목록 조회
    @Query("SELECT sm FROM StudentMember sm WHERE sm.enrollmentStatus = 'LEAVE' ORDER BY sm.memberNo")
    List<StudentMember> findStudentsOnLeave();
}
