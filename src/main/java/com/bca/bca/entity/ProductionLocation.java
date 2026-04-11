package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "production_locations")
@Data
@EqualsAndHashCode(callSuper = true)
public class ProductionLocation extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long id;

    @Column(name = "location_name", length = 255, nullable = false)
    private String locationName;

    @Column(name = "location_type", length = 50)
    private String locationType = "IN_HOUSE";
}
