package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {
    Optional<Member> findByMemberId(String memberId);
    Optional<Member> findByMemberNo(String memberNo);
}