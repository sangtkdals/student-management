package com.example.studentmanagement.config;

import com.example.studentmanagement.util.JwtRequestFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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
    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        
        // 인증 불필요
        .requestMatchers("/api/login", "/api/register", "/api/refreshtoken", "/api/hello", "/error").permitAll()
        
        // 공지사항: GET은 모두 허용, POST/PUT/DELETE는 관리자만
        .requestMatchers(HttpMethod.GET, "/api/announcements/**").permitAll()
        .requestMatchers(HttpMethod.POST, "/api/announcements/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/announcements/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/announcements/**").hasRole("ADMIN")
        
        // 학사일정: GET은 모두 허용, CUD는 관리자만
        .requestMatchers(HttpMethod.GET, "/api/schedules/**").permitAll()
        .requestMatchers(HttpMethod.POST, "/api/schedules/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/schedules/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/schedules/**").hasRole("ADMIN")
        
        // 휴학 신청
        .requestMatchers(HttpMethod.POST, "/api/leave-applications").hasRole("STUDENT")
        .requestMatchers(HttpMethod.GET, "/api/leave-applications/my").hasRole("STUDENT")
        .requestMatchers(HttpMethod.POST, "/api/leave-applications/return").hasRole("STUDENT")
        .requestMatchers(HttpMethod.PUT, "/api/leave-applications/*/approve").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/leave-applications/*/reject").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/leave-applications/return/*").hasRole("ADMIN")
        .requestMatchers(HttpMethod.GET, "/api/leave-applications/on-leave").hasRole("ADMIN")
        .requestMatchers(HttpMethod.GET, "/api/leave-applications").hasRole("ADMIN")
        
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
