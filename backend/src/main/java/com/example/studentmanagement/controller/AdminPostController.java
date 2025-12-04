package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Board;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.Post;
import com.example.studentmanagement.dto.PostDTO;
import com.example.studentmanagement.repository.BoardRepository;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.PostRepository;
import com.example.studentmanagement.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/api/admin/posts")
public class AdminPostController {

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final JwtUtil jwtUtil;

    public AdminPostController(PostRepository postRepository,
                               BoardRepository boardRepository,
                               MemberRepository memberRepository,
                               JwtUtil jwtUtil) {
        this.postRepository = postRepository;
        this.boardRepository = boardRepository;
        this.memberRepository = memberRepository;
        this.jwtUtil = jwtUtil;
    }

    // JWT에서 memberNo 추출 헬퍼 메서드
    private String getMemberNoFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            Claims claims = jwtUtil.extractAllClaims(jwt);
            return claims.get("memberNo", String.class);
        }
        return null;
    }

    // 공지사항 작성
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostDTO postDTO, HttpServletRequest request) {
        try {
            String writerNo = getMemberNoFromRequest(request);
            if (writerNo == null) {
                return ResponseEntity.status(401).body("인증이 필요합니다.");
            }

            // 게시판 조회 (기본값: announcements)
            String boardCode = postDTO.getBoardCode() != null ? postDTO.getBoardCode() : "announcements";
            Board board = boardRepository.findByBoardCode(boardCode)
                    .orElseThrow(() -> new RuntimeException("게시판을 찾을 수 없습니다: " + boardCode));

            // 작성자 조회
            Member writer = memberRepository.findByMemberNo(writerNo)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + writerNo));

            // 새 게시글 생성
            Post post = new Post();
            post.setBoard(board);
            post.setPostTitle(postDTO.getPostTitle());
            post.setPostContent(postDTO.getPostContent());
            post.setWriter(writer);
            post.setViewCount(0);
            post.setCreatedAt(new Date());
            post.setUpdatedAt(new Date());

            Post savedPost = postRepository.save(post);
            return ResponseEntity.ok(new PostDTO(savedPost));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("게시글 작성 중 오류 발생: " + e.getMessage());
        }
    }

    // 공지사항 수정
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable Integer postId,
                                       @RequestBody PostDTO postDTO,
                                       HttpServletRequest request) {
        try {
            String memberNo = getMemberNoFromRequest(request);
            if (memberNo == null) {
                return ResponseEntity.status(401).body("인증이 필요합니다.");
            }

            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다: " + postId));

            // 제목과 내용 수정
            if (postDTO.getPostTitle() != null) {
                post.setPostTitle(postDTO.getPostTitle());
            }
            if (postDTO.getPostContent() != null) {
                post.setPostContent(postDTO.getPostContent());
            }
            post.setUpdatedAt(new Date());

            Post updatedPost = postRepository.save(post);
            return ResponseEntity.ok(new PostDTO(updatedPost));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("게시글 수정 중 오류 발생: " + e.getMessage());
        }
    }

    // 공지사항 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Integer postId, HttpServletRequest request) {
        try {
            String memberNo = getMemberNoFromRequest(request);
            if (memberNo == null) {
                return ResponseEntity.status(401).body("인증이 필요합니다.");
            }

            if (!postRepository.existsById(postId)) {
                return ResponseEntity.notFound().build();
            }

            postRepository.deleteById(postId);
            return ResponseEntity.ok("게시글이 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("게시글 삭제 중 오류 발생: " + e.getMessage());
        }
    }

    // 특정 공지사항 조회 (수정용)
    @GetMapping("/{postId}")
    public ResponseEntity<?> getPost(@PathVariable Integer postId) {
        try {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다: " + postId));
            return ResponseEntity.ok(new PostDTO(post));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
