package com.lms.assignmentservice.service.impl;

import com.lms.assignmentservice.constant.CacheNames;
import com.lms.assignmentservice.document.Submission;
import com.lms.assignmentservice.entity.Problem;
import com.lms.assignmentservice.entity.TestCase;
import com.lms.assignmentservice.enums.SubmissionStatus;
import com.lms.assignmentservice.judge.JudgeEngine;
import com.lms.assignmentservice.judge.JudgeEngineException;
import com.lms.assignmentservice.judge.JudgeRequest;
import com.lms.assignmentservice.judge.JudgeResult;
import com.lms.assignmentservice.repository.SubmissionRepository;
import com.lms.assignmentservice.repository.TestCaseRepository;
import com.lms.assignmentservice.service.ProblemService;
import com.lms.assignmentservice.service.SubmissionJudgingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SubmissionJudgingServiceImpl implements SubmissionJudgingService {

    SubmissionRepository submissionRepository;
    TestCaseRepository testCaseRepository;
    ProblemService problemService;
    JudgeEngine judgeEngine;
    CacheManager cacheManager;

    @Async("judgeExecutor")
    @Override
    public void judgeAsync(String submissionId, Problem problem, String sourceCode, String language) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElse(null);

        if (submission == null) return;

        submission.setStatus(SubmissionStatus.JUDGING.name());
        submissionRepository.save(submission);

        try {
            List<TestCase> testCases = testCaseRepository
                    .findByProblem_ProblemIdOrderByOrderIndexAsc(problem.getProblemId());

            if (testCases.isEmpty()) {
                log.warn("Problem [{}] khong co test case - auto ACCEPTED", problem.getProblemId());
                applyResult(submission, buildEmptyResult());
                evictCodingLeaderboard(problem);
                return;
            }

            JudgeRequest judgeRequest = JudgeRequest.builder()
                    .language(language)
                    .sourceCode(sourceCode)
                    .timeLimitMs(problem.getTimeLimitMs())
                    .memoryLimitMb(problem.getMemoryLimitMb())
                    .testCases(testCases.stream()
                            .map(testCase -> JudgeRequest.TestCaseInput.builder()
                                    .testCaseId(testCase.getTestId())
                                    .input(testCase.getInput())
                                    .expectedOutput(testCase.getExpectedOutput())
                                    .scoreWeight(testCase.getScoreWeight())
                                    .hidden(testCase.getHidden())
                                    .build())
                            .toList())
                    .build();

            JudgeResult judgeResult = judgeEngine.judge(judgeRequest);
            applyResult(submission, judgeResult);
            evictCodingLeaderboard(problem);

            if (judgeResult.getOverallStatus() == SubmissionStatus.ACCEPTED) {
                problemService.incrementTotalAccept(problem.getProblemId());
            }

            log.info("Cham xong [{}] engine=[{}] status=[{}] score=[{}]",
                    submissionId, judgeEngine.engineName(),
                    judgeResult.getOverallStatus(), judgeResult.getTotalScore());
        } catch (JudgeEngineException e) {
            log.error("Engine [{}] loi [{}] khi cham [{}]: {}",
                    judgeEngine.engineName(), e.getErrorType(), submissionId, e.getMessage());

            finalizeWithError(submission, "INTERNAL_ERROR");
            evictCodingLeaderboard(problem);
        } catch (Exception e) {
            log.error("Loi khong xac dinh khi cham [{}]: {}", submissionId, e.getMessage(), e);
            finalizeWithError(submission, "INTERNAL_ERROR");
            evictCodingLeaderboard(problem);
        }
    }

    private void applyResult(Submission submission, JudgeResult result) {
        submission.setStatus(result.getOverallStatus().name());
        submission.setScore(result.getTotalScore());
        submission.setExecTimeMs(result.getMaxExecTimeMs());
        submission.setMemoryUsedKb(result.getMaxMemoryKb());
        submission.setCompileError(result.getCompileError());
        submission.setJudgeAt(Instant.now());

        if (result.getTestCaseResults() != null) {
            submission.setTestCaseResults(
                    result.getTestCaseResults().stream()
                            .map(tc -> Submission.TestCaseResult.builder()
                                    .testId(tc.getTestCaseId())
                                    .status(tc.getStatus().name())
                                    .timeMs(tc.getTimeMs())
                                    .memoryKb(tc.getMemoryKb())
                                    .hidden(tc.isHidden())
                                    .outputSnippet(tc.getOutputSnippet())
                                    .build())
                            .toList()
            );
        }

        submissionRepository.save(submission);
    }

    private void evictCodingLeaderboard(Problem problem) {
        if (problem == null || problem.getCourseId() == null) {
            return;
        }

        Cache cache = cacheManager.getCache(CacheNames.ASSIGNMENT_LEADERBOARD_CODING);
        if (cache != null) {
            cache.evict(problem.getCourseId());
        }
    }

    private void finalizeWithError(Submission submission, String status) {
        submission.setStatus(status);
        submission.setScore(0);
        submission.setJudgeAt(Instant.now());
        submissionRepository.save(submission);
    }

    private JudgeResult buildEmptyResult() {
        return JudgeResult.builder()
                .overallStatus(SubmissionStatus.ACCEPTED)
                .totalScore(100)
                .testCaseResults(List.of())
                .build();
    }
}
