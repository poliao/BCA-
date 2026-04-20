package com.bca.bca.controller;

import com.bca.bca.dto.PageResponse;
import com.bca.bca.entity.QtQuotation;
import com.bca.bca.service.QtQuotationService;
import com.bca.bca.service.RdProxyService;
import com.bca.bca.service.ProductionProcessService;
import com.bca.bca.service.PoItemService;
import com.bca.bca.util.QueryUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/qt/qtmt01")
@RequiredArgsConstructor
public class QtQuotationController {

    private final QtQuotationService quotationService;
    private final RdProxyService rdProxyService;
    private final ProductionProcessService productionProcessService;
    private final PoItemService poItemService;

    @GetMapping("/master")
    public Map<String, Object> getMaster() {
        return Map.of(
            "processes", productionProcessService.findAll(Pageable.unpaged()).getContent(),
            "groups", productionProcessService.findAllGroups(),
            "papers", poItemService.findAll()
        );
    }

    @GetMapping
    public PageResponse<QtQuotation> findAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort) {

        Page<QtQuotation> resultPage = quotationService.search(
                keyword,
                QueryUtil.createPageable(page, size, sort));

        return new PageResponse<>(resultPage.getContent(), resultPage.getTotalElements());
    }

    @GetMapping("/{id}")
    public QtQuotation findById(@PathVariable Long id) {
        return quotationService.findById(id);
    }

    @PostMapping
    public QtQuotation save(@RequestBody QtQuotation quotation) {
        return quotationService.save(quotation);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        quotationService.deleteById(id);
    }

    @GetMapping("/check-duplicate")
    public Map<String, Boolean> checkDuplicate(@RequestParam String quotationNo) {
        return Map.of("exists", quotationService.existsByQuotationNo(quotationNo));
    }

    @GetMapping("/rd-contact")
    public Object searchRdContact(@RequestParam String keyword) {
        return rdProxyService.searchRdContact(keyword);
    }
}
