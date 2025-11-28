package com.example.studentmanagement.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@JsonIgnoreProperties({"mPwd", "mNum", "hibernateLazyInitializer", "handler"})
@Table(name = "member")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    @Id
    @Column(name = "m_id", length = 50)
    private String memberId;

    @Column(name = "m_pwd")
    private String password;

    @Column(name = "m_name", length = 100)
    private String name;

    @Column(name = "m_type", length = 20)
    private String memberType;

    @Column(name = "m_no", length = 20, unique = true)
    private String memberNo;

    @Column(name = "m_email", unique = true)
    private String email;

    @Column(name = "m_phone", length = 20)
    private String phone;

    @Column(name = "m_num", length = 14, unique = true)
    private String residentNumber;

    @Column(name = "m_addr", length = 500)
    private String address;

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
