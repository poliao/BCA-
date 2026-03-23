package com.bca.bca.service;

import com.bca.bca.dto.MenuPermissionDto;
import com.bca.bca.dto.PermissionDto;
import com.bca.bca.entity.Role;
import com.bca.bca.entity.RolePermission;
import com.bca.bca.entity.User;
import com.bca.bca.repository.UserRepository;
import com.bca.bca.repository.RolePermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final UserRepository userRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Transactional(readOnly = true)
    public List<MenuPermissionDto> getPermissionsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Map to store merged permissions by Menu Code
        Map<String, MenuPermissionDto> mergedPermissions = new HashMap<>();

        for (Role role : user.getRoles()) {
            List<RolePermission> rolePermissions = rolePermissionRepository.findByRole(role);
            
            for (RolePermission rp : rolePermissions) {
                String menuCode = rp.getMenu().getMenuCode();
                
                if (!mergedPermissions.containsKey(menuCode)) {
                    // First time seeing this menu for this user
                    mergedPermissions.put(menuCode, mapToDto(rp));
                } else {
                    // Merge with existing permissions (OR logic)
                    mergePermissions(mergedPermissions.get(menuCode), rp);
                }
            }
        }

        return mergedPermissions.values().stream()
                .sorted(Comparator.comparing(dto -> dto.getMenuCode())) // Or use sequence if available
                .collect(Collectors.toList());
    }

    private MenuPermissionDto mapToDto(RolePermission rp) {
        return MenuPermissionDto.builder()
                .menuCode(rp.getMenu().getMenuCode())
                .menuName(rp.getMenu().getMenuName())
                .url(rp.getMenu().getUrl())
                .icon(rp.getMenu().getIcon())
                .isVisible(rp.getIsVisible())
                .permissions(PermissionDto.builder()
                        .canRead(rp.getCanRead())
                        .canCreate(rp.getCanCreate())
                        .canEdit(rp.getCanEdit())
                        .canDelete(rp.getCanDelete())
                        .canCancel(rp.getCanCancel())
                        .canApprove(rp.getCanApprove())
                        .canVerify(rp.getCanVerify())
                        .build())
                .build();
    }

    private void mergePermissions(MenuPermissionDto existing, RolePermission rp) {
        existing.setVisible(existing.isVisible() || rp.getIsVisible());
        
        PermissionDto p = existing.getPermissions();
        p.setCanRead(p.isCanRead() || rp.getCanRead());
        p.setCanCreate(p.isCanCreate() || rp.getCanCreate());
        p.setCanEdit(p.isCanEdit() || rp.getCanEdit());
        p.setCanDelete(p.isCanDelete() || rp.getCanDelete());
        p.setCanCancel(p.isCanCancel() || rp.getCanCancel());
        p.setCanApprove(p.isCanApprove() || rp.getCanApprove());
        p.setCanVerify(p.isCanVerify() || rp.getCanVerify());
    }
}
