package com.bca.bca.service;

import com.bca.bca.entity.PoCategory;
import com.bca.bca.repository.PoCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PoCategoryService {

    private final PoCategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<PoCategory> findAll() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<PoCategory> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public PoCategory findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Transactional(readOnly = true)
    public PoCategory findByCode(String code) {
        return categoryRepository.findByCategoryCode(code)
                .orElse(null);
    }

    @Transactional
    public PoCategory save(PoCategory category) {
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }
}
