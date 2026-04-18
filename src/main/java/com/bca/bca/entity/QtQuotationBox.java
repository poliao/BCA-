package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "qt_quotation_boxes")
@Data
@EqualsAndHashCode(callSuper = true, exclude = { "quotation", "parts" })
@ToString(exclude = { "quotation", "parts" })
public class QtQuotationBox extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "box_id")
    private Long id;

    @Column(name = "box_name", length = 255)
    private String boxName;

    // Use Postgres array or simple JSON for storing multiple quantities. For ease, string mapping.
    @Column(name = "order_quantities", length = 255)
    private String orderQuantities; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_id")
    @JsonIgnore
    private QtQuotation quotation;

    @OneToMany(mappedBy = "box", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<QtQuotationPart> parts = new ArrayList<>();
}
