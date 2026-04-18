package com.bca.bca.repository;

import com.bca.bca.entity.QtQuotation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QtQuotationRepository extends JpaRepository<QtQuotation, Long> {

    @Query("SELECT q FROM QtQuotation q " +
           "WHERE (:keyword IS NULL OR q.quotationNo LIKE %:keyword% OR q.customerName LIKE %:keyword%)")
    Page<QtQuotation> search(@Param("keyword") String keyword, Pageable pageable);

    boolean existsByQuotationNo(String quotationNo);
}
