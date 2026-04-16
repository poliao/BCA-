package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "production_processes")
@Data
@EqualsAndHashCode(callSuper = true, exclude = { "pricingTiers" })
@ToString(exclude = { "pricingTiers" })
public class ProductionProcess extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "process_id")
    private Long id;

    @Column(name = "process_name", length = 255, nullable = false)
    private String processName;

    @Column(name = "base_uom", length = 50)
    private String baseUom;

    @Column(name = "group_id")
    private Long groupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", insertable = false, updatable = false)
    private ProcessGroup group;

    @Column(name = "location_id")
    private Long locationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", insertable = false, updatable = false)
    private ProductionLocation location;

    @Column(name = "status", length = 20)
    private String status = "ACTIVE";

    @OneToMany(mappedBy = "process", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<ProcessPricingTier> pricingTiers = new ArrayList<>();
}
