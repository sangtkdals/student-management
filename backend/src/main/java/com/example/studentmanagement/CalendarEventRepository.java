package com.example.studentmanagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Integer> {

    List<CalendarEvent> findAllByOrderByStartDateAsc();

    List<CalendarEvent> findByAcademicYear(Integer academicYear);

    List<CalendarEvent> findByAcademicYearAndSemester(Integer academicYear, Integer semester);

    List<CalendarEvent> findBySemester(Integer semester);

    @Query("SELECT c FROM CalendarEvent c WHERE c.startDate >= :startDate AND c.endDate <= :endDate ORDER BY c.startDate ASC")
    List<CalendarEvent> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
