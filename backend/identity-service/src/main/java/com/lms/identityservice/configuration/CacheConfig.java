package com.lms.identityservice.configuration;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.lms.identityservice.constant.CacheNames;
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

    @Value("${app.cache.ttl.default-minutes:10}")
    long defaultTtlMinutes;

    @Value("${app.cache.ttl.user-full-minutes:15}")
    long userFullTtlMinutes;

    @Value("${app.cache.ttl.user-exists-minutes:10}")
    long userExistsTtlMinutes;

    @Value("${app.cache.ttl.admin-list-minutes:2}")
    long adminListTtlMinutes;

    @Value("${app.cache.ttl.admin-stats-minutes:2}")
    long adminStatsTtlMinutes;

    @Value("${app.cache.ttl.auth-username-minutes:5}")
    long authUsernameTtlMinutes;

    @Value("${app.cache.ttl.auth-email-minutes:5}")
    long authEmailTtlMinutes;

    @Value("${app.cache.ttl.auth-provider-minutes:5}")
    long authProviderTtlMinutes;

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
                CacheNames.USER_FULL, defaultConfiguration.entryTtl(Duration.ofMinutes(userFullTtlMinutes)),
                CacheNames.USER_EXISTS, defaultConfiguration.entryTtl(Duration.ofMinutes(userExistsTtlMinutes)),
                CacheNames.ADMIN_LIST, defaultConfiguration.entryTtl(Duration.ofMinutes(adminListTtlMinutes)),
                CacheNames.ADMIN_STATS, defaultConfiguration.entryTtl(Duration.ofMinutes(adminStatsTtlMinutes)),
                CacheNames.AUTH_USERNAME, defaultConfiguration.entryTtl(Duration.ofMinutes(authUsernameTtlMinutes)),
                CacheNames.AUTH_EMAIL, defaultConfiguration.entryTtl(Duration.ofMinutes(authEmailTtlMinutes)),
                CacheNames.AUTH_PROVIDER, defaultConfiguration.entryTtl(Duration.ofMinutes(authProviderTtlMinutes)));

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
