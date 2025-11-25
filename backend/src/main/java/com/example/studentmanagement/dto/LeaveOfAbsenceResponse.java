package com.example.studentmanagement.dto;

import com.example.studentmanagement.LeaveOfAbsence;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class LeaveOfAbsenceResponse {

    private Long id;
    private String type;
    private String category;
    private Integer year;
    private Integer semester;
    private LocalDate applicationDate;
    private String status;
    private String statusColor;
    private String reason;
    private String rejectReason;
    private String contactNumber;
    private String address;
    private List<String> documents;

    // Entity를 Response DTO로 변환하는 정적 팩토리 메서드
    public static LeaveOfAbsenceResponse fromEntity(LeaveOfAbsence entity) {
        LeaveOfAbsenceResponse response = new LeaveOfAbsenceResponse();
        response.setId(entity.getId());
        response.setType(entity.getType());
        response.setCategory(entity.getCategory());
        response.setYear(entity.getYear());
        response.setSemester(entity.getSemester());
        response.setApplicationDate(entity.getApplicationDate());
        response.setStatus(entity.getStatus());
        response.setStatusColor(getStatusColor(entity.getStatus()));
        response.setReason(entity.getReason());
        response.setRejectReason(entity.getRejectReason());
        response.setContactNumber(entity.getContactNumber());
        response.setAddress(entity.getAddress());

        // documents를 List로 변환
        if (entity.getDocuments() != null && !entity.getDocuments().isEmpty()) {
            response.setDocuments(Arrays.asList(entity.getDocuments().split(",")));
        }

        return response;
    }

    // 상태에 따른 색상 클래스 반환
    private static String getStatusColor(String status) {
        return switch (status) {
            case "승인" -> "bg-green-100 text-green-800";
            case "검토중" -> "bg-yellow-100 text-yellow-800";
            case "거절" -> "bg-red-100 text-red-800";
            case "신청완료" -> "bg-blue-100 text-blue-800";
            default -> "bg-gray-100 text-gray-800";
        };
    }
}
