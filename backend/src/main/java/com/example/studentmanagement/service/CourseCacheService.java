package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseCacheService implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public CourseCacheService(CourseRepository courseRepository, @Qualifier("redisTemplate") RedisTemplate<String, Object> redisTemplate) {
        this.courseRepository = courseRepository;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        // 애플리케이션 시작 시, 모든 강의 정보를 DB에서 조회
        List<Course> courses = courseRepository.findAll();
        for (Course course : courses) {
            // 각 강의의 최대 수강 인원 정보를 Redis에 저장 (캐싱)
            String maxStuKey = "course:max_stu:" + course.getCourseCode();
            redisTemplate.opsForValue().set(maxStuKey, String.valueOf(course.getMaxStu()));
        }
    }
}
