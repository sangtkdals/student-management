-- =====================================================
-- DEU University System - MySQL Schema (UTF8MB4)
-- =====================================================

-- Create and select database
CREATE DATABASE IF NOT EXISTS `deu` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `deu`;

-- Ensure default engine is InnoDB for FK support
SET default_storage_engine=INNODB;

-- =====================================================
-- 1) department
-- =====================================================
DROP TABLE IF EXISTS department;
CREATE TABLE department (
    dept_code      VARCHAR(20)  PRIMARY KEY,
    dept_name      VARCHAR(100),
    college_name   VARCHAR(100),
    dept_phone     VARCHAR(20),
    dept_office    VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 2) member (Supertype)
-- =====================================================
DROP TABLE IF EXISTS member;
CREATE TABLE `member` (
   `m_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
   `m_pwd` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
   `m_name` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
   `m_type` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci' COMMENT '회원 유형: 학생(S) 또는 교수(P)',
   `m_no` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci' COMMENT '회원 번호 (학번 또는 교번)',
   `m_email` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
   `m_phone` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
   `m_num` VARCHAR(14) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci' COMMENT '주민등록번호/고유 식별번호',
   `m_addr` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
   `dept_code` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci' COMMENT '학과 코드',
    
   PRIMARY KEY (`m_id`) USING BTREE,
   UNIQUE INDEX `m_no` (`m_no`) USING BTREE, -- 외부 테이블이 참조할 PK와 같은 역할 (Unique Index 필수)
   UNIQUE INDEX `m_email` (`m_email`) USING BTREE,
   UNIQUE INDEX `m_num` (`m_num`) USING BTREE,
   CONSTRAINT `fk_member_dept` FOREIGN KEY (`dept_code`) REFERENCES `department` (`dept_code`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_0900_ai_ci' ENGINE=InnoDB;

-- =====================================================
-- 2-1) student_member (Subtype)
-- =====================================================
DROP TABLE IF EXISTS student_member;
CREATE TABLE `student_member` (
    `m_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci', 
   `stu_grade` INT NULL DEFAULT NULL COMMENT '학년',
   `enrollment_status` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci' COMMENT '재학 상태',
    
    PRIMARY KEY (`m_id`) USING BTREE,
    CONSTRAINT `fk_student_member_id` FOREIGN KEY (`m_id`) REFERENCES `member` (`m_id`) 
        ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_0900_ai_ci' ENGINE=InnoDB;

-- =====================================================
-- 2-2) professor_member (Subtype)
-- =====================================================
DROP TABLE IF EXISTS professor_member;
CREATE TABLE `professor_member` (
    `m_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
   `position` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci' COMMENT '직급',
   `office_room` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci' COMMENT '연구실/사무실',
   `major_field` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci' COMMENT '전공 분야',
   `start_date` DATE NULL DEFAULT NULL COMMENT '임용/입학 날짜',
    
    PRIMARY KEY (`m_id`) USING BTREE,
    CONSTRAINT `fk_professor_member_id` FOREIGN KEY (`m_id`) REFERENCES `member` (`m_id`) 
        ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_0900_ai_ci' ENGINE=InnoDB;

-- =====================================================
-- 3) subject
-- =====================================================
CREATE TABLE `subject` (
	`s_code` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`s_name` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`credit` INT NULL DEFAULT NULL,
	`s_type` INT NULL DEFAULT NULL,
	`dept_code` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`s_desc` VARCHAR(2000) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	PRIMARY KEY (`s_code`) USING BTREE,
	INDEX `fk_subject_dept` (`dept_code`) USING BTREE,
	CONSTRAINT `fk_subject_dept` FOREIGN KEY (`dept_code`) REFERENCES `department` (`dept_code`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;


-- =====================================================
-- 4) course
-- =====================================================
CREATE TABLE `course` (
	`course_code` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`academic_year` INT NULL DEFAULT NULL,
	`semester` INT NULL DEFAULT NULL,
	`s_code` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`course_class` VARCHAR(10) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`professor_no` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_stu` INT NULL DEFAULT NULL,
	`classroom` VARCHAR(50) NULL DEFAULT NULL COMMENT '강의실' COLLATE 'utf8mb4_0900_ai_ci',
	`course_objectives` TEXT NULL DEFAULT NULL COMMENT '강의 목표' COLLATE 'utf8mb4_0900_ai_ci',
	`course_content` TEXT NULL DEFAULT NULL COMMENT '강의 내용' COLLATE 'utf8mb4_0900_ai_ci',
	`evaluation_method` JSON NULL DEFAULT NULL COMMENT '강의 평가 방법 및 비율 (JSON 형식)',
	`textbook_info` VARCHAR(1000) NULL DEFAULT NULL COMMENT '교재 정보' COLLATE 'utf8mb4_0900_ai_ci',
	`course_status` VARCHAR(20) NULL DEFAULT NULL COMMENT '개설상태' COLLATE 'utf8mb4_0900_ai_ci',
	PRIMARY KEY (`course_code`) USING BTREE,
	INDEX `fk_course_prof` (`professor_no`) USING BTREE,
	INDEX `fk_course_s_code` (`s_code`) USING BTREE,
	CONSTRAINT `fk_course_prof` FOREIGN KEY (`professor_no`) REFERENCES `member` (`m_no`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `fk_course_s_code` FOREIGN KEY (`s_code`) REFERENCES `subject` (`s_code`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;

-- =====================================================
-- 4-1) course_schedule
-- =====================================================
DROP TABLE IF EXISTS course_schedule;
CREATE TABLE `course_schedule` (
    `schedule_id` INT NOT NULL AUTO_INCREMENT,
    `course_code` VARCHAR(20) NOT NULL,
    `day_of_week` INT NOT NULL COMMENT '1:월, 2:화, 3:수, 4:목, 5:금, 6:토, 7:일',
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    PRIMARY KEY (`schedule_id`),
    CONSTRAINT `fk_schedule_course` FOREIGN KEY (`course_code`) REFERENCES `course` (`course_code`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 5) board
-- =====================================================
DROP TABLE IF EXISTS board;
CREATE TABLE board (
    board_id    INT AUTO_INCREMENT PRIMARY KEY,
    board_code  VARCHAR(50) UNIQUE,
    board_name  VARCHAR(100),
    write_auth  VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 6) post
-- =====================================================
DROP TABLE IF EXISTS post;
CREATE TABLE `post` (
   `post_id` INT NOT NULL AUTO_INCREMENT,
   `board_id` INT NULL DEFAULT NULL,
   `post_title` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
   `post_content` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
   `writer_id` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci', -- 작성자 (학번 또는 교번)
   `view_count` INT NULL DEFAULT '0',
   `created_at` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
   `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
   
   PRIMARY KEY (`post_id`) USING BTREE,
   INDEX `idx_post_board` (`board_id`) USING BTREE,
   INDEX `idx_post_writer` (`writer_id`) USING BTREE,
   CONSTRAINT `fk_post_board` FOREIGN KEY (`board_id`) REFERENCES `board` (`board_id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
   -- member 테이블의 m_no를 참조하도록 재연결
   CONSTRAINT `fk_post_writer` FOREIGN KEY (`writer_id`) REFERENCES `member` (`m_no`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_0900_ai_ci' ENGINE=InnoDB;

-- =====================================================
-- 7) attachment
-- =====================================================
DROP TABLE IF EXISTS attachment;
CREATE TABLE `attachment` (
   `attachment_id` INT NOT NULL AUTO_INCREMENT,
   `post_id` INT NULL DEFAULT NULL,
   `filename` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
   
   PRIMARY KEY (`attachment_id`) USING BTREE,
   CONSTRAINT `fk_attach_post` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_0900_ai_ci' ENGINE=InnoDB;

-- =====================================================
-- 8) tuition
-- =====================================================
DROP TABLE IF EXISTS tuition;
CREATE TABLE `tuition` (
    `tuition_id` INT NOT NULL AUTO_INCREMENT COMMENT '등록금 ID',
    `stu_no` VARCHAR(20) NOT NULL COMMENT '학번 (m_no에서 FK)',
    `academic_year` INT NULL DEFAULT NULL COMMENT '학년도',
    `semester` INT NULL DEFAULT NULL COMMENT '학기',
    `tuition_amount` INT NULL DEFAULT NULL COMMENT '등록금 금액', 
    `scholarship_amount` INT NULL DEFAULT NULL COMMENT '장학금 금액',
    `paid_amount` INT NULL DEFAULT NULL COMMENT '납부 금액',
    `bill_date` DATE NULL DEFAULT NULL COMMENT '고지 일자',
    `due_date` DATE NULL DEFAULT NULL COMMENT '납부 마감 일자',
    `paid_date` DATE NULL DEFAULT NULL COMMENT '납부 일자',
    `payment_method` VARCHAR(50) NULL DEFAULT NULL COMMENT '납부 방법',
    `receipt_no` VARCHAR(50) NULL DEFAULT NULL COMMENT '영수증 번호',
    `payment_status` VARCHAR(20) NULL DEFAULT NULL COMMENT '납부 상태 (UNPAID, PAID, OVERDUE 등)',
    
    PRIMARY KEY (`tuition_id`) USING BTREE,
    UNIQUE INDEX `uk_tuition_receipt` (`receipt_no`) USING BTREE,
    
    CONSTRAINT `fk_tuition_student` FOREIGN KEY (`stu_no`) REFERENCES `member` (`m_no`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB;

-- =====================================================
-- 9) leave_application
-- =====================================================
DROP TABLE IF EXISTS leave_application;
CREATE TABLE `leave_application` (
    `application_id` INT NOT NULL AUTO_INCREMENT,
    `stu_no` VARCHAR(20) NOT NULL, -- 학번 (m_no)
    `leave_type` VARCHAR(20) NULL DEFAULT NULL,
    
    -- Merged columns
    `start_year`         INT,
    `start_semester`     INT,
    `end_year`           INT,
    `end_semester`       INT,
    `application_reason` VARCHAR(1000),
    `application_date`   TIMESTAMP,
    `approval_status`    VARCHAR(20),
    `approval_date`      TIMESTAMP,
    `reject_reason`      VARCHAR(1000),
    
    `approver_id` VARCHAR(50) NULL DEFAULT NULL, -- 승인자 (교수 m_no)
    
    PRIMARY KEY (`application_id`) USING BTREE,
    -- 학번 및 승인자 ID가 member 테이블의 m_no를 참조
    CONSTRAINT `fk_leave_stu` FOREIGN KEY (`stu_no`) REFERENCES `member` (`m_no`) ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT `fk_leave_approver` FOREIGN KEY (`approver_id`) REFERENCES `member` (`m_no`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_0900_ai_ci' ENGINE=InnoDB;

-- =====================================================
-- 10) enrollment
-- =====================================================
DROP TABLE IF EXISTS enrollment;
CREATE TABLE `enrollment` (
    `enrollment_id` INT NOT NULL AUTO_INCREMENT,
    `stu_no` VARCHAR(20) NOT NULL, -- 학번 (m_no)
    `course_code` VARCHAR(20) NOT NULL,
    
    -- Merged columns
    `enrollment_date`  TIMESTAMP,
    `enrollment_status` VARCHAR(20),
    `cancel_date`      TIMESTAMP,
    
    PRIMARY KEY (`enrollment_id`) USING BTREE,
    UNIQUE INDEX `uk_enrollment` (`stu_no`, `course_code`) USING BTREE, -- 중복 수강 신청 방지
    -- 학번이 member 테이블의 m_no를 참조
    CONSTRAINT `fk_enrollment_stu` FOREIGN KEY (`stu_no`) REFERENCES `member` (`m_no`) ON UPDATE NO ACTION ON DELETE NO ACTION,
    -- 강의 코드가 course 테이블을 참조
    CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_code`) REFERENCES `course` (`course_code`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_0900_ai_ci' ENGINE=InnoDB;

-- =====================================================
-- 11) grade
-- =====================================================
DROP TABLE IF EXISTS grade;
CREATE TABLE grade (
    grade_id          INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id     INT UNIQUE,
    midterm_score     DECIMAL(5,2),
    final_score       DECIMAL(5,2),
    assignment_score  DECIMAL(5,2),
    attendance_score  DECIMAL(5,2),
    presentation_score DECIMAL(5,2),
    total_score       DECIMAL(5,2),
    grade_letter      VARCHAR(2),
    grade_point       DECIMAL(3,2),
    CONSTRAINT fk_grade_enroll FOREIGN KEY (enrollment_id) REFERENCES enrollment(enrollment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 12) attendance
-- =====================================================
DROP TABLE IF EXISTS attendance;
CREATE TABLE attendance (
    attendance_id     INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id     INT,
    attendance_date   DATE,
    period            INT,
    attendance_status VARCHAR(20),
    remark            VARCHAR(500),
    CONSTRAINT fk_attend_enroll FOREIGN KEY (enrollment_id) REFERENCES enrollment(enrollment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 13) course_evaluation
-- =====================================================
DROP TABLE IF EXISTS course_evaluation;
CREATE TABLE `course_evaluation` (
    `evaluation_id` INT NOT NULL AUTO_INCREMENT,
    `course_code` VARCHAR(20) NOT NULL,
    `stu_no` VARCHAR(20) NOT NULL, -- 학번 (m_no)
    
    -- Merged columns
    `eval1`           INT,
    `eval2`           INT,
    `eval3`           INT,
    `eval4`           INT,
    `eval5`           INT,
    `total_score`     DECIMAL(3,2),
    `comment`         VARCHAR(2000),
    `evaluation_date` TIMESTAMP,
    
    PRIMARY KEY (`evaluation_id`) USING BTREE,
    UNIQUE INDEX `uk_evaluation` (`course_code`, `stu_no`) USING BTREE, -- 동일 강의 중복 평가 방지
    -- 학번이 member 테이블의 m_no를 참조
    CONSTRAINT `fk_eval_stu` FOREIGN KEY (`stu_no`) REFERENCES `member` (`m_no`) ON UPDATE NO ACTION ON DELETE NO ACTION,
    -- 강의 코드가 course 테이블을 참조
    CONSTRAINT `fk_eval_course` FOREIGN KEY (`course_code`) REFERENCES `course` (`course_code`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_0900_ai_ci' ENGINE=InnoDB;

-- =====================================================
-- 14) academic_schedule
-- =====================================================
DROP TABLE IF EXISTS academic_schedule;
CREATE TABLE academic_schedule (
    schedule_id       INT AUTO_INCREMENT PRIMARY KEY,
    academic_year     INT,
    semester          INT,
    schedule_title    VARCHAR(200),
    schedule_content  VARCHAR(1000),
    start_date        DATE,
    end_date          DATE,
    category          VARCHAR(50),
    background_color  VARCHAR(20),
    recurrence_type   VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 15) refresh_tokens
-- =====================================================
DROP TABLE IF EXISTS refresh_tokens;
CREATE TABLE refresh_tokens (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    token       VARCHAR(255) NOT NULL UNIQUE,
    expiry_date DATETIME(6) NOT NULL,
    member_id   VARCHAR(50),
    CONSTRAINT fk_refresh_token_member
        FOREIGN KEY (member_id) REFERENCES member(m_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =====================================================
-- 16) materials
-- =====================================================
DROP TABLE IF EXISTS materials;
CREATE TABLE `materials` (
   `material_id` INT NOT NULL AUTO_INCREMENT COMMENT '자료 고유 ID',
   `course_code` VARCHAR(20) NOT NULL COMMENT '강의 코드',
   `filename` VARCHAR(500) NULL DEFAULT NULL COMMENT '자료 파일명' COLLATE 'utf8mb4_0900_ai_ci',
   `filepath` VARCHAR(1000) NULL DEFAULT NULL COMMENT '자료 저장 경로' COLLATE 'utf8mb4_0900_ai_ci',
   `upload_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '업로드 일시',
   PRIMARY KEY (`material_id`) USING BTREE,
   INDEX `fk_material_course` (`course_code`) USING BTREE,
   -- course 테이블의 course_code를 참조하는 외래 키 설정
   CONSTRAINT `fk_material_course` FOREIGN KEY (`course_code`) REFERENCES `course` (`course_code`) ON UPDATE CASCADE ON DELETE RESTRICT
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
COMMENT='강의 자료 테이블'
;

-- =====================================================
-- 17) course_announcement (NEW!)
-- =====================================================
DROP TABLE IF EXISTS course_announcement;
CREATE TABLE course_announcement (
    notice_id      INT AUTO_INCREMENT PRIMARY KEY,
    course_code    VARCHAR(20) NOT NULL, 
    writer_id      VARCHAR(20) NOT NULL, 
    title          VARCHAR(200) NOT NULL,
    content        TEXT NOT NULL,
    view_count     INT DEFAULT 0,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_c_notice_course FOREIGN KEY (course_code) REFERENCES course (course_code) ON DELETE CASCADE,
    CONSTRAINT fk_c_notice_writer FOREIGN KEY (writer_id) REFERENCES member (m_no) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =====================================================
-- Sample Data Insertion
-- =====================================================

-- 관리자 계정 추가 (공지사항 작성자)
INSERT INTO department (dept_code, dept_name, college_name) VALUES ('ADM', '관리부서', '본부');
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code)
VALUES ('admin', 'admin', '관리자', 'ADMIN', 'admin001', 'admin@deu.ac.kr', 'ADM');

-- 공지사항 게시판 추가
INSERT INTO board (board_code, board_name, write_auth) VALUES ('announcements', '공지사항', 'ADMIN');

-- 샘플 공지사항 추가
INSERT INTO post (board_id, post_title, post_content, writer_id)
SELECT board_id, '2025학년도 2학기 수강신청 안내', '2025학년도 2학기 수강신청이 8월 10일부터 시작됩니다. 학생 여러분의 많은 관심 바랍니다.', 'admin001'
FROM board WHERE board_code = 'announcements';

INSERT INTO post (board_id, post_title, post_content, writer_id)
SELECT board_id, '중앙도서관 리모델링 공사 안내', '중앙도서관이 더 나은 환경을 제공하기 위해 9월 1일부터 12월 31일까지 리모델링 공사를 진행합니다. 이용에 불편을 드려 죄송합니다.', 'admin001'
FROM board WHERE board_code = 'announcements';

INSERT INTO post (board_id, post_title, post_content, writer_id)
SELECT board_id, '2025년 동아리 박람회 개최 안내', '9월 5일부터 7일까지 학생회관 앞에서 2025년 동아리 박람회가 개최됩니다. 다양한 동아리를 만나보세요!', 'admin001'
FROM board WHERE board_code = 'announcements';

-- 컴퓨터공학과 추가
INSERT INTO department (dept_code, dept_name, college_name) VALUES ('CS', '컴퓨터공학과', 'IT융합대학');

-- 샘플 학생 계정 추가
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code)
VALUES ('student', '1234', '김학생', 'STUDENT', '20210001', 'student@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status)
VALUES ('student', 2, 'ENROLLED');

-- 샘플 교수 계정 추가
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code)
VALUES ('professor', '1234', '이교수', 'PROFESSOR', 'prof001', 'professor@deu.ac.kr', 'CS');
INSERT INTO professor_member (m_id, position, office_room)
VALUES ('professor', '조교수', '정보관 404호');

-- 추가 교수진 데이터
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('prof_hong', '1234', '홍길동', 'PROFESSOR', 'prof002', 'hong@deu.ac.kr', 'CS');
INSERT INTO professor_member (m_id, position, office_room) VALUES ('prof_hong', '부교수', '정보관 405호');
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('prof_kim', '1234', '김영희', 'PROFESSOR', 'prof003', 'kim@deu.ac.kr', 'CS');
INSERT INTO professor_member (m_id, position, office_room) VALUES ('prof_kim', '정교수', '정보관 406호');
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('prof_lee', '1234', '이철수', 'PROFESSOR', 'prof004', 'lee@deu.ac.kr', 'CS');
INSERT INTO professor_member (m_id, position, office_room) VALUES ('prof_lee', '조교수', '정보관 407호');

-- =====================================================
-- Sample Subject & Course Data
-- =====================================================

-- Subject 데이터
INSERT INTO subject (s_code, s_name, credit, s_type, dept_code) VALUES
('CSE4001', '소프트웨어 공학', 3, 1, 'CS'),
('CSE4002', '데이터베이스 시스템', 3, 1, 'CS'),
('CSE3010', '알고리즘 분석', 3, 1, 'CS'),
('CSE3021', '운영체제', 3, 2, 'CS'),
('CSE4033', '인공지능', 3, 2, 'CS'),
('GED1001', '글쓰기와 의사소통', 2, 3, 'ADM'),
('CSE2010', '자료구조', 3, 1, 'CS'),
('CSE2020', '객체지향프로그래밍', 3, 1, 'CS'),
('CSE3030', '컴퓨터네트워크', 3, 2, 'CS');

-- Course 데이터
INSERT INTO course (course_code, academic_year, semester, s_code, course_class, professor_no, max_stu, classroom, course_status) VALUES
('CSE4001_01', 2025, 2, 'CSE4001', '01', 'prof002', 50, 'IT-501', 'OPEN'),
('CSE4002_01', 2025, 2, 'CSE4002', '01', 'prof003', 60, 'IT-502', 'OPEN'),
('CSE3010_01', 2025, 2, 'CSE3010', '01', 'prof004', 40, 'IT-403', 'OPEN'),
('CSE3021_01', 2025, 2, 'CSE3021', '01', 'prof001', 45, 'IT-501', 'CLOSED'),
('CSE4033_01', 2025, 2, 'CSE4033', '01', 'prof002', 35, 'IT-601', 'OPEN'),
('GED1001_01', 2025, 2, 'GED1001', '01', 'prof001', 100, '인문-201', 'OPEN'),
('CSE2010_01', 2025, 2, 'CSE2010', '01', 'prof003', 50, 'IT-401', 'OPEN'),
('CSE2020_01', 2025, 2, 'CSE2020', '01', 'prof004', 50, 'IT-402', 'OPEN'),
('CSE3030_01', 2025, 2, 'CSE3030', '01', 'prof001', 45, 'IT-503', 'OPEN');

-- Course Schedule 데이터
INSERT INTO course_schedule (course_code, day_of_week, start_time, end_time) VALUES
('CSE4001_01', 1, '10:00:00', '11:50:00'),
('CSE4002_01', 2, '13:00:00', '14:50:00'),
('CSE3010_01', 3, '09:00:00', '10:50:00'),
('CSE3021_01', 4, '15:00:00', '16:50:00'),
('CSE4033_01', 5, '10:00:00', '11:50:00'),
('GED1001_01', 1, '13:00:00', '14:50:00'),
('CSE2010_01', 1, '15:00:00', '16:50:00'),
('CSE2020_01', 2, '10:00:00', '11:50:00'),
('CSE3030_01', 3, '13:00:00', '14:50:00');

-- =====================================================
-- Update Course Syllabus Data
-- =====================================================
UPDATE course SET 
    course_objectives = '소프트웨어 개발 생명주기의 각 단계를 이해하고, 실제 프로젝트에 적용할 수 있는 공학적 방법론을 학습합니다.',
    course_content = '1주차: 소프트웨어 공학 개론\n2주차: 요구사항 분석 및 명세\n3주차: 구조적 및 객체지향 분석\n4주차: 소프트웨어 설계\n...',
    evaluation_method = '{"중간고사": 30, "기말고사": 30, "과제": 20, "팀 프로젝트": 15, "출석": 5}',
    textbook_info = '주교재: 소프트웨어 공학(10판), Ian Sommerville, 2018'
WHERE course_code = 'CSE4001_01';

UPDATE course SET 
    course_objectives = '데이터베이스의 기본 개념을 이해하고, SQL을 사용하여 데이터를 관리하며, 관계형 데이터베이스를 설계하는 능력을 배양합니다.',
    course_content = '1주차: 데이터베이스 시스템 소개\n2주차: 관계형 모델\n3주차: SQL 기본\n4주차: 고급 SQL\n...',
    evaluation_method = '{"중간고사": 35, "기말고사": 35, "실습": 20, "출석": 10}',
    textbook_info = '주교재: 데이터베이스 시스템(7판), Ramez Elmasri, 2021'
WHERE course_code = 'CSE4002_01';

UPDATE course SET 
    course_objectives = '다양한 알고리즘 설계 기법을 배우고, 알고리즘의 효율성을 분석하는 방법을 익힙니다.',
    course_content = '1주차: 알고리즘의 기초 및 복잡도 분석\n2주차: 분할 정복\n3주차: 동적 프로그래밍\n4주차: 탐욕 알고리즘\n...',
    evaluation_method = '{"중간고사": 30, "기말고사": 40, "알고리즘 과제": 25, "출석": 5}',
    textbook_info = '주교재: Introduction to Algorithms(4판), CLRS, 2022'
WHERE course_code = 'CSE3010_01';

UPDATE course SET 
    course_objectives = '운영체제의 핵심 개념인 프로세스, 메모리, 파일 시스템, 입출력 등을 이해하고, 현대 운영체제의 동작 원리를 학습합니다.',
    course_content = '1주차: 운영체제 개요\n2주차: 프로세스와 스레드\n3주차: CPU 스케줄링\n4주차: 프로세스 동기화\n...',
    evaluation_method = '{"중간고사": 30, "기말고사": 30, "과제": 30, "출석": 10}',
    textbook_info = '주교재: 운영체제(10판), Silberschatz, Galvin, Gagne, 2021'
WHERE course_code = 'CSE3021_01';

UPDATE course SET 
    course_objectives = '인공지능의 기본 원리를 이해하고, 탐색, 지식 표현, 기계 학습 등의 핵심 기술을 습득합니다.',
    course_content = '1주차: 인공지능 소개\n2주차: 문제 해결과 탐색\n3주차: 제약 만족 문제\n4주차: 논리와 지식 표현\n...',
    evaluation_method = '{"중간고사": 30, "기말고사": 30, "프로젝트": 30, "퀴즈": 10}',
    textbook_info = '주교재: Artificial Intelligence: A Modern Approach(4판), Russell, Norvig, 2020'
WHERE course_code = 'CSE4033_01';

UPDATE course SET 
    course_objectives = '학술적 글쓰기의 기초를 다지고, 비판적 사고를 통해 논리적이고 설득력 있는 의사소통 능력을 함양합니다.',
    course_content = '1주차: 글쓰기의 중요성\n2주차: 비판적 읽기와 사고\n3주차: 개요 작성 및 구조화\n4주차: 논증과 설득\n...',
    evaluation_method = '{"과제1": 20, "과제2": 20, "중간 보고서": 25, "기말 보고서": 35}',
    textbook_info = '교재 없음 (유인물 제공)'
WHERE course_code = 'GED1001_01';

UPDATE course SET 
    course_objectives = '배열, 스택, 큐, 리스트, 트리, 그래프 등 주요 자료구조의 개념을 이해하고 이를 프로그램으로 구현하는 능력을 기릅니다.',
    course_content = '1주차: 자료구조와 알고리즘\n2주차: 배열과 리스트\n3주차: 스택과 큐\n4주차: 트리와 이진 탐색 트리\n...',
    evaluation_method = '{"중간고사": 30, "기말고사": 40, "프로그래밍 과제": 25, "출석": 5}',
    textbook_info = '주교재: C로 배우는 쉬운 자료구조, 이지영, 2020'
WHERE course_code = 'CSE2010_01';

UPDATE course SET 
    course_objectives = '객체지향 프로그래밍의 핵심 개념인 캡슐화, 상속, 다형성을 이해하고, Java 언어를 사용하여 객체지향 설계를 적용하는 방법을 학습합니다.',
    course_content = '1주차: 객체지향 개념 소개\n2주차: 클래스와 객체\n3주차: 상속과 다형성\n4주차: 인터페이스와 추상 클래스\n...',
    evaluation_method = '{"중간고사": 30, "기말고사": 30, "프로그래밍 과제": 30, "출석": 10}',
    textbook_info = '주교재: 이것이 자바다, 신용권, 2022'
WHERE course_code = 'CSE2020_01';

UPDATE course SET 
    course_objectives = '컴퓨터 네트워크의 계층별 프로토콜과 동작 원리를 이해하고, TCP/IP 기반의 인터넷 기술을 학습합니다.',
    course_content = '1주차: 네트워크 개론\n2주차: 물리 계층\n3주차: 데이터 링크 계층\n4주차: 네트워크 계층\n...',
    evaluation_method = '{"중간고사": 30, "기말고사": 40, "과제": 20, "출석": 10}',
    textbook_info = '주교재: Computer Networking: A Top-Down Approach(8판), Kurose, Ross, 2021'
WHERE course_code = 'CSE3030_01';

-- =====================================================
-- Additional User Insertion
-- =====================================================

-- 신규 학생 계정 추가
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code)
VALUES ('new_student', '1234', '박새로이', 'STUDENT', '20240001', 'new.student@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status)
VALUES ('new_student', 1, 'ENROLLED');

-- 신규 교수 계정 추가
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code)
VALUES ('new_professor', '1234', '최교수', 'PROFESSOR', 'prof005', 'new.professor@deu.ac.kr', 'CS');
INSERT INTO professor_member (m_id, position, office_room, start_date)
VALUES ('new_professor', '조교수', '정보관 408호', '2024-03-01');

-- =====================================================
-- Additional CS Student Data
-- =====================================================
-- 1학년
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student1_1', '1234', '김하나', 'STUDENT', '20241001', 'cs1_1@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student1_1', 1, 'ENROLLED');
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student1_2', '1234', '이두리', 'STUDENT', '20241002', 'cs1_2@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student1_2', 1, 'ENROLLED');
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student1_3', '1234', '박세희', 'STUDENT', '20241003', 'cs1_3@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student1_3', 1, 'ENROLLED');

-- 2학년
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student2_1', '1234', '김하늘', 'STUDENT', '20231001', 'cs2_1@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student2_1', 2, 'ENROLLED');
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student2_2', '1234', '이두나', 'STUDENT', '20231002', 'cs2_2@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student2_2', 2, 'ENROLLED');
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student2_3', '1234', '박세준', 'STUDENT', '20231003', 'cs2_3@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student2_3', 2, 'ENROLLED');

-- 3학년
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student3_1', '1234', '김서연', 'STUDENT', '20221001', 'cs3_1@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student3_1', 3, 'ENROLLED');
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student3_2', '1234', '이서준', 'STUDENT', '20221002', 'cs3_2@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student3_2', 3, 'ENROLLED');
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student3_3', '1234', '박하윤', 'STUDENT', '20221003', 'cs3_3@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student3_3', 3, 'ENROLLED');

-- 4학년
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student4_1', '1234', '최도윤', 'STUDENT', '20211001', 'cs4_1@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student4_1', 4, 'ENROLLED');
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student4_2', '1234', '정시우', 'STUDENT', '20211002', 'cs4_2@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student4_2', 4, 'ENROLLED');
INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code) VALUES ('cs_student4_3', '1234', '윤지후', 'STUDENT', '20211003', 'cs4_3@deu.ac.kr', 'CS');
INSERT INTO student_member (m_id, stu_grade, enrollment_status) VALUES ('cs_student4_3', 4, 'ENROLLED');

-- =====================================================
-- Sample Academic Schedule Data
-- =====================================================
INSERT INTO academic_schedule (academic_year, semester, schedule_title, start_date, end_date, category) VALUES
(2025, 2, '2학기 개강', '2025-09-01', '2025-09-01', 'academic'),
(2025, 2, '수강신청 정정 기간', '2025-09-01', '2025-09-05', 'academic'),
(2025, 2, '추석 연휴', '2025-10-05', '2025-10-07', 'holiday'),
(2025, 2, '중간고사', '2025-10-20', '2025-10-24', 'academic'),
(2025, 2, '개교기념일', '2025-11-03', '2025-11-03', 'holiday'),
(2025, 2, '기말고사', '2025-12-15', '2025-12-19', 'academic'),
(2025, 2, '동계 방학', '2025-12-22', '2026-02-28', 'academic');

-- =====================================================
-- Sample Course Announcement Data (NEW!)
-- =====================================================
-- 김영희 교수(prof003)가 '데이터베이스 시스템'에 올린 공지사항
INSERT INTO course_announcement (course_code, writer_id, title, content, view_count, created_at)
VALUES 
('CSE4002_01', 'prof003', '중간고사 범위 안내', '중간고사는 1장부터 5장까지입니다. 열심히 공부하세요!', 15, NOW()),
('CSE4002_01', 'prof003', '팀 프로젝트 조편성 결과', '팀 프로젝트 조편성 결과를 첨부파일로 확인하세요.', 22, NOW());

-- 김영희 교수(prof003)가 '자료구조'에 올린 공지사항
INSERT INTO course_announcement (course_code, writer_id, title, content, view_count, created_at)
VALUES 
('CSE2010_01', 'prof003', '과제 제출 기한 연장', '과제 제출 기한을 이번 주 금요일까지 연장합니다.', 45, NOW());

-- 1. 기존 데이터 정리 (중복 에러 방지용)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE grade;
TRUNCATE TABLE enrollment;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- 시나리오 A: '김학생(20210001)' - 성적 처리가 완료된 케이스
-- (학생용 '성적 조회' 및 교수용 '성적 수정' 테스트)
-- ==========================================================

-- A-1. 수강신청 데이터 넣기
INSERT INTO enrollment (stu_no, course_code, enrollment_status, enrollment_date) VALUES
('20210001', 'CSE4001_01', 'ENROLLED', NOW()), -- 소프트웨어 공학
('20210001', 'CSE4002_01', 'ENROLLED', NOW()), -- 데이터베이스 시스템
('20210001', 'GED1001_01', 'ENROLLED', NOW()); -- 글쓰기와 의사소통

INSERT INTO grade (enrollment_id, midterm_score, final_score, assignment_score, attendance_score, total_score, grade_letter, grade_point)
VALUES
-- 1. 소프트웨어 공학: 총점 91점 (A0)
(
    (SELECT enrollment_id FROM enrollment WHERE stu_no='20210001' AND course_code='CSE4001_01'),
    90, 90, 95, 90, 91.0, 'A0', 4.0
),
-- 2. 데이터베이스 시스템: 총점 80점 (B0)
(
    (SELECT enrollment_id FROM enrollment WHERE stu_no='20210001' AND course_code='CSE4002_01'),
    80, 75, 90, 80, 80.0, 'B0', 3.0
),
-- 3. 글쓰기: 총점 100점 (A+)
(
    (SELECT enrollment_id FROM enrollment WHERE stu_no='20210001' AND course_code='GED1001_01'),
    100, 100, 100, 100, 100.0, 'A+', 4.5
);


-- ==========================================================
-- 시나리오 B: '박새로이(20240001)' - 이제 막 수강신청한 케이스
-- (교수용 '성적 입력' 및 '저장' 버튼 테스트)
-- ==========================================================

-- B-1. 수강신청 데이터 넣기 (김교수님 강의 신청)
INSERT INTO enrollment (stu_no, course_code, enrollment_status, enrollment_date) VALUES
('20240001', 'CSE4002_01', 'ENROLLED', NOW()), -- 데이터베이스 시스템 (김교수 담당)
('20240001', 'CSE2010_01', 'ENROLLED', NOW()); -- 자료구조 (김교수 담당)

-- B-2. '빈 성적표(0점)' 생성하기
-- (주의: 백엔드 로직상 이 데이터가 미리 있어야 교수님이 점수를 입력할 수 있음)
INSERT INTO grade (enrollment_id, midterm_score, final_score, assignment_score, attendance_score, total_score, grade_letter, grade_point)
SELECT enrollment_id, 0, 0, 0, 0, 0, NULL, 0
FROM enrollment
WHERE stu_no = '20240001'
  AND course_code IN ('CSE4002_01', 'CSE2010_01');
