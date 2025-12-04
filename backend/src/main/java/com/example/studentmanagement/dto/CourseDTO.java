package com.example.studentmanagement.dto;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.CourseSchedule;

import java.util.List;
import java.util.stream.Collectors;

public class CourseDTO {
    private String courseCode;
    private int academicYear;
    private int semester;
    private String courseClass;
    private int maxStu;
    private String classroom;
    private String courseStatus;
    private String courseObjectives;
    private String courseContent;
    private String evaluationMethod;
    private String textbookInfo;
    private String subjectName;
    private String professorName;
    private int currentStudents;
    private List<ScheduleDTO> schedules;
    private int credit;
    private String departmentName;

    public CourseDTO(Course course, int currentStudents, String professorName, List<CourseSchedule> schedules, int credit) {
        this.courseCode = course.getCourseCode();
        this.academicYear = course.getAcademicYear();
        this.semester = course.getSemester();
        this.courseClass = course.getCourseClass();
        this.maxStu = course.getMaxStu();
        this.classroom = course.getClassroom();
        this.courseStatus = course.getCourseStatus();
        this.courseObjectives = course.getCourseObjectives();
        this.courseContent = course.getCourseContent();
        this.evaluationMethod = course.getEvaluationMethod();
        this.textbookInfo = course.getTextbookInfo();
        this.subjectName = course.getSubject() != null ? course.getSubject().getSName() : "N/A";
        this.professorName = professorName;
        this.currentStudents = currentStudents;
        this.schedules = schedules.stream().map(ScheduleDTO::new).collect(Collectors.toList());
        this.credit = credit;
        this.departmentName = course.getSubject() != null && course.getSubject().getDepartment() != null ? course.getSubject().getDepartment().getDeptName() : "N/A";
    }

    // Getters and Setters

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public int getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(int academicYear) {
        this.academicYear = academicYear;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getCourseClass() {
        return courseClass;
    }

    public void setCourseClass(String courseClass) {
        this.courseClass = courseClass;
    }

    public int getMaxStu() {
        return maxStu;
    }

    public void setMaxStu(int maxStu) {
        this.maxStu = maxStu;
    }

    public String getClassroom() {
        return classroom;
    }

    public void setClassroom(String classroom) {
        this.classroom = classroom;
    }

    public String getCourseStatus() {
        return courseStatus;
    }

    public void setCourseStatus(String courseStatus) {
        this.courseStatus = courseStatus;
    }

    public String getCourseObjectives() {
        return courseObjectives;
    }

    public void setCourseObjectives(String courseObjectives) {
        this.courseObjectives = courseObjectives;
    }

    public String getCourseContent() {
        return courseContent;
    }

    public void setCourseContent(String courseContent) {
        this.courseContent = courseContent;
    }

    public String getEvaluationMethod() {
        return evaluationMethod;
    }

    public void setEvaluationMethod(String evaluationMethod) {
        this.evaluationMethod = evaluationMethod;
    }

    public String getTextbookInfo() {
        return textbookInfo;
    }

    public void setTextbookInfo(String textbookInfo) {
        this.textbookInfo = textbookInfo;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getProfessorName() {
        return professorName;
    }

    public void setProfessorName(String professorName) {
        this.professorName = professorName;
    }

    public int getCurrentStudents() {
        return currentStudents;
    }

    public void setCurrentStudents(int currentStudents) {
        this.currentStudents = currentStudents;
    }

    public List<ScheduleDTO> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<ScheduleDTO> schedules) {
        this.schedules = schedules;
    }

    public int getCredit() {
        return credit;
    }

    public void setCredit(int credit) {
        this.credit = credit;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public static class ScheduleDTO {
        private int dayOfWeek;
        private String startTime;
        private String endTime;

        public ScheduleDTO(CourseSchedule schedule) {
            this.dayOfWeek = schedule.getDayOfWeek();
            this.startTime = schedule.getStartTime().toString();
            this.endTime = schedule.getEndTime().toString();
        }

        // Getters and Setters

        public int getDayOfWeek() {
            return dayOfWeek;
        }

        public void setDayOfWeek(int dayOfWeek) {
            this.dayOfWeek = dayOfWeek;
        }

        public String getStartTime() {
            return startTime;
        }

        public void setStartTime(String startTime) {
            this.startTime = startTime;
        }

        public String getEndTime() {
            return endTime;
        }

        public void setEndTime(String endTime) {
            this.endTime = endTime;
        }
    }
}
