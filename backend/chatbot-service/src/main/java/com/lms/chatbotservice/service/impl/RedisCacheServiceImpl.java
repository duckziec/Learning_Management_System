package com.lms.chatbotservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.chatbotservice.entity.ChatMessage;
import com.lms.chatbotservice.service.RedisCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisCacheServiceImpl implements RedisCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper redisObjectMapper;

    private static final String KEY_PREFIX = "chat:session:";
    private static final String KEY_SUFFIX = ":messages";
    @Value("${chatbot.cache.redis.ttl-hours:24}")
    long ttlHours;

    // Giới hạn số tin nhắn lưu trong Redis
    // Chỉ giữ 20 tin gần nhất để tránh cache phình to
    @Value("${chatbot.cache.redis.max-messages:20}")
    int maxMessages;

    // Key: chat:session:{sessionId}:messages
    private String buildKey(String sessionId) {
        return KEY_PREFIX + sessionId + KEY_SUFFIX;
    }

    @Override
    public void saveMessages(String sessionId, List<ChatMessage> messages) {
        String key = buildKey(sessionId);

        // messages là ASC (cũ → mới). Giữ MAX_MESSAGES tin nhắn mới nhất.
        List<ChatMessage> toCache = messages.size() > maxMessages
                ? messages.subList(messages.size() - maxMessages, messages.size())
                : messages;

        redisTemplate.delete(key);
        redisTemplate.opsForList().rightPushAll(key, new ArrayList<Object>(toCache));
        redisTemplate.expire(key, Duration.ofHours(ttlHours));

        log.debug("Cached {} messages for session {}", toCache.size(), sessionId);
    }

    @Override
    public List<ChatMessage> getMessages(String sessionId) {
        String key = buildKey(sessionId);

        // Kiểm tra key có tồn tại không trước khi lấy
        Boolean exists = redisTemplate.hasKey(key);
        if (Boolean.FALSE.equals(exists)) {
            log.debug("Cache miss for session {}", sessionId);
            return null;    // null = cache miss, caller sẽ fallback về MongoDB
        }

        List<Object> raw = redisTemplate.opsForList().range(key, 0, -1);
        if (raw == null || raw.isEmpty()) {
            return null;
        }

        // Deserialize từ LinkedHashMap (Jackson default) về ChatMessage
        List<ChatMessage> messages = new ArrayList<>();
        for (Object item : raw) {
            ChatMessage message = redisObjectMapper.convertValue(item, ChatMessage.class);
            messages.add(message);
        }

        log.debug("Cache hit for session {}, {} messages", sessionId, messages.size());
        return messages;
    }

    @Override
    public void appendMessage(String sessionId, ChatMessage message) {
        String key = buildKey(sessionId);

        Boolean exists = redisTemplate.hasKey(key);
        if (Boolean.FALSE.equals(exists)) {
            // Cache đã hết TTL, không append vào key không tồn tại
            // History Manager sẽ reload từ MongoDB lần sau
            log.debug("Skip append — cache expired for session {}", sessionId);
            return;
        }

        redisTemplate.opsForList().rightPush(key, message);

        // Nếu vượt MAX_MESSAGES thì trim — xóa tin nhắn cũ nhất (đầu list)
        Long size = redisTemplate.opsForList().size(key);
        if (size != null && size > maxMessages) {
            redisTemplate.opsForList().leftPop(key);
        }

        // Refresh TTL mỗi khi có tin nhắn mới
        redisTemplate.expire(key, Duration.ofHours(ttlHours));

        log.debug("Appended message to session {}, new size ~{}", sessionId, size);
    }

    @Override
    public void evict(String sessionId) {
        String key = buildKey(sessionId);
        redisTemplate.delete(key);
        log.debug("Evicted cache for session {}", sessionId);
    }
}
