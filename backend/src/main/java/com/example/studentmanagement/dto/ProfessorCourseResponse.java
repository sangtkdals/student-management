package com.example.studentmanagement.dto;

public class ProfessorCourseResponse {
    private String courseCode;
    private String subjectName;
    private String courseClass; 
    private String classroom;   
    private int currentStudents; 
    private int credit;          
    private String courseTime;

    public ProfessorCourseResponse() {}

    public ProfessorCourseResponse(String courseCode, String subjectName, String courseClass, 
                                   String classroom, int currentStudents, int credit, String courseTime) {
        this.courseCode = courseCode;
        this.subjectName = subjectName;
        this.courseClass = courseClass;
        this.classroom = classroom;
        this.currentStudents = currentStudents;
        this.credit = credit;
        this.courseTime = courseTime;
    }

    public String getCourseCode() { return courseCode; }
    public String getSubjectName() { return subjectName; }
    public String getCourseClass() { return courseClass; }
    public String getClassroom() { return classroom; }
    public int getCurrentStudents() { return currentStudents; }
    public int getCredit() { return credit; }
    public String getCourseTime() { return courseTime; }
    
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public void setCourseTime(String courseTime) { this.courseTime = courseTime; }
}
