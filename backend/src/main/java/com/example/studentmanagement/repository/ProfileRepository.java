package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Member, String> {
    Optional<Member> findByMemberId(String memberId);
}