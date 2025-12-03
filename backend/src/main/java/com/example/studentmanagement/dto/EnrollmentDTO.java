package com.example.studentmanagement.dto;

import com.example.studentmanagement.beans.Enrollment;
import lombok.Data;

import java.util.Date;

@Data
public class EnrollmentDTO {
    private Integer enrollmentId;
    private Date enrollmentDate;
    private String enrollmentStatus;
    private CourseDTO course;

    public EnrollmentDTO(Enrollment enrollment) {
        this.enrollmentId = enrollment.getEnrollmentId();
        this.enrollmentDate = enrollment.getEnrollmentDate();
        this.enrollmentStatus = enrollment.getEnrollmentStatus();
        
        // Manually create CourseDTO from the Course entity within Enrollment
        if (enrollment.getCourse() != null) {
            com.example.studentmanagement.beans.Course courseEntity = enrollment.getCourse();
            int currentStudents = 0; // This might need a separate query if required on this screen
            String professorName = courseEntity.getProfessor() != null ? courseEntity.getProfessor().getName() : "N/A";

            this.course = new CourseDTO(
                courseEntity,
                currentStudents,
                professorName,
                courseEntity.getCourseSchedules(),
                courseEntity.getSubject() != null ? courseEntity.getSubject().getCredit() : 0
            );
        }
    }
}
