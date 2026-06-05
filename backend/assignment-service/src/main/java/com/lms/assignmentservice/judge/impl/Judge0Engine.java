package com.lms.assignmentservice.judge.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.assignmentservice.enums.SubmissionStatus;
import com.lms.assignmentservice.enums.TestCaseStatus;
import com.lms.assignmentservice.judge.JudgeEngine;
import com.lms.assignmentservice.judge.JudgeEngineException;
import com.lms.assignmentservice.judge.JudgeRequest;
import com.lms.assignmentservice.judge.JudgeResult;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "judge.engine", havingValue = "judge0")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class Judge0Engine implements JudgeEngine {

    @Value("${judge.engine}")
    String engine;

    @Value("${judge.judge0.base-url}")
    String baseUrl;

    @Value("${judge.judge0.api-key}")
    String apiKey;

    @Value("${judge.judge0.max-poll-attempts}")
    int maxPollAttempts;

    @Value("${judge.judge0.poll-interval-ms}")
    long pollIntervalMs;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper;


    // Judge0 Language ID mapping
    private static final Map<String, Integer> LANGUAGE_IDS = Map.ofEntries(
            Map.entry("C", 50),
            Map.entry("CPP", 54),
            Map.entry("C_PLUS_PLUS", 54),

            Map.entry("JAVA", 62),
            Map.entry("PYTHON", 71),

            Map.entry("JAVASCRIPT", 63),
            Map.entry("JS", 63),

            Map.entry("TYPESCRIPT", 74),
            Map.entry("TS", 74),

            Map.entry("GO", 60),
            Map.entry("GOLANG", 60),

            Map.entry("RUST", 73)
    );

    @Override
    public String engineName() {
        return engine;
    }

    @Override
    public List<String> supportedLanguages() {
        return new ArrayList<>(LANGUAGE_IDS.keySet());
    }

    @Override
    public JudgeResult judge(JudgeRequest request) throws JudgeEngineException {
        log.debug("Judge0: bắt đầu chấm {} test cases, lang={}",
                request.getTestCases().size(), request.getLanguage());

        try {
            // submit batch
            List<String> tokens = submitBatch(request);

            // return ve kqua
            List<Judge0Result> results = pollResults(tokens);

            // covert sang judgeResult
            return mapToJudgeResult(request, results);

        } catch (JudgeEngineException e) {
            throw e;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new JudgeEngineException(
                    JudgeEngineException.ErrorType.TIMEOUT,
                    "Judge0 bị interrupt khi polling", e);
        } catch (Exception e) {
            throw new JudgeEngineException(
                    JudgeEngineException.ErrorType.UNKNOWN,
                    "Judge0 lỗi không xác định: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean isHealthy() {
        try {
            restTemplate.getForEntity(baseUrl + "/about", String.class);
            return true;
        } catch (Exception e) {
            log.warn("Judge0 health check thất bại: {}", e.getMessage());
            return false;
        }
    }

    // ==================== Private: Judge0 Specific ====================

    private List<String> submitBatch(JudgeRequest request) {
        Integer languageId = LANGUAGE_IDS.get(request.getLanguage());
        if (languageId == null) {
            throw new JudgeEngineException(JudgeEngineException.ErrorType.INVALID_RESPONSE,
                    "Judge0 không hỗ trợ ngôn ngữ: " + request.getLanguage());
        }

        List<Map<String, Object>> submissions = request.getTestCases().stream()
                .map(tc -> {
                    Map<String, Object> sub = new HashMap<>();
                    sub.put("source_code", encodeBase64(request.getSourceCode()));
                    sub.put("language_id", languageId);
                    sub.put("stdin", encodeBase64(tc.getInput()));
                    sub.put("expected_output", encodeBase64(tc.getExpectedOutput()));
                    sub.put("cpu_time_limit", request.getTimeLimitMs() / 1000.0f);
                    sub.put("memory_limit", request.getMemoryLimitMb() * 1024);
                    return sub;
                }).toList();

        try {
            String jsonPayload = objectMapper.writeValueAsString(Map.of("submissions", submissions));

            // In ra log gói hàng gửi đi nhu thế nào
            log.debug("Payload gửi sang Judge0: {}", jsonPayload);

            var response = restTemplate.exchange(
                    baseUrl + "/submissions/batch?base64_encoded=true&wait=false",
                    HttpMethod.POST,
                    new HttpEntity<>(jsonPayload, buildHeaders()),
                    List.class
            );

            if (response.getBody() == null) {
                throw new JudgeEngineException(JudgeEngineException.ErrorType.INVALID_RESPONSE,
                        "Judge0 trả về null khi tạo batch");
            }

            @SuppressWarnings("unchecked")
            List<Map<String, String>> body = response.getBody();

            return body.stream().map(m -> m.get("token")).toList();

        } catch (JudgeEngineException e) {
            throw e;
        } catch (RestClientResponseException e) {
            throw mapJudge0HttpException(e);
        } catch (Exception e) {
            throw new JudgeEngineException(
                    JudgeEngineException.ErrorType.CONNECTION_FAILED,
                    "Không kết nối được Judge0: " + e.getMessage(), e);
        }
    }

    private List<Judge0Result> pollResults(List<String> tokens) throws InterruptedException {

        String token = String.join(",", tokens);
        String url = baseUrl + "/submissions/batch?tokens=" + token
                + "&base64_encoded=true&fields=token,status,stdout,stderr,compile_output,time,memory,message";
        List<Judge0Result> latestResults = List.of();

        for (int attempt = 0; attempt < maxPollAttempts; attempt++) {
            Thread.sleep(pollIntervalMs);

            try {
                var response = restTemplate.exchange(
                        url, HttpMethod.GET,
                        new HttpEntity<>(buildHeaders()),
                        Map.class
                );

                if (response.getBody() == null) continue;

                @SuppressWarnings("unchecked")
                List<Map<String, Object>> submissions =
                        (List<Map<String, Object>>) response.getBody().get("submissions");

                if (submissions == null) continue;
                // Status ID: 1=In Queue, 2=Processing, 3+=Done
                latestResults = submissions.stream()
                        .map(this::parseResult)
                        .toList();
                boolean allDone = latestResults.stream()
                        .allMatch(result -> result.getStatusId() > 2);

                if (allDone) {
                    return latestResults;
                }

                log.debug("Judge0 polling attempt {}/{}: chưa xong", attempt + 1, maxPollAttempts);

            } catch (RestClientResponseException e) {
                if (e.getStatusCode().is4xxClientError()) {
                    throw mapJudge0HttpException(e);
                }
                log.warn("Judge0 poll lỗi attempt {}: {}", attempt + 1, e.getMessage());
            } catch (Exception e) {
                log.warn("Judge0 poll lỗi attempt {}: {}", attempt + 1, e.getMessage());
            }
        }

        throw new JudgeEngineException(
                JudgeEngineException.ErrorType.TIMEOUT,
                "Judge0 timeout sau " + (maxPollAttempts * pollIntervalMs / 1000) + " giây");
    }

    /**
     * Convert kết quả Judge0 → JudgeResult chuẩn.
     * Đây là nơi duy nhất biết Judge0 status ID có nghĩa gì.
     */
    private JudgeResult mapToJudgeResult(JudgeRequest request, List<Judge0Result> judge0Results) {
        List<JudgeResult.TestCaseResult> tcResults = new ArrayList<>();
        String compileError = null;
        SubmissionStatus overallStatus = SubmissionStatus.ACCEPTED;
        float totalWeight = 0;
        float acceptedWeight = 0;
        int maxTime = 0;
        int maxMemory = 0;

        List<JudgeRequest.TestCaseInput> testCases = request.getTestCases();

        for (int i = 0; i < testCases.size(); i++) {
            JudgeRequest.TestCaseInput tc = testCases.get(i);
            Judge0Result result = i < judge0Results.size() ? judge0Results.get(i) : null;

            if (result == null) {
                overallStatus = SubmissionStatus.INTERNAL_ERROR;
                break;
            }

            // Tìm trong vòng lặp test case
            if (result.getStatusId() >= 7) { // 7-11 là các lỗi Runtime
                log.error("Bắt lỗi TC {}: StatusID={}, stderr={}, compile={}, message={}",
                        tc.getTestCaseId(),
                        result.getStatusId(),
                        result.getStderr(),
                        result.getCompileOutput(),
                        result.getMessage());
            }

            // Compile error → dừng ngay
            if (result.getStatusId() == 6) {
                compileError = firstNonBlank(result.compileOutput, result.stderr, result.message);
                overallStatus = SubmissionStatus.COMPILATION_ERROR;
                break;
            }

            TestCaseStatus tcStatus = mapStatusId(result.getStatusId());
            totalWeight += tc.getScoreWeight();

            if (tcStatus == TestCaseStatus.AC) {
                acceptedWeight += tc.getScoreWeight();
            } else if (overallStatus == SubmissionStatus.ACCEPTED) {
                overallStatus = mapToSubmissionStatus(tcStatus);
            }

            int timeMs = result.getTimeMs();
            int memKb = result.memory != null ? result.memory : 0;
            maxTime = Math.max(maxTime, timeMs);
            maxMemory = Math.max(maxMemory, memKb);

            String output = firstNonBlank(result.stdout, result.stderr, result.message);
            String snippet = output != null && output.length() > 200
                    ? output.substring(0, 200) + "..." : output;

            tcResults.add(JudgeResult.TestCaseResult.builder()
                    .testCaseId(tc.getTestCaseId())
                    .status(tcStatus)
                    .timeMs(timeMs)
                    .memoryKb(memKb)
                    .hidden(tc.isHidden())
                    .outputSnippet(snippet)
                    .build());
        }

        // Tính điểm
        int score = 0;
        if (overallStatus != SubmissionStatus.COMPILATION_ERROR
                && overallStatus != SubmissionStatus.INTERNAL_ERROR
                && totalWeight > 0) {
            score = Math.round((acceptedWeight / totalWeight) * 100);
        }
        if (score == 100) overallStatus = SubmissionStatus.ACCEPTED;

        return JudgeResult.builder()
                .overallStatus(overallStatus)
                .totalScore(score)
                .maxExecTimeMs(maxTime)
                .maxMemoryKb(maxMemory)
                .compileError(compileError)
                .testCaseResults(tcResults)
                .build();
    }

    private TestCaseStatus mapStatusId(int id) {
        return switch (id) {
            case 3 -> TestCaseStatus.AC;
            case 4 -> TestCaseStatus.WA;
            case 5 -> TestCaseStatus.TLE;
            case 6 -> TestCaseStatus.CE;
            case 7, 8, 9, 10, 11 -> TestCaseStatus.RE;
            case 12 -> TestCaseStatus.MLE;
            default -> TestCaseStatus.RE;
        };
    }

    private SubmissionStatus mapToSubmissionStatus(TestCaseStatus s) {
        return switch (s) {
            case WA -> SubmissionStatus.WRONG_ANSWER;
            case TLE -> SubmissionStatus.TIME_LIMIT_EXCEEDED;
            case MLE -> SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
            case RE -> SubmissionStatus.RUNTIME_ERROR;
            case CE -> SubmissionStatus.COMPILATION_ERROR;
            default -> SubmissionStatus.WRONG_ANSWER;
        };
    }

    private Judge0Result parseResult(Map<String, Object> raw) {
        var r = new Judge0Result();
        Object status = raw.get("status");
        r.statusId = status instanceof Map<?, ?> statusMap ? toInt(statusMap.get("id")) : 0;
        r.stdout = decodeBase64((String) raw.get("stdout"));
        r.stderr = decodeBase64((String) raw.get("stderr"));
        r.compileOutput = decodeBase64((String) raw.get("compile_output"));
        r.time = raw.get("time") != null ? raw.get("time").toString() : null;
        r.memory = raw.get("memory") instanceof Number number ? number.intValue() : null;
        r.message = decodeBase64((String) raw.get("message"));

        return r;
    }

    private int toInt(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value instanceof String text) {
            try {
                return Integer.parseInt(text);
            } catch (NumberFormatException ignored) {
                return 0;
            }
        }
        return 0;
    }

    private String encodeBase64(String value) {
        if (value == null) return null;
        return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String decodeBase64(String value) {
        if (value == null || value.isBlank()) return value;
        try {
            return new String(Base64.getMimeDecoder().decode(value), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ignored) {
            return value;
        }
    }

    private JudgeEngineException mapJudge0HttpException(RestClientResponseException e) {
        JudgeEngineException.ErrorType errorType = e.getStatusCode().value() == 429
                ? JudgeEngineException.ErrorType.RATE_LIMITED
                : JudgeEngineException.ErrorType.INVALID_RESPONSE;
        return new JudgeEngineException(
                errorType,
                "Judge0 HTTP " + e.getStatusCode().value() + ": " + e.getResponseBodyAsString(),
                e);
    }

    private String firstNonBlank(String... values) {
        if (values == null) return null;
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private HttpHeaders buildHeaders() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (apiKey != null && !apiKey.isBlank()) {
            headers.set("X-Auth-Token", apiKey);
            //headers.set("X-RapidAPI-Key", apiKey);
            // headers.set("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com");
        }
        return headers;
    }

    // Internal model — chỉ dùng trong class này
    @Data
    private static class Judge0Result {
        int statusId;
        String stdout;
        String stderr;
        String compileOutput;
        String time;      // "0.145" seconds string
        Integer memory;    // KB
        String message;

        int getTimeMs() {
            if (time == null) return 0;
            try {
                return (int) (Double.parseDouble(time) * 1000);
            } catch (NumberFormatException e) {
                return 0;
            }
        }
    }
}
