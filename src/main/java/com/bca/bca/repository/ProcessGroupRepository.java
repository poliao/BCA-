package com.bca.bca.repository;

import com.bca.bca.entity.ProcessGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessGroupRepository extends JpaRepository<ProcessGroup, Long> {
}
