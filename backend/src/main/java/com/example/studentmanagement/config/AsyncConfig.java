package com.example.studentmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
public class AsyncConfig {

    @Bean(name = "enrollmentExecutor")
    public Executor enrollmentExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10); // 기본 스레드 수
        executor.setMaxPoolSize(20);  // 최대 스레드 수
        executor.setQueueCapacity(1000); // 대기 큐 크기
        executor.setThreadNamePrefix("Enrollment-");
        executor.initialize();
        return executor;
    }
}
