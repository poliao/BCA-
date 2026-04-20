package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "qt_quotation_parts")
@Data
@EqualsAndHashCode(callSuper = true, exclude = { "box", "stampEntries", "gluings" })
@ToString(exclude = { "box", "stampEntries", "gluings" })
public class QtQuotationPart extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "part_id")
    private Long id;

    @Column(name = "part_name", length = 255)
    private String partName;

    @Column(name = "production_location_id")
    private Long productionLocationId;

    @Column(name = "paper_id")
    private Long paperId;

    @Column(name = "paper_size_id")
    private Long paperSizeId;

    @Column(name = "paper_gram_id")
    private Long paperGramId;

    @Column(name = "is_cut_base_paper")
    private Boolean isCutBasePaper = false;

    @Column(name = "paper_cut_pieces")
    private Integer paperCutPieces;

    @Column(name = "paper_cut_width", precision = 10, scale = 2)
    private BigDecimal paperCutWidth;

    @Column(name = "paper_cut_length", precision = 10, scale = 2)
    private BigDecimal paperCutLength;

    @Column(name = "lay_qty")
    private Integer layQty;

    @Column(name = "lay_horizontal")
    private Integer layHorizontal;

    @Column(name = "lay_vertical")
    private Integer layVertical;

    @Column(name = "print_process_id")
    private Long printProcessId;

    @Column(name = "print_style", length = 50)
    private String printStyle;

    @Column(name = "print_color_front")
    private Integer printColorFront;

    @Column(name = "print_color_back")
    private Integer printColorBack;

    @Column(name = "print_cut_size_front", length = 50)
    private String printCutSizeFront;

    @Column(name = "print_cut_size_back", length = 50)
    private String printCutSizeBack;

    @Column(name = "is_corrugated")
    private Boolean isCorrugated = false;

    @Column(name = "flute_type", length = 50)
    private String fluteType;

    @Column(name = "coating_type", length = 100)
    private String coatingType;

    @OneToMany(mappedBy = "part", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private java.util.List<QtQuotationCoatingEntry> coatings = new java.util.ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "box_id")
    @JsonIgnore
    private QtQuotationBox box;

    @OneToMany(mappedBy = "part", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<QtQuotationStampEntry> stampEntries = new ArrayList<>();

    @OneToMany(mappedBy = "part", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<QtQuotationGluing> gluings = new ArrayList<>();
}
