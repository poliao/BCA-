package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "qt_quotation_stamp_entries")
@Data
@EqualsAndHashCode(callSuper = false, exclude = { "items" })
@ToString(exclude = { "items" })
public class QtQuotationStampEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** หมายเหตุชุดปั้ม เช่น "ปั้มฝา", "ปั้มตัวกล่อง" */
    @Column(name = "batch_note", length = 500)
    private String batchNote;

    /** รายการค่าปั้มภายในชุดนี้ */
    @OneToMany(mappedBy = "entry", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<QtQuotationStampItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id")
    @JsonIgnore
    private QtQuotationPart part;
}
