package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.StudentMember;
import com.example.studentmanagement.beans.ProfessorMember;
import com.example.studentmanagement.dto.UserManagementDTO;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class UserManagementService {

    private final MemberRepository memberRepository;
    private final DepartmentRepository departmentRepository;

    public UserManagementService(MemberRepository memberRepository, DepartmentRepository departmentRepository) {
        this.memberRepository = memberRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<UserManagementDTO> getAllUsers(String memberType, String deptCode, Integer stuGrade, String searchName) {
        List<Member> members = memberRepository.findAll();

        return members.stream()
                .filter(member -> {
                    // Filter by member type
                    if (memberType != null && !memberType.isEmpty() && !memberType.equals("ALL")) {
                        if (memberType.equals("STUDENT") && !(member instanceof StudentMember)) {
                            return false;
                        }
                        if (memberType.equals("PROFESSOR") && !(member instanceof ProfessorMember)) {
                            return false;
                        }
                        if (memberType.equals("ADMIN")) {
                            // Admin은 StudentMember도 ProfessorMember도 아닌 Member
                            if (member instanceof StudentMember || member instanceof ProfessorMember) {
                                return false;
                            }
                        }
                    }

                    // Filter by department (for students and professors)
                    if (deptCode != null && !deptCode.isEmpty() && !deptCode.equals("ALL")) {
                        if (member instanceof StudentMember) {
                            StudentMember student = (StudentMember) member;
                            if (!deptCode.equals(student.getDepartment().getDeptCode())) {
                                return false;
                            }
                        } else if (member instanceof ProfessorMember) {
                            ProfessorMember professor = (ProfessorMember) member;
                            if (!deptCode.equals(professor.getDepartment().getDeptCode())) {
                                return false;
                            }
                        } else {
                            return false; // Admin doesn't have department
                        }
                    }

                    // Filter by grade (only for students)
                    if (stuGrade != null && stuGrade > 0) {
                        if (member instanceof StudentMember) {
                            StudentMember student = (StudentMember) member;
                            if (!stuGrade.equals(student.getStuGrade())) {
                                return false;
                            }
                        } else {
                            return false; // Not a student
                        }
                    }

                    // Filter by name (search)
                    if (searchName != null && !searchName.isEmpty()) {
                        if (!member.getName().contains(searchName)) {
                            return false;
                        }
                    }

                    return true;
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private UserManagementDTO convertToDTO(Member member) {
        UserManagementDTO dto = new UserManagementDTO();
        dto.setMemberNo(member.getMemberNo());
        dto.setMemberName(member.getName());
        dto.setEmail(member.getEmail());
        dto.setPhone(member.getPhone());

        if (member instanceof StudentMember) {
            StudentMember student = (StudentMember) member;
            dto.setMemberType("STUDENT");
            if (student.getDepartment() != null) {
                dto.setDeptCode(student.getDepartment().getDeptCode());
                dto.setDeptName(student.getDepartment().getDeptName());
            }
            dto.setStuGrade(student.getStuGrade());
            dto.setEnrollmentStatus(student.getEnrollmentStatus());
        } else if (member instanceof ProfessorMember) {
            ProfessorMember professor = (ProfessorMember) member;
            dto.setMemberType("PROFESSOR");
            if (professor.getDepartment() != null) {
                dto.setDeptCode(professor.getDepartment().getDeptCode());
                dto.setDeptName(professor.getDepartment().getDeptName());
            }
            dto.setOfficeLocation(professor.getOfficeRoom());
            dto.setPosition(professor.getPosition());
        } else {
            dto.setMemberType("ADMIN");
        }

        return dto;
    }

    public UserManagementDTO getUserByMemberNo(String memberNo) {
        Member member = memberRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new RuntimeException("User not found with memberNo: " + memberNo));
        return convertToDTO(member);
    }
}
