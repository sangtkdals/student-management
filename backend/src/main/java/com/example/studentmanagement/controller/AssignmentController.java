package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Assignment;
import com.example.studentmanagement.repository.AssignmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentRepository assignmentRepository;
    private final Path fileStorageLocation;

    public AssignmentController(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
        
        // Use the same upload directory as MaterialController for simplicity
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @GetMapping
    public ResponseEntity<List<Assignment>> getAssignments(@RequestParam("courseCode") String courseCode) {
        return ResponseEntity.ok(assignmentRepository.findByCourseCode(courseCode));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignment(@PathVariable("id") Integer id) {
        return assignmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        if (assignment.getRegistrationDate() == null) {
            assignment.setRegistrationDate(new java.util.Date());
        }
        Assignment saved = assignmentRepository.save(assignment);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable("id") Integer id, @RequestBody Assignment details) {
        return assignmentRepository.findById(id).map(assignment -> {
            assignment.setAssignmentTitle(details.getAssignmentTitle());
            assignment.setAssignmentDesc(details.getAssignmentDesc());
            assignment.setDueDate(details.getDueDate());
            assignment.setAttachmentPath(details.getAttachmentPath());
            return ResponseEntity.ok(assignmentRepository.save(assignment));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable("id") Integer id) {
        assignmentRepository.findById(id).ifPresent(assignment -> {
            if (assignment.getAttachmentPath() != null) {
                try {
                    Files.deleteIfExists(this.fileStorageLocation.resolve(assignment.getAttachmentPath()));
                } catch (IOException e) {
                    System.err.println("Failed to delete assignment file: " + e.getMessage());
                }
            }
            assignmentRepository.deleteById(id);
        });
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String storedFilename = UUID.randomUUID().toString() + "_" + originalFilename;
            Path targetLocation = this.fileStorageLocation.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetLocation);
            
            Map<String, String> response = new HashMap<>();
            response.put("filename", storedFilename);
            response.put("originalName", originalFilename);
            return ResponseEntity.ok(response);
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body("Could not upload file: " + ex.getMessage());
        }
    }
}
