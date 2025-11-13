package com.example.studentmanagement;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity // 이 클래스는 데이터베이스 테이블과 매핑되는 클래스임을 선언
@Getter // Lombok 라이브러리가 각 필드의 getter 메소드(getName(), getMajor() 등)를 자동으로 만들어줌
public class Student {

    @Id // 이 필드가 테이블의 Primary Key(기본 키)임을 명시
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB가 ID를 자동으로 생성하고 관리하도록 설정
    private Long id;

    private String name;

    private String major;
}