package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "su_roles")
@Data
@EqualsAndHashCode(callSuper = true)
public class Role extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long id;

    @Column(name = "role_code", length = 50, unique = true, nullable = false)
    private String roleCode;

    @Column(name = "role_name", length = 100)
    private String roleName;

    @Column(name = "description", length = 255)
    private String description;
}
