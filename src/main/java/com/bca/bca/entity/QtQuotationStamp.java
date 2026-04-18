package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "qt_quotation_stamps")
@Data
@EqualsAndHashCode(callSuper = true)
public class QtQuotationStamp extends QtQuotationItemBase {

    @Column(name = "stamp_type", length = 100)
    private String stampType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id")
    @JsonIgnore
    private QtQuotationPart part;
}
