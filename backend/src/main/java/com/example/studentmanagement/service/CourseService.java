package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.dto.CourseRequest;
import com.example.studentmanagement.dto.CourseResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public CourseResponse createCourse(CourseRequest request) {
        if (courseRepository.existsById(request.getCourseCode())) {
            throw new RuntimeException("이미 존재하는 과목코드입니다.");
        }

        Course course = new Course();
        course.setCourseCode(request.getCourseCode());
        course.setAcademicYear(request.getAcademicYear());
        course.setSemester(request.getSemester());
        course.setSCode(request.getSCode());
        course.setCourseClass(request.getCourseClass());
        course.setProfessorNo(request.getProfessorNo());
        course.setMaxStu(request.getMaxStu());
        course.setCurrentStudents(request.getCurrentStudents() != null ? request.getCurrentStudents() : 0);
        course.setClassroom(request.getClassroom());
        course.setCourseTime(request.getCourseTime());
        course.setCourseObjectives(request.getCourseObjectives());
        course.setCourseContent(request.getCourseContent());
        course.setEvaluationMethod(request.getEvaluationMethod());
        course.setTextbookInfo(request.getTextbookInfo());
        course.setCourseStatus(request.getCourseStatus());

        return CourseResponse.fromEntity(courseRepository.save(course));
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAllByOrderByCourseCodeAsc()
                .stream().map(CourseResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseByCourseCode(String courseCode) {
        Course course = courseRepository.findById(courseCode)
                .orElseThrow(() -> new RuntimeException("강의를 찾을 수 없습니다."));
        return CourseResponse.fromEntity(course);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesByProfessorNo(String professorNo) {
        return courseRepository.findByProfessorNo(professorNo)
                .stream().map(CourseResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesByYearAndSemester(Integer year, Integer semester) {
        return courseRepository.findByAcademicYearAndSemester(year, semester)
                .stream().map(CourseResponse::fromEntity).collect(Collectors.toList());
    }

    public CourseResponse updateCourse(String courseCode, CourseRequest request) {
        Course course = courseRepository.findById(courseCode)
                .orElseThrow(() -> new RuntimeException("강의를 찾을 수 없습니다."));

        if (request.getAcademicYear() != null) course.setAcademicYear(request.getAcademicYear());
        if (request.getSemester() != null) course.setSemester(request.getSemester());
        if (request.getSCode() != null) course.setSCode(request.getSCode());
        if (request.getCourseClass() != null) course.setCourseClass(request.getCourseClass());
        if (request.getProfessorNo() != null) course.setProfessorNo(request.getProfessorNo());
        if (request.getMaxStu() != null) course.setMaxStu(request.getMaxStu());
        if (request.getCurrentStudents() != null) course.setCurrentStudents(request.getCurrentStudents());
        if (request.getClassroom() != null) course.setClassroom(request.getClassroom());
        if (request.getCourseTime() != null) course.setCourseTime(request.getCourseTime());
        if (request.getCourseObjectives() != null) course.setCourseObjectives(request.getCourseObjectives());
        if (request.getCourseContent() != null) course.setCourseContent(request.getCourseContent());
        if (request.getEvaluationMethod() != null) course.setEvaluationMethod(request.getEvaluationMethod());
        if (request.getTextbookInfo() != null) course.setTextbookInfo(request.getTextbookInfo());
        if (request.getCourseStatus() != null) course.setCourseStatus(request.getCourseStatus());

        return CourseResponse.fromEntity(courseRepository.save(course));
    }

    public void deleteCourse(String courseCode) {
        courseRepository.deleteById(courseCode);
    }

    public CourseResponse enrollStudent(String courseCode) {
        Course course = courseRepository.findById(courseCode)
                .orElseThrow(() -> new RuntimeException("강의를 찾을 수 없습니다."));

        if (course.getMaxStu() != null && course.getCurrentStudents() >= course.getMaxStu()) {
            throw new RuntimeException("수강 정원이 초과되었습니다.");
        }

        course.setCurrentStudents(course.getCurrentStudents() + 1);
        return CourseResponse.fromEntity(courseRepository.save(course));
    }

    public CourseResponse dropStudent(String courseCode) {
        Course course = courseRepository.findById(courseCode)
                .orElseThrow(() -> new RuntimeException("강의를 찾을 수 없습니다."));

        if (course.getCurrentStudents() > 0) {
            course.setCurrentStudents(course.getCurrentStudents() - 1);
        }

        return CourseResponse.fromEntity(courseRepository.save(course));
    }
}
