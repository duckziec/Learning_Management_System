package com.lms.assignmentservice.configuration;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.lms.assignmentservice.constant.CacheNames;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.Map;

@Configuration
@Slf4j
public class CacheConfig implements CachingConfigurer {

    @Value("${assignment.cache.ttl.default-minutes:10}")
    long defaultTtlMinutes;

    @Value("${assignment.cache.ttl.problems-minutes:10}")
    long problemsTtlMinutes;

    @Value("${assignment.cache.ttl.problem-detail-minutes:15}")
    long problemDetailTtlMinutes;

    @Value("${assignment.cache.ttl.quizzes-minutes:5}")
    long quizzesTtlMinutes;

    @Value("${assignment.cache.ttl.testcases-minutes:10}")
    long testcasesTtlMinutes;

    @Value("${assignment.cache.ttl.leaderboard-minutes:5}")
    long leaderboardTtlMinutes;

    @Bean
    public RedisCacheManager redisCacheManager(RedisConnectionFactory redisConnectionFactory) {

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.activateDefaultTyping(
                objectMapper.getPolymorphicTypeValidator(),
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );

        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        RedisCacheConfiguration defaultConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(defaultTtlMinutes))
                .disableCachingNullValues()
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));

        Map<String, RedisCacheConfiguration> cacheConfigurations = Map.of(
                CacheNames.ASSIGNMENT_PROBLEMS, defaultConfiguration.entryTtl(Duration.ofMinutes(problemsTtlMinutes)),
                CacheNames.ASSIGNMENT_PROBLEM_DETAIL, defaultConfiguration.entryTtl(Duration.ofMinutes(problemDetailTtlMinutes)),
                CacheNames.ASSIGNMENT_PROBLEM_DETAIL_BY_SLUG, defaultConfiguration.entryTtl(Duration.ofMinutes(problemDetailTtlMinutes)),
                CacheNames.ASSIGNMENT_QUIZZES, defaultConfiguration.entryTtl(Duration.ofMinutes(quizzesTtlMinutes)),
                CacheNames.ASSIGNMENT_QUIZZES_INSTRUCTOR, defaultConfiguration.entryTtl(Duration.ofMinutes(quizzesTtlMinutes)),
                CacheNames.ASSIGNMENT_QUIZZES_STUDENT, defaultConfiguration.entryTtl(Duration.ofMinutes(quizzesTtlMinutes)),
                CacheNames.ASSIGNMENT_TESTCASES, defaultConfiguration.entryTtl(Duration.ofMinutes(testcasesTtlMinutes)),
                CacheNames.ASSIGNMENT_LEADERBOARD_CODING, defaultConfiguration.entryTtl(Duration.ofMinutes(leaderboardTtlMinutes)),
                CacheNames.ASSIGNMENT_LEADERBOARD_QUIZ, defaultConfiguration.entryTtl(Duration.ofMinutes(leaderboardTtlMinutes)));

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfiguration)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware()
                .build();
    }

    @Override
    public CacheErrorHandler errorHandler() {
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException exception, Cache cache, Object key) {
                log.warn("Cache get failed for cache={} key={}", cache.getName(), key, exception);
            }

            @Override
            public void handleCachePutError(RuntimeException exception, Cache cache, Object key, Object value) {
                log.warn("Cache put failed for cache={} key={}", cache.getName(), key, exception);
            }

            @Override
            public void handleCacheEvictError(RuntimeException exception, Cache cache, Object key) {
                log.warn("Cache evict failed for cache={} key={}", cache.getName(), key, exception);
            }

            @Override
            public void handleCacheClearError(RuntimeException exception, Cache cache) {
                log.warn("Cache clear failed for cache={}", cache.getName(), exception);
            }
        };
    }
}
