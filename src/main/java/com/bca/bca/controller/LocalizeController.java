package com.bca.bca.controller;

import com.bca.bca.service.LocalizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/localize")
@RequiredArgsConstructor
public class LocalizeController {

    private final LocalizationService localizationService;

    @GetMapping("/{module}/{lang}")
    public Map<String, String> getTranslations(@PathVariable String module, @PathVariable String lang) {
        return localizationService.getTranslations(module, lang);
    }
}
