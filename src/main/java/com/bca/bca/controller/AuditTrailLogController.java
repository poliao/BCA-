package com.bca.bca.controller;

import com.bca.bca.dto.AuditLogRequest;
import com.bca.bca.service.AuditDetailLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/AuditTrailLog")
@RequiredArgsConstructor
public class AuditTrailLogController {

    private final AuditDetailLogService auditDetailLogService;

    @PostMapping
    public void saveLog(@RequestBody AuditLogRequest request) {
        // Map the Dashboard request to the existing service
        auditDetailLogService.saveLog(
                request.getMenuCode(),
                request.getAction(),
                request.getUserId(),
                request.getHeadId()
        );
    }
}
