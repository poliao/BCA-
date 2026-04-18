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
@Table(name = "qt_quotation_parts")
@Data
@EqualsAndHashCode(callSuper = true, exclude = { "box", "stamps" })
@ToString(exclude = { "box", "stamps" })
public class QtQuotationPart extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "part_id")
    private Long id;

    @Column(name = "part_name", length = 255)
    private String partName;

    @Column(name = "paper_id")
    private Long paperId;

    @Column(name = "paper_size", length = 100)
    private String paperSize;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "box_id")
    @JsonIgnore
    private QtQuotationBox box;

    @OneToMany(mappedBy = "part", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<QtQuotationStamp> stamps = new ArrayList<>();
}
