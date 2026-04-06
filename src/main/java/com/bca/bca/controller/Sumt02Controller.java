package com.bca.bca.controller;

import com.bca.bca.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/su/sumt02")
@RequiredArgsConstructor
public class Sumt02Controller {

    private final RoleService roleService;

    @GetMapping("/master")
    public Map<String, Object> getMaster() {
        Map<String, Object> master = new HashMap<>();
        master.put("roles", roleService.findAll());
        return master;
    }
}
