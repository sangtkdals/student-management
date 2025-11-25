package com.example.studentmanagement;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "member")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @Column(name = "m_id", length = 50)
    private String mId; // 로그인 ID

    @Column(name = "m_pwd", length = 255)
    private String mPwd; // 비밀번호

    @Column(name = "m_name", length = 100)
    private String mName; // 이름

    @Column(name = "m_type", length = 20)
    private String mType; // STUDENT, PROFESSOR, ADMIN

    @Column(name = "m_no", unique = true, length = 20)
    private String mNo; // 학번/교수번호/관리자번호

    @Column(name = "m_email", unique = true, length = 255)
    private String mEmail; // 이메일

    @Column(name = "m_phone", length = 20)
    private String mPhone; // 전화번호

    @Column(name = "m_num", unique = true, length = 14)
    private String mNum; // 주민등록번호

    @Column(name = "m_birth")
    private LocalDate mBirth; // 생년월일

    @Column(name = "m_addr", length = 500)
    private String mAddr; // 주소

    @Column(name = "dept_code", length = 20)
    private String deptCode; // 학과 코드

    @Column(name = "stu_grade")
    private Integer stuGrade; // 학년 (학생인 경우)

    @Column(name = "enrollment_status", length = 20)
    private String enrollmentStatus; // ENROLLED, LEAVE, GRADUATED

    @Column(name = "position", length = 50)
    private String position; // 직책 (교수/관리자인 경우)

    @Column(name = "office_room", length = 50)
    private String officeRoom; // 연구실/사무실

    @Column(name = "major_field", length = 200)
    private String majorField; // 전공 분야 (교수인 경우)

    @Column(name = "start_date")
    private LocalDate startDate; // 입학일/임용일
}
