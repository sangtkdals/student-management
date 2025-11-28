package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.Material;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialRepository materialRepository;
    private final CourseRepository courseRepository;
    private final Path fileStorageLocation;

    public MaterialController(MaterialRepository materialRepository, CourseRepository courseRepository) {
        this.materialRepository = materialRepository;
        this.courseRepository = courseRepository;
        
        // Define upload directory
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @GetMapping("/course/{courseCode}")
    public ResponseEntity<List<Material>> getMaterialsByCourse(@PathVariable("courseCode") String courseCode) {
        return ResponseEntity.ok(materialRepository.findByCourse_CourseCode(courseCode));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadMaterial(@RequestParam("courseCode") String courseCode,
                                            @RequestParam("file") MultipartFile file) {
        try {
            Course course = courseRepository.findById(courseCode)
                    .orElseThrow(() -> new RuntimeException("Course not found with code " + courseCode));

            String originalFilename = file.getOriginalFilename();
            // Generate unique filename to avoid conflicts
            String storedFilename = UUID.randomUUID().toString() + "_" + originalFilename;
            
            Path targetLocation = this.fileStorageLocation.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetLocation);

            Material material = new Material();
            material.setCourse(course);
            material.setFilename(originalFilename);
            material.setFilepath(storedFilename);
            
            materialRepository.save(material);

            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body("Could not store file " + file.getOriginalFilename() + ". Please try again!");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable("id") Integer id) {
        return materialRepository.findById(id).map(material -> {
            try {
                // Delete file from storage
                Path filePath = this.fileStorageLocation.resolve(material.getFilepath());
                Files.deleteIfExists(filePath);
            } catch (IOException ex) {
                // Log error but continue to delete DB record
                System.err.println("Failed to delete file: " + ex.getMessage());
            }
            materialRepository.delete(material);
            return ResponseEntity.ok("Material deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
    
    // Optional: Endpoint to download file
    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("filename") String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
