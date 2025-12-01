package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "professor_member")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "m_id")
public class ProfessorMember extends Member {
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
