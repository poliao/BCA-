package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "qt_quotation_coating_items")
@Data
@EqualsAndHashCode(callSuper = false)
public class QtQuotationCoatingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "coating_process_id")
    private Long coatingProcessId;

    @Column(name = "coating_note", length = 500)
    private String coatingNote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    @JsonIgnore
    private QtQuotationCoatingEntry batch;
}
