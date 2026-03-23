package com.bca.bca.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PermissionDto {
    private boolean canRead;
    private boolean canCreate;
    private boolean canEdit;
    private boolean canDelete;
    private boolean canCancel;
    private boolean canApprove;
    private boolean canVerify;
}
