package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Announcement;
import com.example.studentmanagement.repository.AnnouncementRepository;
import com.example.studentmanagement.dto.AnnouncementRequest;
import com.example.studentmanagement.dto.AnnouncementResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    public AnnouncementResponse createAnnouncement(AnnouncementRequest request) {
        Announcement announcement = new Announcement();
        announcement.setBoardId(request.getBoardId());
        announcement.setPostTitle(request.getPostTitle());
        announcement.setPostContent(request.getPostContent());
        announcement.setWriterId(request.getWriterId());

        return AnnouncementResponse.fromEntity(announcementRepository.save(announcement));
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(AnnouncementResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnnouncementResponse getAnnouncementById(Integer postId) {
        Announcement announcement = announcementRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다."));

        // 조회수 증가
        announcement.setViewCount(announcement.getViewCount() + 1);
        announcementRepository.save(announcement);

        return AnnouncementResponse.fromEntity(announcement);
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAnnouncementsByBoardId(Integer boardId) {
        return announcementRepository.findByBoardIdOrderByCreatedAtDesc(boardId)
                .stream().map(AnnouncementResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> searchAnnouncementsByTitle(String postTitle) {
        return announcementRepository.findByPostTitleContainingOrderByCreatedAtDesc(postTitle)
                .stream().map(AnnouncementResponse::fromEntity).collect(Collectors.toList());
    }

    public AnnouncementResponse updateAnnouncement(Integer postId, AnnouncementRequest request) {
        Announcement announcement = announcementRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다."));

        if (request.getPostTitle() != null) announcement.setPostTitle(request.getPostTitle());
        if (request.getPostContent() != null) announcement.setPostContent(request.getPostContent());
        if (request.getBoardId() != null) announcement.setBoardId(request.getBoardId());

        return AnnouncementResponse.fromEntity(announcementRepository.save(announcement));
    }

    public void deleteAnnouncement(Integer postId) {
        announcementRepository.deleteById(postId);
    }
}
