package com.lms.chatbotservice.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${chatbot.web-client.max-in-memory-size-bytes:2097152}")
    int maxInMemorySizeBytes;

    @Bean
    public WebClient geminiWebClient(GeminiProperties geminiProperties) {
        return WebClient.builder()
                .baseUrl(geminiProperties.getBaseUrl())
                .defaultHeader("Content-Type", "application/json")
                .codecs(config -> config
                        .defaultCodecs()
                        .maxInMemorySize(maxInMemorySizeBytes))
                .build();
    }
}
