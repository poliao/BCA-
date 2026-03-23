package com.bca.bca.controller;

import com.bca.bca.entity.Language;
import com.bca.bca.service.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/languages")
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping
    public List<Language> getAllLanguages() {
        return languageService.getAllLanguages();
    }
}
