package com.example.studentmanagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // m_id로 사용자 조회
    @Query("SELECT u FROM User u WHERE u.mId = :mId")
    Optional<User> findByMId(@Param("mId") String mId);

    // m_no로 사용자 조회
    @Query("SELECT u FROM User u WHERE u.mNo = :mNo")
    Optional<User> findByMNo(@Param("mNo") String mNo);

    // 역할별 사용자 조회
    @Query("SELECT u FROM User u WHERE u.mType = :mType")
    List<User> findByMType(@Param("mType") String mType);

    // 학과별 사용자 조회
    List<User> findByDeptCode(String deptCode);

    // 역할과 학과로 필터링
    @Query("SELECT u FROM User u WHERE u.mType = :mType AND u.deptCode = :deptCode")
    List<User> findByMTypeAndDeptCode(@Param("mType") String mType, @Param("deptCode") String deptCode);

    // 이름으로 검색 (부분 일치)
    @Query("SELECT u FROM User u WHERE u.mName LIKE %:mName%")
    List<User> findByMNameContaining(@Param("mName") String mName);

    // 이메일로 사용자 조회
    @Query("SELECT u FROM User u WHERE u.mEmail = :mEmail")
    Optional<User> findByMEmail(@Param("mEmail") String mEmail);

    // m_id와 password로 인증
    @Query("SELECT u FROM User u WHERE u.mId = :mId AND u.mPwd = :mPwd")
    Optional<User> findByMIdAndMPwd(@Param("mId") String mId, @Param("mPwd") String mPwd);

    // m_id 존재 여부 확인
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.mId = :mId")
    boolean existsByMId(@Param("mId") String mId);

    // m_no 존재 여부 확인
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.mNo = :mNo")
    boolean existsByMNo(@Param("mNo") String mNo);

    // 이메일 존재 여부 확인
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.mEmail = :mEmail")
    boolean existsByMEmail(@Param("mEmail") String mEmail);
}
