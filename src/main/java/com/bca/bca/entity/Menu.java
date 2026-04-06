package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "su_menus")
@Data
@EqualsAndHashCode(callSuper = true)
public class Menu extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private Long id;

    @Column(name = "menu_code", length = 50, unique = true, nullable = false)
    private String menuCode;

    @Column(name = "menu_name_en", length = 100)
    private String menuNameEn;

    @Column(name = "menu_name_th", length = 100)
    private String menuNameTh;

    @Column(name = "url", length = 255)
    private String url;

    @Column(name = "icon", length = 100)
    private String icon;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "sequence")
    private Integer sequence;
}
