package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Post;
import com.example.studentmanagement.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/announcements")
    public List<Post> getAnnouncements() {
        return postRepository.findByBoardCode("announcements");
    }
}
