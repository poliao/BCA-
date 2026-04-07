package com.bca.bca.service;

import com.bca.bca.entity.AuditDetailLog;
import com.bca.bca.repository.AuditDetailLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditDetailLogService {

    private final AuditDetailLogRepository auditDetailLogRepository;

    @Transactional
    public void saveLog(String menuCode, String action, String userId, Long headId) {
        AuditDetailLog log = new AuditDetailLog();
        log.setMenuCode(menuCode);
        log.setLogTimestamp(LocalDateTime.now());
        log.setAction(action);
        log.setUserId(userId);
        log.setHeadId(headId);
        
        auditDetailLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public Page<AuditDetailLog> findAll(Pageable pageable) {
        return auditDetailLogRepository.findAll(pageable);
    }
}
