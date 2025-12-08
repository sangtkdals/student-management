package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {

    List<AssignmentSubmission> findByAssignment_AssignmentId(Long assignmentId);

    Optional<AssignmentSubmission> findByAssignment_AssignmentIdAndStudent_MemberNo(Long assignmentId, String studentId);
}
