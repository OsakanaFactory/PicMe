package com.picme.backend.repository;

import com.picme.backend.model.User;
import com.picme.backend.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByTokenAndUsedFalse(String token);

    void deleteAllByUser(User user);
}
