package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Assignment;
import com.example.studentmanagement.dto.AssignmentDto;
import com.example.studentmanagement.dto.AssignmentSubmissionDto;
import com.example.studentmanagement.dto.AssignmentDto;
import com.example.studentmanagement.dto.AssignmentSubmissionDto;
import com.example.studentmanagement.service.AssignmentService;
import com.example.studentmanagement.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;


@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final JwtUtil jwtUtil;

    @GetMapping("/course/{courseCode}")
    public List<Map<String, Object>> getAssignmentsByCourse(@PathVariable("courseCode") String courseCode, @RequestHeader("Authorization") String authorizationHeader) {
        System.out.println("--- [AssignmentController] getAssignmentsByCourse ---");
        String token = authorizationHeader.substring(7);
        String studentId = jwtUtil.getMemberNoFromToken(token);
        List<AssignmentDto> assignments = assignmentService.findByCourseCode(courseCode, studentId);

        // Convert to List<Map<String, Object>> to avoid serialization issues
        return assignments.stream().map(dto -> {
            Map<String, Object> map = new HashMap<>();
            map.put("assignmentId", dto.getAssignmentId());
            map.put("assignmentTitle", dto.getAssignmentTitle());
            map.put("assignmentDesc", dto.getAssignmentDesc());
            map.put("attachmentPath", dto.getAttachmentPath());
            map.put("registrationDate", dto.getRegistrationDate());
            map.put("dueDate", dto.getDueDate());
            map.put("courseCode", dto.getCourseCode());
            
            if (dto.getSubmission() != null) {
                Map<String, Object> submissionMap = new HashMap<>();
                submissionMap.put("submissionId", dto.getSubmission().getSubmissionId());
                submissionMap.put("studentName", dto.getSubmission().getStudentName());
                submissionMap.put("submissionDate", dto.getSubmission().getSubmissionDate());
                submissionMap.put("content", dto.getSubmission().getContent());
                submissionMap.put("filePath", dto.getSubmission().getFilePath());
                submissionMap.put("grade", dto.getSubmission().getGrade());
                submissionMap.put("feedback", dto.getSubmission().getFeedback());
                map.put("submission", submissionMap);
            } else {
                map.put("submission", null);
            }
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable("id") Long id) {
        Assignment assignment = assignmentService.findAssignmentById(id);
        return ResponseEntity.ok(assignment);
    }

    @PostMapping
    public ResponseEntity<Void> createAssignment(@RequestBody AssignmentDto assignmentDto) {
        assignmentService.createAssignment(assignmentDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{assignmentId}/submit")
    public ResponseEntity<Void> submitAssignment(@PathVariable("assignmentId") Long assignmentId,
                                                 @RequestHeader("Authorization") String authorizationHeader,
                                                 @RequestParam(value = "content", required = false, defaultValue = "") String content,
                                                 @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        String token = authorizationHeader.substring(7);
        String studentId = jwtUtil.getMemberNoFromToken(token);
        assignmentService.submitAssignment(assignmentId, studentId, content, file);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/submissions/{submissionId}")
    public ResponseEntity<Void> updateSubmission(@PathVariable("submissionId") Long submissionId,
                                                 @RequestHeader("Authorization") String authorizationHeader,
                                                 @RequestParam(value = "content", required = false, defaultValue = "") String content,
                                                 @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        String token = authorizationHeader.substring(7);
        String studentId = jwtUtil.getMemberNoFromToken(token);
        assignmentService.updateSubmission(submissionId, studentId, content, file);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{assignmentId}/submissions")
    public List<AssignmentSubmissionDto> getSubmissions(@PathVariable("assignmentId") Long assignmentId) {
        return assignmentService.getSubmissions(assignmentId);
    }

    @DeleteMapping("/submissions/{submissionId}")
    public ResponseEntity<Void> deleteSubmission(@PathVariable("submissionId") Long submissionId,
                                                 @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String studentId = jwtUtil.getMemberNoFromToken(token);
        assignmentService.deleteSubmission(submissionId, studentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<Void> gradeSubmission(@PathVariable("submissionId") Long submissionId,
                                                @RequestBody Map<String, Object> payload) {
        int grade = (int) payload.get("grade");
        String feedback = (String) payload.get("feedback");
        assignmentService.gradeSubmission(submissionId, grade, feedback);
        return ResponseEntity.ok().build();
    }
}
