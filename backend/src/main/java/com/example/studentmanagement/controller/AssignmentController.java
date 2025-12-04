package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Assignment;
import com.example.studentmanagement.repository.AssignmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentRepository assignmentRepository;

    public AssignmentController(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    @GetMapping
    public ResponseEntity<List<Assignment>> getAssignments(@RequestParam("courseCode") String courseCode) {
        return ResponseEntity.ok(assignmentRepository.findByCourseCode(courseCode));
    }

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        Assignment saved = assignmentRepository.save(assignment);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable("id") Integer id, @RequestBody Assignment details) {
        return assignmentRepository.findById(id).map(assignment -> {
            assignment.setTitle(details.getTitle());
            assignment.setContent(details.getContent());
            assignment.setDeadline(details.getDeadline());
            assignment.setMaxScore(details.getMaxScore());
            return ResponseEntity.ok(assignmentRepository.save(assignment));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable("id") Integer id) {
        assignmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
