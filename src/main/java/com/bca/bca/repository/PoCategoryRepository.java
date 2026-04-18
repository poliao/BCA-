package com.bca.bca.repository;

import com.bca.bca.entity.PoCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PoCategoryRepository extends JpaRepository<PoCategory, Long> {
    Optional<PoCategory> findByCategoryCode(String categoryCode);
}
