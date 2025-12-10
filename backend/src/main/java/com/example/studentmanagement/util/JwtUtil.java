package com.example.studentmanagement.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.studentmanagement.service.RefreshTokenService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Component
public class JwtUtil {

    // In a real application, store this in application.properties or environment variables
    private final String SECRET_KEY_STRING = "your-256-bit-secret-your-256-bit-secret"; 
    private final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());
    
    // 15 minutes validity for access token
    private final long ACCESS_TOKEN_VALIDITY_MS = 1000 * 60 * 15; 
    // 7 days validity for refresh token
    private final long REFRESH_TOKEN_VALIDITY_MS = 1000 * 60 * 60 * 24 * 7;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String username, String role, String memberNo) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("memberNo", memberNo);
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY_MS))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    public String createRefreshToken(String memberId) {
        String refreshToken = UUID.randomUUID().toString();
        refreshTokenService.saveRefreshToken(memberId, refreshToken, REFRESH_TOKEN_VALIDITY_MS);
        return refreshToken;
    }

    public String getRefreshToken(String memberId) {
        return (String) redisTemplate.opsForValue().get(memberId);
    }

    public String getMemberNoFromToken(String token) {
        return extractClaim(token, claims -> claims.get("memberNo", String.class));
    }
}
