package com.bca.bca.service;

import com.bca.bca.entity.QtQuotation;
import com.bca.bca.repository.QtQuotationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QtQuotationService {

    private final QtQuotationRepository quotationRepository;

    @Transactional(readOnly = true)
    public Page<QtQuotation> search(String keyword, Pageable pageable) {
        return quotationRepository.search(keyword, pageable);
    }

    @Transactional(readOnly = true)
    public QtQuotation findById(Long id) {
        return quotationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));
    }

    @Transactional
    public QtQuotation save(QtQuotation quotation) {
        if (quotation.getBoxes() != null) {
            quotation.getBoxes().forEach(box -> {
                box.setQuotation(quotation);
                if (box.getParts() != null) {
                    box.getParts().forEach(part -> {
                        part.setBox(box);

                        // Wire coating entries and their items
                        if (part.getCoatings() != null) {
                            part.getCoatings().forEach(entry -> {
                                entry.setPart(part);
                                if (entry.getItems() != null) {
                                    entry.getItems().forEach(item -> item.setBatch(entry));
                                }
                            });
                        }

                        // Wire stamp entries and their items
                        if (part.getStampEntries() != null) {
                            part.getStampEntries().forEach(entry -> {
                                entry.setPart(part);
                                if (entry.getItems() != null) {
                                    entry.getItems().forEach(item -> item.setEntry(entry));
                                }
                            });
                        }

                        // Wire gluing entries
                        if (part.getGluings() != null) {
                            part.getGluings().forEach(gluing -> gluing.setPart(part));
                        }
                    });
                }
            });
        }

        return quotationRepository.save(quotation);
    }

    @Transactional
    public void deleteById(Long id) {
        quotationRepository.deleteById(id);
    }

    public boolean existsByQuotationNo(String quotationNo) {
        return quotationRepository.existsByQuotationNo(quotationNo);
    }
}
