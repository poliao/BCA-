package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "qt_quotation_coatings")
@Data
@EqualsAndHashCode(callSuper = true)
public class QtQuotationCoating extends QtQuotationItemBase {

    @Column(name = "coating_type", length = 100)
    private String coatingType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_id")
    @JsonIgnore
    private QtQuotation quotation;
}
