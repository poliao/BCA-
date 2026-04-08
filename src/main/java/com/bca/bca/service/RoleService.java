package com.bca.bca.service;

import com.bca.bca.entity.Role;
import com.bca.bca.entity.RolePermission;
import com.bca.bca.repository.MenuRepository;
import com.bca.bca.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final MenuRepository menuRepository;

    @Transactional(readOnly = true)
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Role> findAll(Pageable pageable) {
        return roleRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Role findById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }

    @Transactional
    public Role save(Role role) {
        Role persistentRole;
        if (role.getId() != null) {
            persistentRole = roleRepository.findById(role.getId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            persistentRole.setRoleCode(role.getRoleCode());
            persistentRole.setRoleName(role.getRoleName());
            persistentRole.setDescription(role.getDescription());
            persistentRole.setRowVersion(role.getRowVersion());
        } else {
            persistentRole = role;
        }

        if (role.getPermissions() != null) {
            Map<Long, RolePermission> existingPermMap = persistentRole.getPermissions().stream()
                    .filter(p -> p.getId() != null)
                    .collect(Collectors.toMap(RolePermission::getId, p -> p));

            List<RolePermission> incomingPerms = role.getPermissions();
            List<Long> incomingIds = incomingPerms.stream()
                    .map(RolePermission::getId)
                    .filter(id -> id != null)
                    .collect(Collectors.toList());

            // 1. Remove missing permissions
            persistentRole.getPermissions().removeIf(p -> p.getId() != null && !incomingIds.contains(p.getId()));

            // 2. Update existing or Add new
            for (RolePermission incoming : incomingPerms) {
                if (incoming.getId() == null) {
                    incoming.setRole(persistentRole);
                    if (incoming.getMenuId() != null) {
                        incoming.setMenu(menuRepository.getReferenceById(incoming.getMenuId()));
                    }
                    persistentRole.getPermissions().add(incoming);
                } else if (existingPermMap.containsKey(incoming.getId())) {
                    RolePermission existing = existingPermMap.get(incoming.getId());
                    existing.setIsVisible(incoming.getIsVisible());
                    existing.setCanRead(incoming.getCanRead());
                    existing.setCanCreate(incoming.getCanCreate());
                    existing.setCanEdit(incoming.getCanEdit());
                    existing.setCanDelete(incoming.getCanDelete());
                    existing.setCanCancel(incoming.getCanCancel());
                    existing.setCanApprove(incoming.getCanApprove());
                    existing.setCanVerify(incoming.getCanVerify());
                    existing.setCanPrint(incoming.getCanPrint());
                    existing.setRowVersion(incoming.getRowVersion());
                }
            }
        }
        return roleRepository.save(persistentRole);
    }

    @Transactional
    public void deleteById(Long id) {
        roleRepository.deleteById(id);
    }
}
