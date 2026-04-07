package com.bca.bca.controller;

import com.bca.bca.dto.PageResponse;
import com.bca.bca.entity.Language;
import com.bca.bca.service.LanguageService;
import com.bca.bca.util.QueryUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/languages")
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping
    public PageResponse<Language> getAllLanguages(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort) {
        Page<Language> languagePage = languageService.findAll(QueryUtil.createPageable(page, size, sort));
        return new PageResponse<>(languagePage.getContent(), languagePage.getTotalElements());
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
