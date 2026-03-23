package com.bca.bca.dto;

import lombok.Data;

@Data
public class AuditLogRequest {
    private String menuCode;
    private String action;
    private String userId;
    private Long headId;
}
