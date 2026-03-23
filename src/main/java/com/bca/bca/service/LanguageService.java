package com.bca.bca.service;

import com.bca.bca.entity.Language;
import com.bca.bca.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private final LanguageRepository languageRepository;

    public List<Language> getAllLanguages() {
        return languageRepository.findByIsActiveTrue();
    }
}
