package com.bca.bca.controller;

import com.bca.bca.dto.MenuPermissionDto;
import com.bca.bca.dto.PermissionDto;
import com.bca.bca.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    public List<MenuPermissionDto> getMyPermissions(@RequestParam Long userId) {
        // In a real app with Spring Security, userId would come from the authentication context
        return permissionService.getPermissionsForUser(userId);
    }

    @GetMapping("/actions")
    public PermissionDto getMyActions(@RequestParam String menuCode) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return permissionService.getActionsForUser(username, menuCode);
    }
}
