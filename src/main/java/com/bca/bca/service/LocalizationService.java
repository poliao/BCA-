package com.bca.bca.service;

import com.bca.bca.entity.Localization;
import com.bca.bca.repository.LocalizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocalizationService {

    private final LocalizationRepository localizationRepository;

    public Map<String, String> getTranslations(String module, String lang) {
        List<Localization> localizations = localizationRepository.findByModuleNameAndLanguageCode(module, lang);
        return localizations.stream()
                .collect(Collectors.toMap(Localization::getKey, Localization::getValue, (v1, v2) -> v1));
    }

    public List<Localization> getAllLocalizations(String lang) {
        return localizationRepository.findByLanguageCode(lang);
    }

    @Transactional(readOnly = true)
    public Page<Localization> findAllByLanguageCode(String lang, Pageable pageable) {
        return localizationRepository.findByLanguageCode(lang, pageable);
    }

    @Transactional
    public List<Localization> saveLocalizations(String lang, List<Localization> localizations) {
        for (Localization l : localizations) {
            if (l.getRowState() == null)
                continue;

            if (l.getRowState() == 1) { // Add
                l.setId(null);
                l.setLanguageCode(lang);
                localizationRepository.save(l);
            } else if (l.getRowState() == 2) { // Edit
                l.setLanguageCode(lang);
                localizationRepository.save(l);
            } else if (l.getRowState() == 3) { // Delete
                if (l.getId() != null) {
                    localizationRepository.deleteById(l.getId());
                }
            }
        }
        return localizationRepository.findByLanguageCode(lang);
    }
}
