package com.bca.bca.service;

import com.bca.bca.entity.Language;
import com.bca.bca.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private final LanguageRepository languageRepository;

    public List<Language> getAllLanguages() {
        return languageRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public Page<Language> findAll(Pageable pageable) {
        return languageRepository.findAll(pageable);
    }

    public Language save(Language language) {
        return languageRepository.save(language);
    }

    public void delete(Long id) {
        languageRepository.deleteById(id);
    }
}
