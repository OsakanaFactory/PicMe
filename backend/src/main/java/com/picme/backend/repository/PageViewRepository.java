package com.picme.backend.repository;

import com.picme.backend.model.PageView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PageViewRepository extends JpaRepository<PageView, Long> {

    long countByUserId(Long userId);

    long countByUserIdAndViewedAtAfter(Long userId, LocalDateTime after);

    @Query("SELECT DATE(pv.viewedAt) as date, COUNT(pv) as count FROM PageView pv " +
           "WHERE pv.user.id = :userId AND pv.viewedAt >= :since " +
           "GROUP BY DATE(pv.viewedAt) ORDER BY DATE(pv.viewedAt)")
    List<Object[]> getDailyViewCounts(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    @Query("SELECT pv.referrer, COUNT(pv) as count FROM PageView pv " +
           "WHERE pv.user.id = :userId AND pv.referrer IS NOT NULL AND pv.referrer != '' " +
           "GROUP BY pv.referrer ORDER BY count DESC")
    List<Object[]> getTopReferrers(@Param("userId") Long userId);
}
