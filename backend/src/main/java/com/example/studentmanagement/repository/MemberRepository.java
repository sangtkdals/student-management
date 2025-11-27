package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {
    Optional<Member> findByMemberId(String memberId);
    Optional<Member> findByMemberNo(String memberNo);
    
    @Query("SELECT m FROM Member m WHERE m.enrollmentStatus = 'LEAVE' ORDER BY m.memberNo")
List<Member> findStudentsOnLeave();
}
