package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "qt_quotation_printings")
@Data
@EqualsAndHashCode(callSuper = true)
public class QtQuotationPrint extends QtQuotationItemBase {

    @Column(name = "color_count", length = 50)
    private String colorCount;

    @Column(name = "sides", length = 50)
    private String sides;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_id")
    @JsonIgnore
    private QtQuotation quotation;
}
