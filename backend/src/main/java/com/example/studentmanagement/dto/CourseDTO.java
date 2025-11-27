package com.example.studentmanagement.dto;

public interface CourseDTO {
    String getCourseCode();   // 강의 코드 (C25_2_01)
    String getSubjectName();  // 과목명 (컴퓨터네트워크)
    String getCourseClass();  // 분반
    String getCourseTime();   // 시간
    String getClassroom();    // 강의실
    Integer getCurrentStudents(); // 수강 인원
}