package com.bca.bca.service;

import com.bca.bca.entity.RolePermission;
import com.bca.bca.repository.RolePermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RolePermissionService {

    private final RolePermissionRepository rolePermissionRepository;

    @Transactional(readOnly = true)
    public List<RolePermission> findAll() {
        return rolePermissionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public RolePermission findById(Long id) {
        return rolePermissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RolePermission not found"));
    }

    @Transactional
    public RolePermission save(RolePermission rolePermission) {
        return rolePermissionRepository.save(rolePermission);
    }

    @Transactional
    public void deleteById(Long id) {
        rolePermissionRepository.deleteById(id);
    }
}
