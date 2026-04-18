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
        // Link all specialized items to the master quotation
        if (quotation.getPapers() != null) {
            quotation.getPapers().forEach(item -> item.setQuotation(quotation));
        }
        if (quotation.getPrintings() != null) {
            quotation.getPrintings().forEach(item -> item.setQuotation(quotation));
        }
        if (quotation.getCoatings() != null) {
            quotation.getCoatings().forEach(item -> item.setQuotation(quotation));
        }
        if (quotation.getStamps() != null) {
            quotation.getStamps().forEach(item -> item.setQuotation(quotation));
        }
        if (quotation.getGluing() != null) {
            quotation.getGluing().forEach(item -> item.setQuotation(quotation));
        }
        if (quotation.getFolding() != null) {
            quotation.getFolding().forEach(item -> item.setQuotation(quotation));
        }
        if (quotation.getDesigns() != null) {
            quotation.getDesigns().forEach(item -> item.setQuotation(quotation));
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
