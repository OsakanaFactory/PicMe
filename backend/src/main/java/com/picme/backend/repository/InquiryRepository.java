package com.picme.backend.repository;

import com.picme.backend.model.Inquiry;
import com.picme.backend.model.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * 問い合わせリポジトリ
 */
@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    Page<Inquiry> findByStatus(InquiryStatus status, Pageable pageable);

    Page<Inquiry> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(InquiryStatus status);

    @Query("SELECT COUNT(i) FROM Inquiry i WHERE i.status = 'PENDING'")
    long countPending();
}
