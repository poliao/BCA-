package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "po_categories")
@Data
@EqualsAndHashCode(callSuper = true)
public class PoCategory extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @Column(name = "category_code", length = 50, unique = true, nullable = false)
    private String categoryCode;

    @Column(name = "category_name_th", length = 200)
    private String categoryNameTh;

    @Column(name = "category_name_en", length = 200)
    private String categoryNameEn;

    @Column(name = "parent_category_code", length = 50)
    private String parentCategoryCode;

    @Column(name = "active")
    private Boolean active = true;

    @Column(name = "sequence")
    private Integer sequence;
}
