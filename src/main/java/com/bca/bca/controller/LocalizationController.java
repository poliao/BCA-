package com.bca.bca.controller;

import com.bca.bca.entity.Localization;
import com.bca.bca.service.LocalizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/localizations")
@RequiredArgsConstructor
public class LocalizationController {

    private final LocalizationService localizationService;

    @GetMapping("/{lang}")
    public List<Localization> getAllLocalizations(@PathVariable String lang) {
        return localizationService.getAllLocalizations(lang);
    }

    @PostMapping("/{lang}")
    public List<Localization> saveLocalizations(@PathVariable String lang, @RequestBody List<Localization> localizations) {
        return localizationService.saveLocalizations(lang, localizations);
    }
}
