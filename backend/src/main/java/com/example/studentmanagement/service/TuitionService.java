package com.example.studentmanagement.service;

import com.example.studentmanagement.Tuition;
import com.example.studentmanagement.TuitionRepository;
import com.example.studentmanagement.dto.TuitionRequest;
import com.example.studentmanagement.dto.TuitionResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TuitionService {

    private final TuitionRepository tuitionRepository;

    public TuitionService(TuitionRepository tuitionRepository) {
        this.tuitionRepository = tuitionRepository;
    }

    public TuitionResponse createTuition(TuitionRequest request) {
        Tuition tuition = new Tuition();
        tuition.setStuNo(request.getStuNo());
        tuition.setAcademicYear(request.getAcademicYear());
        tuition.setSemester(request.getSemester());
        tuition.setTuitionAmount(request.getTuitionAmount());
        tuition.setScholarshipAmount(request.getScholarshipAmount());
        tuition.setPaidAmount(request.getPaidAmount());
        tuition.setBillDate(request.getBillDate());
        tuition.setDueDate(request.getDueDate());
        tuition.setPaidDate(request.getPaidDate());
        tuition.setPaymentMethod(request.getPaymentMethod());
        tuition.setReceiptNo(request.getReceiptNo());

        return TuitionResponse.fromEntity(tuitionRepository.save(tuition));
    }

    @Transactional(readOnly = true)
    public List<TuitionResponse> getAllTuition() {
        return tuitionRepository.findAllByOrderByAcademicYearDescSemesterDescDueDateAsc()
                .stream().map(TuitionResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TuitionResponse getTuitionById(Integer tuitionId) {
        Tuition tuition = tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new RuntimeException("등록금 레코드를 찾을 수 없습니다."));
        return TuitionResponse.fromEntity(tuition);
    }

    @Transactional(readOnly = true)
    public List<TuitionResponse> getTuitionByStuNo(String stuNo) {
        return tuitionRepository.findByStuNoOrderByAcademicYearDescSemesterDesc(stuNo)
                .stream().map(TuitionResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TuitionResponse> getTuitionByPaymentStatus(String paymentStatus) {
        return tuitionRepository.findByPaymentStatusOrderByDueDateAsc(paymentStatus)
                .stream().map(TuitionResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TuitionResponse> getTuitionByYearAndSemester(Integer year, Integer semester) {
        return tuitionRepository.findByAcademicYearAndSemester(year, semester)
                .stream().map(TuitionResponse::fromEntity).collect(Collectors.toList());
    }

    public TuitionResponse updateTuition(Integer tuitionId, TuitionRequest request) {
        Tuition tuition = tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new RuntimeException("등록금 레코드를 찾을 수 없습니다."));

        if (request.getAcademicYear() != null) tuition.setAcademicYear(request.getAcademicYear());
        if (request.getSemester() != null) tuition.setSemester(request.getSemester());
        if (request.getTuitionAmount() != null) tuition.setTuitionAmount(request.getTuitionAmount());
        if (request.getScholarshipAmount() != null) tuition.setScholarshipAmount(request.getScholarshipAmount());
        if (request.getPaidAmount() != null) tuition.setPaidAmount(request.getPaidAmount());
        if (request.getBillDate() != null) tuition.setBillDate(request.getBillDate());
        if (request.getDueDate() != null) tuition.setDueDate(request.getDueDate());
        if (request.getPaidDate() != null) tuition.setPaidDate(request.getPaidDate());
        if (request.getPaymentMethod() != null) tuition.setPaymentMethod(request.getPaymentMethod());
        if (request.getReceiptNo() != null) tuition.setReceiptNo(request.getReceiptNo());

        return TuitionResponse.fromEntity(tuitionRepository.save(tuition));
    }

    public TuitionResponse processTuitionPayment(Integer tuitionId, Integer paymentAmount) {
        Tuition tuition = tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new RuntimeException("등록금 레코드를 찾을 수 없습니다."));

        Integer newPaidAmount = (tuition.getPaidAmount() != null ? tuition.getPaidAmount() : 0) + paymentAmount;
        tuition.setPaidAmount(newPaidAmount);

        if (tuition.getPaidDate() == null) {
            tuition.setPaidDate(java.time.LocalDate.now());
        }

        return TuitionResponse.fromEntity(tuitionRepository.save(tuition));
    }

    public void deleteTuition(Integer tuitionId) {
        tuitionRepository.deleteById(tuitionId);
    }
}
