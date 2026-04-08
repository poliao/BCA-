package com.bca.bca.controller;

import com.bca.bca.dto.PageResponse;
import com.bca.bca.entity.Menu;
import com.bca.bca.service.MenuService;
import com.bca.bca.util.QueryUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/authorized")
    public List<Menu> getAuthorizedMenus() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        
        List<String> roleCodes = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.replace("ROLE_", "")) // Remove the ROLE_ prefix we added in the filter
                .collect(Collectors.toList());
        
        return menuService.findAuthorizedMenus(roleCodes);
    }

    @GetMapping
    public PageResponse<Menu> findAll(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort) {
        Page<Menu> menuPage = menuService.findAll(QueryUtil.createPageable(page, size, sort));
        return new PageResponse<>(menuPage.getContent(), menuPage.getTotalElements());
    }

    @GetMapping("/all")
    public List<Menu> getAllMenus() {
        return menuService.findAll();
    }

    @GetMapping("/{id:[0-9]+}")
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
