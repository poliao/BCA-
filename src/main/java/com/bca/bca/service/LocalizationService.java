package com.bca.bca.service;

import com.bca.bca.entity.Localization;
import com.bca.bca.repository.LocalizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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
}
