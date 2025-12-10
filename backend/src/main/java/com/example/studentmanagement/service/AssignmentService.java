package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Assignment;
import com.example.studentmanagement.beans.AssignmentSubmission;
import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.dto.AssignmentDto;
import com.example.studentmanagement.dto.AssignmentSubmissionDto;
import com.example.studentmanagement.repository.AssignmentRepository;
import com.example.studentmanagement.repository.AssignmentSubmissionRepository;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final MemberRepository memberRepository;
    private final CourseRepository courseRepository;
    private final String uploadDir = "uploads/";

    public List<AssignmentDto> findByCourseCode(String courseCode, String studentId) {
        System.out.println("--- [AssignmentService] findByCourseCode ---");
        System.out.println("Finding assignments for course: " + courseCode);
        List<Assignment> assignments = assignmentRepository.findByCourse_CourseCode(courseCode);
        System.out.println("Found " + assignments.size() + " assignments.");

        return assignments.stream().map(assignment -> {
            System.out.println("Processing assignment ID: " + assignment.getAssignmentId() + ", Title: " + assignment.getAssignmentTitle());

            AssignmentDto dto = new AssignmentDto();
            dto.setAssignmentId(assignment.getAssignmentId());
            dto.setAssignmentTitle(assignment.getAssignmentTitle());
            dto.setAssignmentDesc(assignment.getAssignmentDesc());
            dto.setAttachmentPath(assignment.getAttachmentPath());

            // Format dates to ISO 8601 string
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            dto.setRegistrationDate(sdf.format(assignment.getRegistrationDate()));
            dto.setDueDate(sdf.format(assignment.getDueDate()));
            
            dto.setCourseCode(assignment.getCourse().getCourseCode());

            System.out.println("Checking submission for student ID: " + studentId);
            assignmentSubmissionRepository.findByAssignment_AssignmentIdAndStudent_MemberNo(assignment.getAssignmentId(), studentId)
                    .ifPresent(submission -> {
                        System.out.println("Submission FOUND for assignment ID: " + assignment.getAssignmentId());
                        dto.setSubmission(convertToDto(submission));
                    });
            
            if (dto.getSubmission() == null) {
                System.out.println("Submission NOT FOUND for assignment ID: " + assignment.getAssignmentId());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    public Assignment findAssignmentById(Long assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
    }

    @Transactional
    public void createAssignment(AssignmentDto assignmentDto) {
        Course course = courseRepository.findById(assignmentDto.getCourseCode())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Assignment assignment = new Assignment();
        assignment.setAssignmentTitle(assignmentDto.getAssignmentTitle());
        assignment.setAssignmentDesc(assignmentDto.getAssignmentDesc());
        assignment.setAttachmentPath(assignmentDto.getAttachmentPath());
        
        // Parse string dates back to Date objects
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            assignment.setRegistrationDate(sdf.parse(assignmentDto.getRegistrationDate()));
            assignment.setDueDate(sdf.parse(assignmentDto.getDueDate()));
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format", e);
        }

        assignment.setCourse(course);

        assignmentRepository.save(assignment);
    }

    @Transactional
    public void submitAssignment(Long assignmentId, String studentId, String content, MultipartFile file) throws IOException {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (content.isEmpty() && (file == null || file.isEmpty())) {
            throw new IllegalArgumentException("Content or file must be provided.");
        }

        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAssignment(assignment);
        submission.setStudent(memberRepository.findByMemberNo(studentId).orElseThrow(() -> new RuntimeException("Student not found")));
        submission.setContent(content);

        if (file != null && !file.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());
            submission.setFilePath(filePath.toString());
        }

        assignmentSubmissionRepository.save(submission);
    }

    public List<AssignmentSubmissionDto> getSubmissions(Long assignmentId) {
        return assignmentSubmissionRepository.findByAssignment_AssignmentId(assignmentId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateSubmission(Long submissionId, String studentId, String content, MultipartFile file) throws IOException {
        AssignmentSubmission submission = assignmentSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        // Authorization check
        if (!submission.getStudent().getMemberNo().equals(studentId)) {
            throw new SecurityException("You are not authorized to update this submission.");
        }

        submission.setContent(content);

        // Handle file update
        if (file != null && !file.isEmpty()) {
            // Delete old file if it exists
            if (submission.getFilePath() != null && !submission.getFilePath().isEmpty()) {
                try {
                    Files.deleteIfExists(Paths.get(submission.getFilePath()));
                } catch (IOException e) {
                    System.err.println("Failed to delete old file: " + submission.getFilePath() + e.getMessage());
                }
            }
            // Save new file
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());
            submission.setFilePath(filePath.toString());
        }

        assignmentSubmissionRepository.save(submission);
    }

    @Transactional
    public void deleteSubmission(Long submissionId, String studentId) {
        AssignmentSubmission submission = assignmentSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        
        // Authorization check
        if (!submission.getStudent().getMemberNo().equals(studentId)) {
            throw new SecurityException("You are not authorized to delete this submission.");
        }

        // Delete the file from the filesystem
        if (submission.getFilePath() != null && !submission.getFilePath().isEmpty()) {
            try {
                Files.deleteIfExists(Paths.get(submission.getFilePath()));
            } catch (IOException e) {
                // Log the error but don't block the DB operation
                System.err.println("Failed to delete file: " + submission.getFilePath() + e.getMessage());
            }
        }
        assignmentSubmissionRepository.delete(submission);
    }
    
    @Transactional
    public void gradeSubmission(Long submissionId, int grade, String feedback) {
        AssignmentSubmission submission = assignmentSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        submission.setGrade(grade);
        submission.setFeedback(feedback);
        assignmentSubmissionRepository.save(submission);
    }

    private AssignmentSubmissionDto convertToDto(AssignmentSubmission submission) {
        AssignmentSubmissionDto dto = new AssignmentSubmissionDto();
        dto.setSubmissionId(submission.getId());
        dto.setStudentName(submission.getStudent().getName());
        dto.setSubmissionDate(submission.getSubmissionDate().toString() + "Z"); // Explicitly add Z for UTC
        dto.setContent(submission.getContent());
        dto.setFilePath(submission.getFilePath());
        dto.setGrade(submission.getGrade());
        dto.setFeedback(submission.getFeedback());
        return dto;
    }
}
