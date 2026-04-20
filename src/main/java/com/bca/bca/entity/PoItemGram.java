package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Entity
@Table(name = "po_item_grams")
@Data
@EqualsAndHashCode(callSuper = true, exclude = "poItemSize")
public class PoItemGram extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_gram_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_size_id", nullable = false)
    @JsonIgnore
    private PoItemSize poItemSize;

    @Column(name = "gram", precision = 18, scale = 4)
    private BigDecimal gram;

    @Column(name = "purchase_price", precision = 18, scale = 4)
    private BigDecimal purchasePrice;
}
