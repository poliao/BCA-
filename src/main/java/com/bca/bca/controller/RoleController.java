package com.bca.bca.controller;

import com.bca.bca.entity.Role;
import com.bca.bca.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public List<Role> findAll() {
        return roleService.findAll();
    }

    @GetMapping("/{id}")
    public Role findById(@PathVariable Long id) {
        return roleService.findById(id);
    }

    @PostMapping
    public Role save(@RequestBody Role role) {
        return roleService.save(role);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        roleService.deleteById(id);
    }
}
