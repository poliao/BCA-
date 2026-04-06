package com.bca.bca.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuPermissionDto {
    private String menuCode;
    private String menuNameEn;
    private String menuNameTh;
    private String url;
    private String icon;
    private boolean isVisible;
    private PermissionDto permissions;
}
