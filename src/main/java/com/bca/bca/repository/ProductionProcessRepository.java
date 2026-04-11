package com.bca.bca.repository;

import com.bca.bca.entity.ProductionProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionProcessRepository extends JpaRepository<ProductionProcess, Long> {
}
