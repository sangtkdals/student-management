package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import com.example.studentmanagement.beans.StudentMember;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository extends JpaRepository<Member, String> {
    Optional<Member> findByMemberId(String memberId);
    Optional<Member> findByMemberNo(String memberNo);
    List<Member> findByDepartment_DeptCode(String deptCode);
    List<Member> findByDepartment_DeptCodeAndMemberType(String deptCode, String memberType);

    @Query("SELECT sm FROM StudentMember sm WHERE sm.department.deptCode = :deptCode AND sm.stuGrade = :stuGrade")
    List<StudentMember> findStudentsByDepartmentAndGrade(@Param("deptCode") String deptCode, @Param("stuGrade") int stuGrade);
}
