package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.repository.ProfileRepository;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Optional<Member> getMemberById(String memberId) {
        return profileRepository.findByMemberId(memberId);
    }

    @Transactional
    public Member updateMemberProfile(String memberId, Member updatedDetails) throws Exception {
        Member member = profileRepository.findByMemberId(memberId)
                .orElseThrow(() -> new Exception("User not found with id: " + memberId));

        member.setEmail(updatedDetails.getEmail());
        member.setPhone(updatedDetails.getPhone());
        member.setAddress(updatedDetails.getAddress());

        if (updatedDetails.getPassword() != null && !updatedDetails.getPassword().isEmpty()) {
            member.setPassword(updatedDetails.getPassword());
        }

        return profileRepository.save(member);
    }
}