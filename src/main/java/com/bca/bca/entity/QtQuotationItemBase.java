package com.bca.bca.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@MappedSuperclass
@Data
public abstract class QtQuotationItemBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", length = 255)
    private String productName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "quantity", precision = 18, scale = 2)
    private BigDecimal quantity;

    @Column(name = "unit", length = 50)
    private String unit;

    @Column(name = "cost", precision = 18, scale = 2)
    private BigDecimal cost;

    @Column(name = "margin_percent", precision = 10, scale = 2)
    private BigDecimal marginPercent;

    @Column(name = "unit_price", precision = 18, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "amount", precision = 18, scale = 2)
    private BigDecimal amount;
}
