package com.bca.bca.controller;

import com.bca.bca.dto.RolePermissionTreeDto;
import com.bca.bca.entity.RolePermission;
import com.bca.bca.service.RolePermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/su/role-permissions")
@RequiredArgsConstructor
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;

    @GetMapping("/tree")
    public List<RolePermissionTreeDto> getPermissionTree(@RequestParam(required = false) Long roleId) {
        return rolePermissionService.getPermissionTree(roleId);
    }

    @GetMapping
    public List<RolePermission> findAll() {
        return rolePermissionService.findAll();
    }

    @GetMapping("/{id}")
    public RolePermission findById(@PathVariable Long id) {
        return rolePermissionService.findById(id);
    }

    @PostMapping
    public RolePermission save(@RequestBody RolePermission rolePermission) {
        return rolePermissionService.save(rolePermission);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        rolePermissionService.deleteById(id);
    }
}
