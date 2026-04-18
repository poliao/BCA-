package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "qt_quotation_papers")
@Data
@EqualsAndHashCode(callSuper = true)
public class QtQuotationPaper extends QtQuotationItemBase {

    @Column(name = "gsm", length = 50)
    private String gsm;

    @Column(name = "paper_size", length = 100)
    private String paperSize;

    @Column(name = "paper_type", length = 100)
    private String paperType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_id")
    @JsonIgnore
    private QtQuotation quotation;
}
