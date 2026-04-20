package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "qt_quotation_coatings")
@Data
@EqualsAndHashCode(callSuper = false, exclude = { "items" })
@ToString(exclude = { "items" })
public class QtQuotationCoatingEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Cut before coating details
    @Column(name = "is_cut_before_coating")
    private Boolean isCutBeforeCoating = false;

    @Column(name = "coating_cut_pieces")
    private Integer coatingCutPieces;

    @Column(name = "coating_cut_width", precision = 10, scale = 2)
    private BigDecimal coatingCutWidth;

    @Column(name = "coating_cut_length", precision = 10, scale = 2)
    private BigDecimal coatingCutLength;

    // One cut batch can have multiple coating processes
    @OneToMany(mappedBy = "batch", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<QtQuotationCoatingItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id")
    @JsonIgnore
    private QtQuotationPart part;
}
