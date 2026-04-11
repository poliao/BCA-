package com.bca.bca.repository;

import com.bca.bca.entity.ProcessPricingTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessPricingTierRepository extends JpaRepository<ProcessPricingTier, Long> {
}
