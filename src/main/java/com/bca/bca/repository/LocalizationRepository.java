package com.bca.bca.repository;

import com.bca.bca.entity.Localization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LocalizationRepository extends JpaRepository<Localization, Long> {
    List<Localization> findByModuleNameAndLanguageCode(String moduleName, String languageCode);
}
