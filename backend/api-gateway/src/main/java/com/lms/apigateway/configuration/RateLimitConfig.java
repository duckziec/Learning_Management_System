package com.lms.apigateway.configuration;

import io.jsonwebtoken.Claims;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import reactor.core.publisher.Mono;

import java.net.InetSocketAddress;

@Configuration
public class RateLimitConfig {

    private final JwtUtil jwtUtil;

    public RateLimitConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean(name = "userThenIpKeyResolver")
    public KeyResolver userThenIpKeyResolver() {
        return exchange -> {
            ServerHttpRequest request = exchange.getRequest();

            String userId = request.getHeaders().getFirst("X-User-Id");
            String gatewayAuthenticated = request.getHeaders().getFirst("X-Gateway-Authenticated");
            if ("true".equals(gatewayAuthenticated) && hasText(userId)) {
                return Mono.just("user:" + userId);
            }

            String authorization = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            return jwtUtil.extractToken(authorization)
                    .flatMap(jwtUtil::verify)
                    .map(Claims::getSubject)
                    .filter(this::hasText)
                    .map(subject -> Mono.just("user:" + subject))
                    .orElseGet(() -> Mono.just("ip:" + resolveClientIp(request)));
        };
    }

    private String resolveClientIp(ServerHttpRequest request) {
        String forwardedFor = request.getHeaders().getFirst("X-Forwarded-For");
        if (hasText(forwardedFor)) {
            return forwardedFor.split(",")[0].trim();
        }

        InetSocketAddress remoteAddress = request.getRemoteAddress();
        if (remoteAddress != null && remoteAddress.getAddress() != null) {
            return remoteAddress.getAddress().getHostAddress();
        }

        return "unknown";
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
