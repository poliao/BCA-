package com.bca.bca.repository;

import com.bca.bca.entity.PoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PoItemRepository extends JpaRepository<PoItem, Long> {
}
