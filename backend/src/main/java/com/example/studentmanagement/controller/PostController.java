package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Board;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.Post;
import com.example.studentmanagement.repository.BoardRepository;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import com.example.studentmanagement.dto.PostRequestDto; // PostRequestDto import 추가
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private BoardRepository boardRepository;
    @Autowired
    private MemberRepository memberRepository;

    @GetMapping("/announcements")
    public Page<Post> getAnnouncements(Pageable pageable) {
        return postRepository.findByBoardBoardCode("announcements", pageable);
    }

    @PostMapping("/announcements")
    public ResponseEntity<Post> createAnnouncement(@RequestBody PostRequestDto requestDto, Authentication authentication) {
        Optional<Board> boardOptional = boardRepository.findByBoardCode("announcements");
        if (!boardOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // 또는 더 구체적인 에러 메시지
        }
        Board board = boardOptional.get();

        Member writer = memberRepository.findByMemberId(authentication.getName())
                .orElseThrow(() -> new RuntimeException("작성자를 찾을 수 없습니다."));

        Post post = new Post(); // 새 Post 객체 생성
        post.setPostTitle(requestDto.getTitle()); // DTO에서 제목 설정
        post.setPostContent(requestDto.getContent()); // DTO에서 내용 설정
        post.setBoard(board);
        post.setWriter(writer);
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        post.setViewCount(0); // 초기 조회수 설정
        Post savedPost = postRepository.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    @PutMapping("/announcements/{id}")
    public ResponseEntity<Post> updateAnnouncement(@PathVariable("id") int id, @RequestBody PostRequestDto requestDto, Authentication authentication) {
        Optional<Post> existingPostOptional = postRepository.findById(id);
        if (!existingPostOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Post existingPost = existingPostOptional.get();

        // ADMIN 역할은 모든 게시물을 수정할 수 있도록 허용
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !existingPost.getWriter().getMemberId().equals(authentication.getName())) { // 이메일 대신 memberId로 비교
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 권한 없음
        }

        existingPost.setPostTitle(requestDto.getTitle()); // DTO에서 제목 설정
        existingPost.setPostContent(requestDto.getContent()); // DTO에서 내용 설정
        existingPost.setUpdatedAt(new Date());

        Post savedPost = postRepository.save(existingPost);
        return ResponseEntity.ok(savedPost);
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable("id") int id, Authentication authentication) {
        Optional<Post> existingPostOptional = postRepository.findById(id);
        if (!existingPostOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Post existingPost = existingPostOptional.get();

        // ADMIN 역할은 모든 게시물을 삭제할 수 있도록 허용
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !existingPost.getWriter().getMemberId().equals(authentication.getName())) { // 이메일 대신 memberId로 비교
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 권한 없음
        }

        postRepository.delete(existingPost);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/announcements/{id}")
    public ResponseEntity<Post> getAnnouncementById(@PathVariable("id") int id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
