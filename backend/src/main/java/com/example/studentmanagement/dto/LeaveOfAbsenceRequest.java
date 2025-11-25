package com.example.studentmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LeaveOfAbsenceRequest {

    // 신청 구분: "휴학" 또는 "복학"
    private String type;

    // 세부 구분: "일반휴학", "군입대휴학", "질병휴학", "창업휴학", "육아휴학", "일반복학", "제대복학"
    private String category;

    // 신청 년도
    private Integer year;

    // 신청 학기 (1 또는 2)
    private Integer semester;

    // 사유
    private String reason;

    // 연락처
    private String contactNumber;

    // 주소
    private String address;

    // 첨부 서류 (파일명들을 콤마로 구분)
    private String documents;
}
