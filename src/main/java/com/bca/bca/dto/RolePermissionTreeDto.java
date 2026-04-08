package com.bca.bca.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolePermissionTreeDto {
    private Long id;
    private Long roleId;
    private Long menuId;
    private String menuCode;
    private String menuName;
    private String systemCode;
    @Builder.Default
    private Boolean isVisible = false;
    @Builder.Default
    private Boolean canRead = false;
    @Builder.Default
    private Boolean canCreate = false;
    @Builder.Default
    private Boolean canEdit = false;
    @Builder.Default
    private Boolean canDelete = false;
    @Builder.Default
    private Boolean canPrint = false;
    @Builder.Default
    private Boolean canApprove = false;
    @Builder.Default
    private Boolean canVerify = false;
    
    // For Tree Hierarchy
    private Long parentId;
    @Builder.Default
    private List<RolePermissionTreeDto> children = new ArrayList<>();
    
    @Builder.Default
    private Integer rowState = 0; // 0 = Normal, 1 = Add, 2 = Edit, 3 = Delete
    
    private Integer rowVersion;
}
