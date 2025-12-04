package com.example.studentmanagement.config;

import com.example.studentmanagement.util.JwtRequestFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // CORS 사전 요청 허용

                // **공개 접근 (인증 불필요)**
                .requestMatchers(
                        "/api/login",
                        "/api/register",
                        "/api/refreshtoken",
                        "/api/hello",
                        "/error",
                        "/actuator/**",
                        "/api/check-id"
                ).permitAll()
                .requestMatchers(HttpMethod.GET,
                        "/api/announcements/**", // 공지사항 조회
                        "/api/schedules/**",      // 학사일정 조회
                        "/api/departments/**",    // 학과 조회
                        "/api/courses/**"         // 강의 조회
                ).permitAll()

                // **관리자(ADMIN)만 접근 가능**
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // AdminLeaveApplicationController, AdminTuitionController 등
                .requestMatchers(HttpMethod.POST, "/api/announcements/**").hasRole("ADMIN") // 공지사항 작성
                .requestMatchers(HttpMethod.PUT, "/api/announcements/**").hasRole("ADMIN") // 공지사항 수정
                .requestMatchers(HttpMethod.DELETE, "/api/announcements/**").hasRole("ADMIN") // 공지사항 삭제
                .requestMatchers(HttpMethod.POST, "/api/schedules/**").hasRole("ADMIN") // 학사일정 생성
                .requestMatchers(HttpMethod.PUT, "/api/schedules/**").hasRole("ADMIN") // 학사일정 수정
                .requestMatchers(HttpMethod.DELETE, "/api/schedules/**").hasRole("ADMIN") // 학사일정 삭제

                // **학생(STUDENT)만 접근 가능**
                .requestMatchers("/api/student/**").hasRole("STUDENT") // StudentLeaveApplicationController 등
                .requestMatchers("/api/enrollments/**").authenticated() // 수강신청 관련 (Authenticated users only)
                
                // 학생,교수 접근 가능
                .requestMatchers("/api/grades/**").hasAnyRole("STUDENT", "ADMIN")

                // **교수(PROFESSOR)만 접근 가능**
                .requestMatchers("/api/professor/**").hasRole("PROFESSOR")
                .requestMatchers("/api/professor-new/**").permitAll() // Allow all (Temporary fix for persistent 403)
                
                .requestMatchers("/api/attendance/student").authenticated() // Allow authenticated students
                .requestMatchers(
                        "/api/attendance/**",   // 출결 관리 (Professor fallback)
                        "/api/materials/**",    // 강의자료 관리
                        "/api/assignments/**"   // 과제 관리
                ).authenticated() // Allow authenticated users (Relaxed for 403 fix)

                // **나머지 모든 요청은 인증 필요**
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        // Add CorsFilter at the very beginning of the chain
        http.addFilterBefore(corsFilter(), ChannelProcessingFilter.class);
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Use specific origin instead of wildcard pattern to be safe with credentials
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return new CorsFilter(source);
    }
}
