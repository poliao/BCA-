package com.bca.bca.repository;

import com.bca.bca.entity.Localization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LocalizationRepository extends JpaRepository<Localization, Long> {
    List<Localization> findByModuleNameAndLanguageCode(String moduleName, String languageCode);

    List<Localization> findByLanguageCode(String languageCode);

    Page<Localization> findByLanguageCode(String languageCode, Pageable pageable);

    @Modifying
    @Query("DELETE FROM Localization l WHERE l.languageCode = :languageCode")
    void deleteByLanguageCode(String languageCode);
}
