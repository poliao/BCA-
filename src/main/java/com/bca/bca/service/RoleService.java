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
        if (role.getPermissions() != null) {
            // Handle rowState for permissions
            List<RolePermission> toDelete = role.getPermissions().stream()
                    .filter(p -> Integer.valueOf(3).equals(p.getRowState())) // 3 = Delete
                    .collect(Collectors.toList());
            
            role.getPermissions().removeAll(toDelete);

            role.getPermissions().forEach(permission -> {
                permission.setRole(role);
                if (permission.getMenu() == null && permission.getMenuId() != null) {
                    permission.setMenu(menuRepository.getReferenceById(permission.getMenuId()));
                }
            });
        }
        return roleRepository.save(role);
    }

    @Transactional
    public void deleteById(Long id) {
        roleRepository.deleteById(id);
    }
}
