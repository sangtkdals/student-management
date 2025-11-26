package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.UserRequest;
import com.example.studentmanagement.dto.UserResponse;
import com.example.studentmanagement.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest request) {
        try {
            UserResponse response = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{mId}")
    public ResponseEntity<UserResponse> getUserByMId(@PathVariable String mId) {
        try {
            return ResponseEntity.ok(userService.getUserByMId(mId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/m-no/{mNo}")
    public ResponseEntity<UserResponse> getUserByMNo(@PathVariable String mNo) {
        try {
            return ResponseEntity.ok(userService.getUserByMNo(mNo));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/type/{mType}")
    public ResponseEntity<List<UserResponse>> getUsersByMType(@PathVariable String mType) {
        return ResponseEntity.ok(userService.getUsersByMType(mType));
    }

    @GetMapping("/department/{deptCode}")
    public ResponseEntity<List<UserResponse>> getUsersByDeptCode(@PathVariable String deptCode) {
        return ResponseEntity.ok(userService.getUsersByDeptCode(deptCode));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsersByName(@RequestParam String name) {
        return ResponseEntity.ok(userService.searchUsersByName(name));
    }

    @PutMapping("/{mId}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable String mId, @RequestBody UserRequest request) {
        try {
            return ResponseEntity.ok(userService.updateUser(mId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{mId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String mId) {
        try {
            userService.deleteUser(mId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest request) {
        try {
            UserResponse response = userService.authenticate(request.getMId(), request.getMPwd());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/{mId}/change-password")
    public ResponseEntity<Void> changePassword(
            @PathVariable String mId,
            @RequestBody PasswordChangeRequest request) {
        try {
            userService.changePassword(mId, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
