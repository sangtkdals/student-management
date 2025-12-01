-- =====================================================
-- Sample Data for Load Test (Using Stored Procedure)
-- =====================================================

USE `deu`;

-- 테스트용 학생 데이터를 생성하는 저장 프로시저
DROP PROCEDURE IF EXISTS GenerateStudentData;
DELIMITER $$
CREATE PROCEDURE GenerateStudentData()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 1000 DO
        SET @m_id = CONCAT('student_test', i);
        SET @m_name = CONCAT('테스트학생', i);
        SET @m_no = CONCAT('2024', LPAD(i, 4, '0'));
        SET @m_email = CONCAT('test', i, '@deu.ac.kr');

        -- member 테이블에 삽입
        INSERT INTO member (m_id, m_pwd, m_name, m_type, m_no, m_email, dept_code)
        VALUES (@m_id, '1234', @m_name, 'STUDENT', @m_no, @m_email, 'CS');

        -- student_member 테이블에 삽입
        INSERT INTO student_member (m_id, stu_grade, enrollment_status)
        VALUES (@m_id, 1, 'ENROLLED');

        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;

-- 프로시저 호출하여 데이터 생성
CALL GenerateStudentData();

-- 프로시저 삭제
DROP PROCEDURE IF EXISTS GenerateStudentData;
