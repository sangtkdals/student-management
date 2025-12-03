package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.Tuition;
import com.example.studentmanagement.dto.BatchTuitionRequestDTO;
import com.example.studentmanagement.dto.StudentTuitionStatusDTO;
import com.example.studentmanagement.dto.TuitionDTO;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.TuitionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TuitionService {

    private final TuitionRepository tuitionRepository;
    private final MemberRepository memberRepository;

    public TuitionService(TuitionRepository tuitionRepository, MemberRepository memberRepository) {
        this.tuitionRepository = tuitionRepository;
        this.memberRepository = memberRepository;
    }

    // 모든 등록금 조회
    public List<TuitionDTO> getAllTuitions() {
        List<Tuition> tuitions = tuitionRepository.findAll();
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 등록금 ID로 조회
    public TuitionDTO getTuitionById(Integer tuitionId) {
        Tuition tuition = tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new EntityNotFoundException("Tuition not found with id: " + tuitionId));
        return new TuitionDTO(tuition, getStudentName(tuition));
    }

    // 학생별 등록금 조회
    public List<TuitionDTO> getTuitionsByStudent(String studentNo) {
        List<Tuition> tuitions = tuitionRepository.findByStudent_MemberNo(studentNo);
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 학년도 및 학기별 등록금 조회
    public List<TuitionDTO> getTuitionsByAcademicYearAndSemester(Integer academicYear, Integer semester) {
        List<Tuition> tuitions = tuitionRepository.findByAcademicYearAndSemester(academicYear, semester);
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 결제 상태별 등록금 조회
    public List<TuitionDTO> getTuitionsByPaymentStatus(String paymentStatus) {
        List<Tuition> tuitions = tuitionRepository.findByPaymentStatus(paymentStatus);
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 미납 등록금 조회
    public List<TuitionDTO> getUnpaidTuitions() {
        List<Tuition> tuitions = tuitionRepository.findUnpaidTuitions();
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 마감일이 지난 미납 등록금 조회
    public List<TuitionDTO> getOverdueTuitions() {
        List<Tuition> tuitions = tuitionRepository.findOverdueTuitions();
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 등록금 생성
    @Transactional
    public TuitionDTO createTuition(TuitionDTO tuitionDTO) {
        // 학번 유효성 검사
        Member student = memberRepository.findByMemberNo(tuitionDTO.getStudentNo())
                .orElseThrow(() -> new IllegalArgumentException("오류(학번 미 일치)"));

        // 등록금액 유효성 검사
        if (tuitionDTO.getTuitionAmount() != null && tuitionDTO.getTuitionAmount() < 0) {
            throw new IllegalArgumentException("오류(등록금액 확인해주세요)");
        }

        // 장학금액 유효성 검사
        if (tuitionDTO.getScholarshipAmount() != null && tuitionDTO.getScholarshipAmount() < 0) {
            throw new IllegalArgumentException("장학금액은 0원 이상이어야 합니다.");
        }

        // 납부금액 유효성 검사
        if (tuitionDTO.getPaidAmount() != null && tuitionDTO.getPaidAmount() < 0) {
            throw new IllegalArgumentException("납부금액은 0원 이상이어야 합니다.");
        }

        // 학기 유효성 검사
        if (tuitionDTO.getSemester() != null) {
            validateSemester(tuitionDTO.getSemester());
        }

        Tuition tuition = new Tuition();
        tuition.setStudent(student);
        tuition.setAcademicYear(tuitionDTO.getAcademicYear());
        tuition.setSemester(tuitionDTO.getSemester());
        tuition.setTuitionAmount(tuitionDTO.getTuitionAmount());
        tuition.setScholarshipAmount(tuitionDTO.getScholarshipAmount());
        tuition.setPaidAmount(tuitionDTO.getPaidAmount());
        tuition.setBillDate(tuitionDTO.getBillDate());
        tuition.setDueDate(tuitionDTO.getDueDate());
        tuition.setPaidDate(tuitionDTO.getPaidDate());
        tuition.setPaymentMethod(tuitionDTO.getPaymentMethod());
        tuition.setReceiptNo(tuitionDTO.getReceiptNo());
        tuition.setPaymentStatus(tuitionDTO.getPaymentStatus());

        Tuition savedTuition = tuitionRepository.save(tuition);
        return new TuitionDTO(savedTuition, getStudentName(savedTuition));
    }

    // 등록금 수정
    @Transactional
    public TuitionDTO updateTuition(Integer tuitionId, TuitionDTO tuitionDTO) {
        Tuition tuition = tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new EntityNotFoundException("Tuition not found with id: " + tuitionId));

        if (tuitionDTO.getStudentNo() != null) {
            Member student = memberRepository.findByMemberNo(tuitionDTO.getStudentNo())
                    .orElseThrow(() -> new IllegalArgumentException("오류(학번 미 일치)"));
            tuition.setStudent(student);
        }

        if (tuitionDTO.getAcademicYear() != null) {
            tuition.setAcademicYear(tuitionDTO.getAcademicYear());
        }
        if (tuitionDTO.getSemester() != null) {
            validateSemester(tuitionDTO.getSemester());
            tuition.setSemester(tuitionDTO.getSemester());
        }
        if (tuitionDTO.getTuitionAmount() != null) {
            if (tuitionDTO.getTuitionAmount() < 0) {
                throw new IllegalArgumentException("오류(등록금액 확인해주세요)");
            }
            tuition.setTuitionAmount(tuitionDTO.getTuitionAmount());
        }
        if (tuitionDTO.getScholarshipAmount() != null) {
            if (tuitionDTO.getScholarshipAmount() < 0) {
                throw new IllegalArgumentException("장학금액은 0원 이상이어야 합니다.");
            }
            tuition.setScholarshipAmount(tuitionDTO.getScholarshipAmount());
        }
        if (tuitionDTO.getPaidAmount() != null) {
            if (tuitionDTO.getPaidAmount() < 0) {
                throw new IllegalArgumentException("납부금액은 0원 이상이어야 합니다.");
            }
            tuition.setPaidAmount(tuitionDTO.getPaidAmount());
        }
        if (tuitionDTO.getBillDate() != null) {
            tuition.setBillDate(tuitionDTO.getBillDate());
        }
        if (tuitionDTO.getDueDate() != null) {
            tuition.setDueDate(tuitionDTO.getDueDate());
        }
        if (tuitionDTO.getPaidDate() != null) {
            tuition.setPaidDate(tuitionDTO.getPaidDate());
        }
        if (tuitionDTO.getPaymentMethod() != null) {
            tuition.setPaymentMethod(tuitionDTO.getPaymentMethod());
        }
        if (tuitionDTO.getReceiptNo() != null) {
            tuition.setReceiptNo(tuitionDTO.getReceiptNo());
        }
        if (tuitionDTO.getPaymentStatus() != null) {
            tuition.setPaymentStatus(tuitionDTO.getPaymentStatus());
        }

        Tuition updatedTuition = tuitionRepository.save(tuition);
        return new TuitionDTO(updatedTuition, getStudentName(updatedTuition));
    }

    // 등록금 삭제
    @Transactional
    public void deleteTuition(Integer tuitionId) {
        Tuition tuition = tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new EntityNotFoundException("Tuition not found with id: " + tuitionId));
        tuitionRepository.delete(tuition);
    }

    // 학생 이름 가져오기 헬퍼 메서드
    private String getStudentName(Tuition tuition) {
        if (tuition.getStudent() != null) {
            return tuition.getStudent().getName();
        }
        return null;
    }

    // 학기 유효성 검사
    private void validateSemester(Integer semester) {
        if (semester == null) {
            return;
        }
        if (semester < 1 || semester > 4) {
            throw new IllegalArgumentException("학기는 1(1학기), 2(2학기), 3(여름계절학기), 4(겨울계절학기) 중 하나여야 합니다.");
        }
    }

    // 학기 번호를 문자열로 변환
    public static String getSemesterLabel(Integer semester) {
        if (semester == null) {
            return "";
        }
        switch (semester) {
            case 1:
                return "1학기";
            case 2:
                return "2학기";
            case 3:
                return "여름계절학기";
            case 4:
                return "겨울계절학기";
            default:
                return String.valueOf(semester);
        }
    }

        @Transactional
    public int createTuitionBillsForDepartment(String deptCode, int year, int semester) {
        // 1. 대상 학과에 속한 학생 목록 조회
        List<Member> students = memberRepository.findByDepartment_DeptCode(deptCode);

        if (students.isEmpty()) {
            return 0; // 처리할 학생 없음
        }

        // 2. 등록금액 결정 (여기서는 예시로 고정 금액 사용)
        // 실제 애플리케이션에서는 학과별 또는 학년별 등록금 정보를 DB에서 조회해야 합니다.
        int tuitionAmount = 5000000;

        List<Tuition> newTuitions = new java.util.ArrayList<>();

        // 3. 각 학생을 순회하며 고지서 생성
        for (Member student : students) {
            // 3-1. 이미 해당 학기에 고지서가 생성되었는지 확인
            boolean alreadyExists = tuitionRepository.existsByStudent_MemberNoAndAcademicYearAndSemester(student.getMemberNo(), year, semester);

            if (!alreadyExists) {
                // 3-2. 고지서가 없으면 새로 생성
                Tuition newTuition = new Tuition();
                newTuition.setStudent(student);
                newTuition.setAcademicYear(year);
                newTuition.setSemester(semester);
                newTuition.setTuitionAmount(tuitionAmount);
                newTuition.setScholarshipAmount(0); // 기본 장학금 0
                newTuition.setPaidAmount(0); // 기본 납부액 0
                newTuition.setPaymentStatus("UNPAID"); // 기본 상태 '미납'
                newTuition.setBillDate(new java.util.Date()); // 고지서 생성일

                // 마감일 (한 달 뒤)
                java.util.Calendar cal = java.util.Calendar.getInstance();
                cal.add(java.util.Calendar.MONTH, 1);
                newTuition.setDueDate(cal.getTime());

                newTuitions.add(newTuition);
            }
        }

        // 4. 생성된 모든 고지서를 한번에 DB에 저장
        if (!newTuitions.isEmpty()) {
            tuitionRepository.saveAll(newTuitions);
        }

        return newTuitions.size();
    }

    // 학과, 학년도, 학기별 등록금 조회
    public List<TuitionDTO> getTuitionsByDepartmentAndYearAndSemester(String deptCode, Integer academicYear, Integer semester) {
        List<Tuition> tuitions = tuitionRepository.findByDepartmentCodeAndAcademicYearAndSemester(deptCode, academicYear, semester);
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 학과별 학생 목록 조회 (등록금 생성 여부 포함)
    public List<StudentTuitionStatusDTO> getStudentsByDepartmentWithTuitionStatus(String deptCode, Integer academicYear, Integer semester) {
        // 해당 학과의 모든 학생 조회
        List<Member> students = memberRepository.findByDepartment_DeptCode(deptCode);

        // 각 학생에 대해 등록금 생성 여부 확인
        return students.stream()
                .map(student -> {
                    StudentTuitionStatusDTO dto = new StudentTuitionStatusDTO();
                    dto.setStudentNo(student.getMemberNo());
                    dto.setStudentName(student.getName());
                    dto.setDeptCode(student.getDepartment() != null ? student.getDepartment().getDeptCode() : null);
                    dto.setDeptName(student.getDepartment() != null ? student.getDepartment().getDeptName() : null);

                    // StudentMember로 캐스팅하여 학년 및 재적 상태 정보 가져오기
                    if (student instanceof com.example.studentmanagement.beans.StudentMember) {
                        com.example.studentmanagement.beans.StudentMember studentMember =
                            (com.example.studentmanagement.beans.StudentMember) student;
                        dto.setStuGrade(studentMember.getStuGrade());
                        dto.setEnrollmentStatus(studentMember.getEnrollmentStatus());
                    }

                    // 해당 학년도/학기의 등록금 존재 여부 확인
                    List<Tuition> existingTuitions = tuitionRepository.findByStudentAndAcademicYearAndSemester(
                        student.getMemberNo(), academicYear, semester
                    );

                    if (!existingTuitions.isEmpty()) {
                        Tuition existingTuition = existingTuitions.get(0);
                        dto.setHasExistingTuition(true);
                        dto.setExistingTuitionId(existingTuition.getTuitionId());
                        dto.setPaymentStatus(existingTuition.getPaymentStatus());
                    } else {
                        dto.setHasExistingTuition(false);
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 개선된 일괄 등록금 생성 (선택된 학생들만)
    @Transactional
    public int batchCreateTuitions(BatchTuitionRequestDTO request) {
        validateSemester(request.getSemester());

        // 등록금액 유효성 검사
        if (request.getTuitionAmount() == null || request.getTuitionAmount() < 0) {
            throw new IllegalArgumentException("등록금액을 확인해주세요");
        }

        // 장학금액 유효성 검사
        if (request.getScholarshipAmount() != null && request.getScholarshipAmount() < 0) {
            throw new IllegalArgumentException("장학금액은 0원 이상이어야 합니다.");
        }

        List<Member> targetStudents;

        // 특정 학생들이 선택되었는지 확인
        if (request.getStudentNumbers() != null && !request.getStudentNumbers().isEmpty()) {
            // 선택된 학생들만 조회
            targetStudents = request.getStudentNumbers().stream()
                    .map(studentNo -> memberRepository.findByMemberNo(studentNo)
                            .orElseThrow(() -> new IllegalArgumentException("학번을 찾을 수 없습니다: " + studentNo)))
                    .collect(Collectors.toList());
        } else {
            // 학과 전체 학생 조회
            targetStudents = memberRepository.findByDepartment_DeptCode(request.getDeptCode());
        }

        if (targetStudents.isEmpty()) {
            return 0;
        }

        // 고지서 생성일 설정 (요청에서 제공되지 않으면 현재 날짜)
        Date billDate = request.getBillDate() != null ? request.getBillDate() : new Date();

        // 마감일 설정 (요청에서 제공되지 않으면 고지서 생성일로부터 한 달 후)
        Date dueDate;
        if (request.getDueDate() != null) {
            dueDate = request.getDueDate();
        } else {
            Calendar cal = Calendar.getInstance();
            cal.setTime(billDate);
            cal.add(Calendar.MONTH, 1);
            dueDate = cal.getTime();
        }

        List<Tuition> newTuitions = new java.util.ArrayList<>();

        for (Member student : targetStudents) {
            // 이미 해당 학기에 고지서가 생성되었는지 확인
            boolean alreadyExists = tuitionRepository.existsByStudent_MemberNoAndAcademicYearAndSemester(
                    student.getMemberNo(), request.getAcademicYear(), request.getSemester());

            if (!alreadyExists) {
                Tuition newTuition = new Tuition();
                newTuition.setStudent(student);
                newTuition.setAcademicYear(request.getAcademicYear());
                newTuition.setSemester(request.getSemester());
                newTuition.setTuitionAmount(request.getTuitionAmount());
                newTuition.setScholarshipAmount(request.getScholarshipAmount() != null ? request.getScholarshipAmount() : 0);
                newTuition.setPaidAmount(0);
                newTuition.setPaymentStatus("UNPAID");
                newTuition.setBillDate(billDate);
                newTuition.setDueDate(dueDate);

                newTuitions.add(newTuition);
            }
        }

        if (!newTuitions.isEmpty()) {
            tuitionRepository.saveAll(newTuitions);
        }

        return newTuitions.size();
    }
}
