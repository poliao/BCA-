package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "su_localizations")
@Data
@EqualsAndHashCode(callSuper = true)
public class Localization extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "localization_id")
    private Long id;

    @Column(name = "language_code", length = 10, nullable = false)
    private String languageCode;

    @Column(name = "module_name", length = 100, nullable = false)
    private String moduleName;

    @Column(name = "key_name", length = 255, nullable = false)
    private String key;

    @Column(name = "value_text", length = 2000)
    private String value;

}
