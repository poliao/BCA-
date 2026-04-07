package com.bca.bca.controller;

import com.bca.bca.dto.PageResponse;
import com.bca.bca.dto.RolePermissionTreeDto;
import com.bca.bca.entity.RolePermission;
import com.bca.bca.service.RolePermissionService;
import com.bca.bca.util.QueryUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    public PageResponse<RolePermission> findAll(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort) {
        Page<RolePermission> permissionPage = rolePermissionService.findAll(QueryUtil.createPageable(page, size, sort));
        return new PageResponse<>(permissionPage.getContent(), permissionPage.getTotalElements());
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
