package com.bca.bca.service;

import com.bca.bca.entity.Menu;
import com.bca.bca.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    @Transactional(readOnly = true)
    public List<Menu> findAll() {
        return menuRepository.findAllByOrderBySequenceAsc();
    }

    @Transactional(readOnly = true)
    public Menu findById(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu not found"));
    }

    @Transactional
    public Menu save(Menu menu) {
        return menuRepository.save(menu);
    }

    @Transactional
    public void deleteById(Long id) {
        menuRepository.deleteById(id);
    }
}
