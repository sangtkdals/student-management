package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Post;
import com.example.studentmanagement.dto.PostDTO;
import com.example.studentmanagement.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/announcements")
    public Page<PostDTO> getAnnouncements(Pageable pageable) {
        Page<Post> posts = postRepository.findByBoardCode("announcements", pageable);
        List<PostDTO> postDTOs = posts.getContent().stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
        return new PageImpl<>(postDTOs, pageable, posts.getTotalElements());
    }

    @GetMapping("/announcements/{id}")
    public ResponseEntity<PostDTO> getAnnouncementById(@PathVariable int id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(p -> ResponseEntity.ok(new PostDTO(p)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
