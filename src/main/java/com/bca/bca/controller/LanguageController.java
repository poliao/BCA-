package com.bca.bca.controller;

import com.bca.bca.entity.Language;
import com.bca.bca.service.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
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

    @PostMapping
    public Language save(@RequestBody Language language) {
        return languageService.save(language);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        languageService.delete(id);
    }
}
