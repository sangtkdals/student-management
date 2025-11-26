package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.AnnouncementRequest;
import com.example.studentmanagement.dto.AnnouncementResponse;
import com.example.studentmanagement.service.AnnouncementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @PostMapping
    public ResponseEntity<AnnouncementResponse> createAnnouncement(@RequestBody AnnouncementRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(announcementService.createAnnouncement(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<AnnouncementResponse>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    @GetMapping("/{postId}")
    public ResponseEntity<AnnouncementResponse> getAnnouncementById(@PathVariable Integer postId) {
        try {
            return ResponseEntity.ok(announcementService.getAnnouncementById(postId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/board/{boardId}")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncementsByBoardId(@PathVariable Integer boardId) {
        return ResponseEntity.ok(announcementService.getAnnouncementsByBoardId(boardId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AnnouncementResponse>> searchAnnouncementsByTitle(@RequestParam String title) {
        return ResponseEntity.ok(announcementService.searchAnnouncementsByTitle(title));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<AnnouncementResponse> updateAnnouncement(
            @PathVariable Integer postId, @RequestBody AnnouncementRequest request) {
        try {
            return ResponseEntity.ok(announcementService.updateAnnouncement(postId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Integer postId) {
        try {
            announcementService.deleteAnnouncement(postId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
