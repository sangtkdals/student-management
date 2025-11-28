package com.example.studentmanagement.controller;
import com.example.studentmanagement.beans.Board;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.repository.BoardRepository;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.util.JwtUtil;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import java.util.Date;
import com.example.studentmanagement.beans.Post;
import com.example.studentmanagement.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/announcements")
    public List<Post> getAnnouncements() {
        return postRepository.findByBoardCode("announcements");
    }

    // 공지사항 상세 조회
@GetMapping("/announcements/{id}")
public ResponseEntity<Post> getAnnouncement(@PathVariable(value = "id") Integer id) {
    Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다: " + id));

    // 조회수 증가
    post.setViewCount(post.getViewCount() != null ? post.getViewCount() + 1 : 1);
    postRepository.save(post);

    return ResponseEntity.ok(post);
}

// 공지사항 작성
@PostMapping("/announcements")
public ResponseEntity<Post> createAnnouncement(
        @RequestHeader(value = "Authorization") String authHeader,
        @RequestBody CreatePostRequest request) {

    String token = authHeader.replace("Bearer ", "");
    String memberNo = jwtUtil.extractMemberNo(token);

    Member writer = memberRepository.findByMemberNo(memberNo)
            .orElseThrow(() -> new RuntimeException("작성자를 찾을 수 없습니다"));

    Board board = boardRepository.findByBoardCode("announcements")
            .orElseThrow(() -> new RuntimeException("공지사항 게시판을 찾을 수 없습니다"));

    Post post = new Post();
    post.setBoard(board);
    post.setPostTitle(request.getTitle());
    post.setPostContent(request.getContent());
    post.setWriter(writer);
    post.setViewCount(0);
    post.setCreatedAt(new Date());

    Post saved = postRepository.save(post);
    return ResponseEntity.ok(saved);
}

// 공지사항 수정
@PutMapping("/announcements/{id}")
public ResponseEntity<Post> updateAnnouncement(
        @PathVariable(value = "id") Integer id,
        @RequestBody UpdatePostRequest request) {

    Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다: " + id));

    post.setPostTitle(request.getTitle());
    post.setPostContent(request.getContent());
    post.setUpdatedAt(new Date());

    Post updated = postRepository.save(post);
    return ResponseEntity.ok(updated);
}

// 공지사항 삭제
@DeleteMapping("/announcements/{id}")
public ResponseEntity<Void> deleteAnnouncement(@PathVariable(value = "id") Integer id) {
    Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다: " + id));

    postRepository.delete(post);
    return ResponseEntity.noContent().build();
}
// DTO 클래스들
@Data
static class CreatePostRequest {
    private String title;
    private String content;
}

@Data
static class UpdatePostRequest {
    private String title;
    private String content;
}

}
