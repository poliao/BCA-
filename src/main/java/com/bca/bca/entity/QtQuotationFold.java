package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "qt_quotation_folding")
@Data
@EqualsAndHashCode(callSuper = true)
public class QtQuotationFold extends QtQuotationItemBase {

    @Column(name = "fold_type", length = 100)
    private String foldType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_id")
    @JsonIgnore
    private QtQuotation quotation;
}
