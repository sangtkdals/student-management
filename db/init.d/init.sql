-- 만약 student 테이블이 이미 있다면 삭제합니다.
DROP TABLE IF EXISTS student;

-- student 테이블만 생성합니다. (department 관련 내용 모두 삭제)
-- 한글 저장을 위해 DEFAULT CHARSET=utf8mb4를 추가합니다.
CREATE TABLE student (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    major VARCHAR(255)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테스트용 학생 데이터를 3개 삽입합니다.
INSERT INTO student (name, major) VALUES ('test1', 'ccccccccc');
INSERT INTO student (name, major) VALUES ('test2', 'aaaaaaa');
INSERT INTO student (name, major) VALUES ('test3', 'dddd');