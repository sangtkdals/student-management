package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.User;
import com.example.studentmanagement.repository.UserRepository;
import com.example.studentmanagement.dto.UserRequest;
import com.example.studentmanagement.dto.UserResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByMId(request.getMId())) {
            throw new RuntimeException("이미 존재하는 사용자 ID입니다.");
        }
        if (request.getMNo() != null && userRepository.existsByMNo(request.getMNo())) {
            throw new RuntimeException("이미 존재하는 학번/교번입니다.");
        }

        User user = new User();
        user.setMId(request.getMId());
        user.setMPwd(request.getMPwd());
        user.setMName(request.getMName());
        user.setMType(request.getMType());
        user.setMNo(request.getMNo());
        user.setMEmail(request.getMEmail());
        user.setMPhone(request.getMPhone());
        user.setMNum(request.getMNum());
        user.setMBirth(request.getMBirth());
        user.setMAddr(request.getMAddr());
        user.setDeptCode(request.getDeptCode());
        user.setStuGrade(request.getStuGrade());
        user.setEnrollmentStatus(request.getEnrollmentStatus());
        user.setPosition(request.getPosition());
        user.setOfficeRoom(request.getOfficeRoom());
        user.setMajorField(request.getMajorField());
        user.setStartDate(request.getStartDate());

        User saved = userRepository.save(user);
        return UserResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByMId(String mId) {
        User user = userRepository.findById(mId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return UserResponse.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByMNo(String mNo) {
        User user = userRepository.findByMNo(mNo)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return UserResponse.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByMType(String mType) {
        return userRepository.findByMType(mType).stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByDeptCode(String deptCode) {
        return userRepository.findByDeptCode(deptCode).stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> searchUsersByName(String mName) {
        return userRepository.findByMNameContaining(mName).stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public UserResponse updateUser(String mId, UserRequest request) {
        User user = userRepository.findById(mId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (request.getMPwd() != null) user.setMPwd(request.getMPwd());
        if (request.getMName() != null) user.setMName(request.getMName());
        if (request.getMEmail() != null) user.setMEmail(request.getMEmail());
        if (request.getMPhone() != null) user.setMPhone(request.getMPhone());
        if (request.getMAddr() != null) user.setMAddr(request.getMAddr());
        if (request.getDeptCode() != null) user.setDeptCode(request.getDeptCode());
        if (request.getStuGrade() != null) user.setStuGrade(request.getStuGrade());
        if (request.getEnrollmentStatus() != null) user.setEnrollmentStatus(request.getEnrollmentStatus());
        if (request.getPosition() != null) user.setPosition(request.getPosition());
        if (request.getOfficeRoom() != null) user.setOfficeRoom(request.getOfficeRoom());
        if (request.getMajorField() != null) user.setMajorField(request.getMajorField());

        return UserResponse.fromEntity(userRepository.save(user));
    }

    public void deleteUser(String mId) {
        User user = userRepository.findById(mId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public UserResponse authenticate(String mId, String mPwd) {
        User user = userRepository.findByMIdAndMPwd(mId, mPwd)
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다."));
        return UserResponse.fromEntity(user);
    }

    public void changePassword(String mId, String currentPassword, String newPassword) {
        User user = userRepository.findById(mId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (!user.getMPwd().equals(currentPassword)) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        if (currentPassword.equals(newPassword)) {
            throw new RuntimeException("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
        }

        if (newPassword.length() < 4) {
            throw new RuntimeException("새 비밀번호는 최소 4자 이상이어야 합니다.");
        }

        user.setMPwd(newPassword);
        userRepository.save(user);
    }
}
