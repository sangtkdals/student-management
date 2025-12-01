// TuitionRepository.java 인터페이스 내부에 추가
import com.example.studentmanagement.beans.Tuition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TuitionRepository extends JpaRepository<Tuition, Integer> {
    // Member 엔티티를 통한 stu_no(m_no) 필드 조회를 위한 JPQL 메서드 이름 규칙
    // @JoinColumn(name = "stu_no", referencedColumnName = "m_no") 설정에 기반하여
    // 'student' 필드의 'memberNo'를 기준으로 조회하라는 의미입니다.
    List<Tuition> findByStudent_MemberNo(String memberNo);
}