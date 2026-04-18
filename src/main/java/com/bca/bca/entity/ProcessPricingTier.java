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

    @Column(name = "process_id", insertable = false, updatable = false)
    private Long processId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id")
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

    @Column(name = "color_count")
    private Integer colorCount;

    @Column(name = "cut_size", length = 50)
    private String cutSize;

    @Column(name = "total_additional_cost", precision = 12, scale = 4)
    private BigDecimal totalAdditionalCost = BigDecimal.ZERO;

    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "stamp_type", length = 50)
    private String stampType;

    @Column(name = "stamp_size", length = 50)
    private String stampSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", insertable = false, updatable = false)
    private ProductionLocation location;
}
