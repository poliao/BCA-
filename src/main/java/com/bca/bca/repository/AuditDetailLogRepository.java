package com.bca.bca.repository;

import com.bca.bca.entity.AuditDetailLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditDetailLogRepository extends JpaRepository<AuditDetailLog, Long> {
}
