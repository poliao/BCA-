package com.bca.bca.controller.pomt02;

import com.bca.bca.dto.PageResponse;
import com.bca.bca.entity.PoItem;
import com.bca.bca.service.PoCategoryService;
import com.bca.bca.service.PoItemService;
import com.bca.bca.util.QueryUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/po/pomt02")
@RequiredArgsConstructor
public class Pomt02Controller {

    private final PoItemService itemService;
    private final PoCategoryService categoryService;

    @GetMapping
    public PageResponse<PoItem> getItems(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort) {
        Page<PoItem> itemPage = itemService.findAll(QueryUtil.createPageable(page, size, sort));
        return new PageResponse<>(itemPage.getContent(), itemPage.getTotalElements());
    }

    @GetMapping("/detail")
    public PoItem getItem(@RequestParam Long id) {
        return itemService.findById(id);
    }

    @PostMapping
    public PoItem saveItem(@RequestBody PoItem item) {
        return itemService.save(item);
    }

    @DeleteMapping
    public void deleteItem(@RequestParam Long id) {
        itemService.deleteById(id);
    }

    @GetMapping("/master")
    public Map<String, Object> getMaster() {
        Map<String, Object> master = new HashMap<>();
        master.put("categories", categoryService.findAll());
        return master;
    }
}
