package com.bca.bca.controller;

import com.bca.bca.dto.AuditLogRequest;
import com.bca.bca.dto.PageResponse;
import com.bca.bca.entity.AuditDetailLog;
import com.bca.bca.service.AuditDetailLogService;
import com.bca.bca.util.QueryUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
public class AuditDetailLogController {

    private final AuditDetailLogService auditDetailLogService;

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
    public PageResponse<AuditDetailLog> getAllLogs(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort) {
        Page<AuditDetailLog> logPage = auditDetailLogService.findAll(QueryUtil.createPageable(page, size, sort));
        return new PageResponse<>(logPage.getContent(), logPage.getTotalElements());
    }
}
