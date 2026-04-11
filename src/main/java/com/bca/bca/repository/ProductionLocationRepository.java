package com.bca.bca.repository;

import com.bca.bca.entity.ProductionLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionLocationRepository extends JpaRepository<ProductionLocation, Long> {
}
