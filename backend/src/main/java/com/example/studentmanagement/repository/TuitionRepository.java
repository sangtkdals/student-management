package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Tuition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.time.LocalDate;

public interface TuitionRepository extends JpaRepository<Tuition, Integer> {
    
    List<Tuition> findByStudent_MemberNo(String memberNo);

    @Query("SELECT t FROM Tuition t WHERE t.student.memberNo = :memberNo AND t.paymentStatus = 'UNPAID' AND (t.dueDate IS NULL OR t.dueDate >= :currentDate)")
    List<Tuition> findPayableTuitionsByStudentNo(@Param("memberNo") String memberNo, @Param("currentDate") LocalDate currentDate);

    @Modifying
    @Query("UPDATE Tuition t SET t.paymentStatus = 'PAID', t.paidDate = :paidDate, t.paymentMethod = :paymentMethod, t.receiptNo = :receiptNo, t.paidAmount = t.billAmount WHERE t.id IN :tuitionIds AND t.paymentStatus = 'UNPAID'")
    int updateTuitionStatusToPaid(
            @Param("tuitionIds") List<Integer> tuitionIds,
            @Param("paidDate") String paidDate,
            @Param("paymentMethod") String paymentMethod,
            @Param("receiptNo") String receiptNo
    );
}