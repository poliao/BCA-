package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Entity
@Table(name = "qt_quotation_stamp_items")
@Data
@EqualsAndHashCode(callSuper = false)
public class QtQuotationStampItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Process ID จาก SUMT03 (กลุ่ม "ปั้ม") */
    @Column(name = "stamp_item_process_id")
    private Long stampItemProcessId;

    /** ประเภทปั้ม (เก็บไว้เป็น fallback / display label) */
    @Column(name = "stamp_type", length = 100)
    private String stampType;

    /** ขนาดกว้าง (ซม.) */
    @Column(name = "width", precision = 10, scale = 2)
    private BigDecimal width;

    /** ขนาดยาว (ซม.) */
    @Column(name = "length", precision = 10, scale = 2)
    private BigDecimal length;

    /** หมายเหตุ / พื้นที่ปั้ม */
    @Column(name = "stamp_note", length = 500)
    private String stampNote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entry_id")
    @JsonIgnore
    private QtQuotationStampEntry entry;
}
