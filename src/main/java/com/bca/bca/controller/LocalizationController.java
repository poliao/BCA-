package com.bca.bca.controller;

import com.bca.bca.dto.PageResponse;
import com.bca.bca.entity.Localization;
import com.bca.bca.service.LocalizationService;
import com.bca.bca.util.QueryUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/localizations")
@RequiredArgsConstructor
public class LocalizationController {

    private final LocalizationService localizationService;

    @GetMapping("/{lang}")
    public PageResponse<Localization> getAllLocalizations(
            @PathVariable String lang,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort) {
        Page<Localization> localizationPage = localizationService.findAllByLanguageCode(lang, QueryUtil.createPageable(page, size, sort));
        return new PageResponse<>(localizationPage.getContent(), localizationPage.getTotalElements());
    }

    @PostMapping("/{lang}")
    public List<Localization> saveLocalizations(@PathVariable String lang, @RequestBody List<Localization> localizations) {
        return localizationService.saveLocalizations(lang, localizations);
    }
}
