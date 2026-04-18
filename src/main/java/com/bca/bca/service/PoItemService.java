package com.bca.bca.service;

import com.bca.bca.entity.PoItem;
import com.bca.bca.repository.PoItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PoItemService {

    private final PoItemRepository itemRepository;

    public Page<PoItem> findAll(Pageable pageable) {
        return itemRepository.findAll(pageable);
    }

    public List<PoItem> findAll() {
        return itemRepository.findAll();
    }

    public PoItem findById(Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    public PoItem save(PoItem item) {
        return itemRepository.save(item);
    }

    public void deleteById(Long id) {
        itemRepository.deleteById(id);
    }
}
