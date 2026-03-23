package com.bca.bca.controller;

import com.bca.bca.entity.Menu;
import com.bca.bca.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public List<Menu> findAll() {
        return menuService.findAll();
    }

    @GetMapping("/{id}")
    public Menu findById(@PathVariable Long id) {
        return menuService.findById(id);
    }

    @PostMapping
    public Menu save(@RequestBody Menu menu) {
        return menuService.save(menu);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        menuService.deleteById(id);
    }
}
