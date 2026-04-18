package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "qt_quotation_gluing")
@Data
@EqualsAndHashCode(callSuper = true)
public class QtQuotationGlue extends QtQuotationItemBase {

    @Column(name = "glue_type", length = 100)
    private String glueType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_id")
    @JsonIgnore
    private QtQuotation quotation;
}
