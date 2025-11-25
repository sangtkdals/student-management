package com.example.studentmanagement;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "leave_of_absence")
@Getter
@Setter
@NoArgsConstructor
public class LeaveOfAbsence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 학생 ID (추후 Student 엔티티와 관계 설정 가능)
    @Column(nullable = false)
    private Long studentId;

    // 신청 구분: "휴학" 또는 "복학"
    @Column(nullable = false, length = 10)
    private String type;

    // 세부 구분: "일반휴학", "군입대휴학", "질병휴학", "창업휴학", "육아휴학", "일반복학", "제대복학"
    @Column(nullable = false, length = 20)
    private String category;

    // 신청 년도
    @Column(nullable = false)
    private Integer year;

    // 신청 학기 (1 또는 2)
    @Column(nullable = false)
    private Integer semester;

    // 신청일자
    @Column(nullable = false)
    private LocalDate applicationDate;

    // 신청 상태: "신청완료", "검토중", "승인", "거절"
    @Column(nullable = false, length = 20)
    private String status;

    // 사유
    @Column(columnDefinition = "TEXT")
    private String reason;

    // 거절 사유 (상태가 "거절"일 경우)
    @Column(columnDefinition = "TEXT")
    private String rejectReason;

    // 연락처
    @Column(length = 20)
    private String contactNumber;

    // 주소
    @Column(length = 255)
    private String address;

    // 첨부 서류 (파일명들을 콤마로 구분해서 저장, 또는 별도 테이블로 분리 가능)
    @Column(columnDefinition = "TEXT")
    private String documents;

    // 생성 시간
    @Column(nullable = false, updatable = false)
    private LocalDate createdAt;

    // 수정 시간
    private LocalDate updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
        applicationDate = LocalDate.now();
        if (status == null) {
            status = "신청완료";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDate.now();
    }
}
