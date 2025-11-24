package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "member")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    @Id
    @Column(name = "m_id", length = 50)
    private String mId;

    @Column(name = "m_pwd")
    private String mPwd;

    @Column(name = "m_name", length = 100)
    private String mName;

    @Column(name = "m_type", length = 20)
    private String mType;

    @Column(name = "m_no", length = 20, unique = true)
    private String mNo;

    @Column(name = "m_email", unique = true)
    private String mEmail;

    @Column(name = "m_phone", length = 20)
    private String mPhone;

    @Column(name = "m_num", length = 14, unique = true)
    private String mNum;

    @Column(name = "m_birth")
    @Temporal(TemporalType.DATE)
    private Date mBirth;

    @Column(name = "m_addr", length = 500)
    private String mAddr;

    @ManyToOne
    @JoinColumn(name = "dept_code")
    private Department department;

    @Column(name = "stu_grade")
    private Integer stuGrade;

    @Column(name = "enrollment_status", length = 20)
    private String enrollmentStatus;

    @Column(name = "position", length = 50)
    private String position;

    @Column(name = "office_room", length = 50)
    private String officeRoom;

    @Column(name = "major_field", length = 200)
    private String majorField;

    @Column(name = "start_date")
    @Temporal(TemporalType.DATE)
    private Date startDate;
}
