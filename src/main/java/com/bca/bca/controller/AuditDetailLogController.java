package com.bca.bca.controller;

import com.bca.bca.dto.AuditLogRequest;
import com.bca.bca.entity.AuditDetailLog;
import com.bca.bca.repository.AuditDetailLogRepository;
import com.bca.bca.service.AuditDetailLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
public class AuditDetailLogController {

    private final AuditDetailLogService auditDetailLogService;
    private final AuditDetailLogRepository auditDetailLogRepository;

    @PostMapping
    public void saveLog(@RequestBody AuditLogRequest request) {
        auditDetailLogService.saveLog(
                request.getMenuCode(),
                request.getAction(),
                request.getUserId(),
                request.getHeadId()
        );
    }

    @GetMapping
    public List<AuditDetailLog> getAllLogs() {
        return auditDetailLogRepository.findAll();
    }
}
