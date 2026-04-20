package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Entity
@Table(name = "po_items")
@Data
@EqualsAndHashCode(callSuper = true)
public class PoItem extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long id;

    @Column(name = "item_code", length = 50, unique = true, nullable = false)
    private String itemCode;

    @Column(name = "item_name_th", length = 200)
    private String itemNameTh;

    @Column(name = "item_name_en", length = 200)
    private String itemNameEn;

    @Column(name = "category_code", length = 50)
    private String categoryCode;

    @Column(name = "minimum_order_quantity", precision = 18, scale = 4)
    private BigDecimal minimumOrderQuantity;

    @Column(name = "unit", length = 50)
    private String unit;

    @Column(name = "lead_time_days")
    private Integer leadTimeDays;

    @Column(name = "purchase_price", precision = 18, scale = 4)
    private BigDecimal purchasePrice;

    @Column(name = "width", precision = 18, scale = 4)
    private BigDecimal width;

    @Column(name = "length", precision = 18, scale = 4)
    private BigDecimal length;

    @Column(name = "active")
    private Boolean active = true;
}
