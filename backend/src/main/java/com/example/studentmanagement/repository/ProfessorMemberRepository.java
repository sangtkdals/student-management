package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.ProfessorMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfessorMemberRepository extends JpaRepository<ProfessorMember, String> {
    Optional<ProfessorMember> findByMemberId(String memberId);
}
