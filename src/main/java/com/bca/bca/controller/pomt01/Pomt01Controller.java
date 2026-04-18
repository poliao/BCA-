package com.bca.bca.controller.pomt01;

import com.bca.bca.dto.PageResponse;
import com.bca.bca.entity.PoCategory;
import com.bca.bca.service.PoCategoryService;
import com.bca.bca.util.QueryUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/po/pomt01")
@RequiredArgsConstructor
public class Pomt01Controller {

    private final PoCategoryService categoryService;

    // Categories
    @GetMapping
    public PageResponse<PoCategory> getCategories(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort) {
        Page<PoCategory> categoryPage = categoryService.findAll(QueryUtil.createPageable(page, size, sort));
        return new PageResponse<>(categoryPage.getContent(), categoryPage.getTotalElements());
    }

    @GetMapping("/categories/all")
    public List<PoCategory> getAllCategories() {
        return categoryService.findAll();
    }

    @GetMapping("/detail")
    public PoCategory getCategory(@RequestParam Long id) {
        return categoryService.findById(id);
    }

    @PostMapping
    public PoCategory saveCategory(@RequestBody PoCategory category) {
        return categoryService.save(category);
    }

    @DeleteMapping
    public void deleteCategory(@RequestParam Long id) {
        categoryService.deleteById(id);
    }

    @GetMapping("/master")
    public Map<String, Object> getMaster() {
        Map<String, Object> master = new HashMap<>();
        master.put("categories", categoryService.findAll());
        return master;
    }
}
