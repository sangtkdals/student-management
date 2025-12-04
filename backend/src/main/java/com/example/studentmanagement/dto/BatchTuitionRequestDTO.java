package com.example.studentmanagement.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class BatchTuitionRequestDTO {
    private String deptCode;
    private Integer academicYear;
    private Integer semester;
    private Integer tuitionAmount;
    private Integer scholarshipAmount = 0; // 기본값 0
    private Date billDate;
    private Date dueDate;
    private List<String> studentNumbers; // 선택된 학생 번호 리스트 (null이면 전체)
}
