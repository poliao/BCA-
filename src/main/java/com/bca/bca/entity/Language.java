package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "su_languages")
@Data
@EqualsAndHashCode(callSuper = true)
public class Language extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "language_id")
    private Long id;

    @Column(name = "language_code", length = 10, nullable = false, unique = true)
    private String languageCode;

    @Column(name = "language_name", length = 100, nullable = false)
    private String languageName;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
