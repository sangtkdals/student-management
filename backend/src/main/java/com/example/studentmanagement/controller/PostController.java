package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Post;
import com.example.studentmanagement.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/announcements")
    public List<Post> getAnnouncements() {
        return postRepository.findByBoardCode("announcements");
    }

    @GetMapping("/announcements/{id}")
    public ResponseEntity<Post> getAnnouncementById(@PathVariable int id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
