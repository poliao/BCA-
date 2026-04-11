package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;

@Entity
@Table(name = "process_pricing_tiers")
@Data
@EqualsAndHashCode(callSuper = true, exclude = {"process"})
@ToString(exclude = {"process"})
public class ProcessPricingTier extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tier_id")
    private Long id;

    @Column(name = "process_id")
    private Long processId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", insertable = false, updatable = false)
    @JsonIgnore
    private ProductionProcess process;

    @Column(name = "min_qty", nullable = false)
    private Integer minQty;

    @Column(name = "max_qty")
    private Integer maxQty;

    @Column(name = "fixed_cost", precision = 12, scale = 4)
    private BigDecimal fixedCost = BigDecimal.ZERO;

    @Column(name = "variable_rate", precision = 12, scale = 4)
    private BigDecimal variableRate = BigDecimal.ZERO;

    @Column(name = "variable_unit_label", length = 50)
    private String variableUnitLabel;
}
