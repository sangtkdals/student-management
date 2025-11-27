package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Post;
import com.example.studentmanagement.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/announcements")
    public Page<Post> getAnnouncements(Pageable pageable) {
        return postRepository.findByBoardCode("announcements", pageable);
    }

    @GetMapping("/announcements/{id}")
    public ResponseEntity<Post> getAnnouncementById(@PathVariable int id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
