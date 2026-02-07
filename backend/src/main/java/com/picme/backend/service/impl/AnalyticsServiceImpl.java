package com.picme.backend.service.impl;

import com.picme.backend.exception.ApiException;
import com.picme.backend.model.PageView;
import com.picme.backend.model.PlanType;
import com.picme.backend.model.User;
import com.picme.backend.repository.PageViewRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {

    private final PageViewRepository pageViewRepository;
    private final UserRepository userRepository;

    @Override
    @Async
    @Transactional
    public void recordPageView(User user, String visitorIp, String referrer, String userAgent) {
        PageView pageView = PageView.builder()
                .user(user)
                .visitorIp(visitorIp)
                .referrer(referrer)
                .userAgent(userAgent)
                .build();
        pageViewRepository.save(pageView);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        checkAnalyticsPlanAccess(user);

        long totalViews = pageViewRepository.countByUserId(user.getId());
        long todayViews = pageViewRepository.countByUserIdAndViewedAtAfter(
                user.getId(), LocalDate.now().atStartOfDay());
        long weekViews = pageViewRepository.countByUserIdAndViewedAtAfter(
                user.getId(), LocalDateTime.now().minusDays(7));
        long monthViews = pageViewRepository.countByUserIdAndViewedAtAfter(
                user.getId(), LocalDateTime.now().minusDays(30));

        List<Object[]> topReferrers = pageViewRepository.getTopReferrers(user.getId());
        List<Map<String, Object>> referrers = new ArrayList<>();
        for (int i = 0; i < Math.min(topReferrers.size(), 10); i++) {
            Object[] row = topReferrers.get(i);
            referrers.add(Map.of("referrer", row[0], "count", row[1]));
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalViews", totalViews);
        summary.put("todayViews", todayViews);
        summary.put("weekViews", weekViews);
        summary.put("monthViews", monthViews);
        summary.put("topReferrers", referrers);

        return summary;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTimeline(String email, int days) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        checkAnalyticsPlanAccess(user);

        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<Object[]> rawData = pageViewRepository.getDailyViewCounts(user.getId(), since);

        // 日付マップに変換
        Map<LocalDate, Long> dataMap = new LinkedHashMap<>();
        for (Object[] row : rawData) {
            LocalDate date;
            if (row[0] instanceof java.sql.Date) {
                date = ((java.sql.Date) row[0]).toLocalDate();
            } else {
                date = (LocalDate) row[0];
            }
            dataMap.put(date, (Long) row[1]);
        }

        // 欠損日を0で埋める
        List<Map<String, Object>> timeline = new ArrayList<>();
        LocalDate current = LocalDate.now().minusDays(days - 1);
        LocalDate end = LocalDate.now();
        while (!current.isAfter(end)) {
            long count = dataMap.getOrDefault(current, 0L);
            timeline.add(Map.of("date", current.toString(), "views", count));
            current = current.plusDays(1);
        }

        return timeline;
    }

    private void checkAnalyticsPlanAccess(User user) {
        PlanType plan = user.getPlanType();
        if (plan != PlanType.PRO && plan != PlanType.STUDIO) {
            throw ApiException.forbidden("アクセス解析はPRO以上のプランで利用できます");
        }
    }
}
