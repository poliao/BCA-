package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "qt_quotation_designs")
@Data
@EqualsAndHashCode(callSuper = true)
public class QtQuotationDesign extends QtQuotationItemBase {

    @Column(name = "design_complexity", length = 50)
    private String designComplexity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_id")
    @JsonIgnore
    private QtQuotation quotation;
}
