package com.example.studentmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RefreshTokenService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Async("threadPoolTaskExecutor")
    public void saveRefreshToken(String memberId, String refreshToken, long validityMs) {
        redisTemplate.opsForValue().set(
                memberId,
                refreshToken,
                validityMs,
                TimeUnit.MILLISECONDS
        );
    }

    @Scheduled(fixedRate = 600000) // 10분마다 실행
    public void saveRedisData() {
        redisTemplate.getConnectionFactory().getConnection().bgSave();
    }
}
