package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "su_role_permissions")
@Data
@EqualsAndHashCode(callSuper = true)
public class RolePermission extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;

    @Column(name = "is_visible", nullable = false)
    private Boolean isVisible = false;

    @Column(name = "can_read", nullable = false)
    private Boolean canRead = false;

    @Column(name = "can_create", nullable = false)
    private Boolean canCreate = false;

    @Column(name = "can_edit", nullable = false)
    private Boolean canEdit = false;

    @Column(name = "can_delete", nullable = false)
    private Boolean canDelete = false;

    @Column(name = "can_cancel", nullable = false)
    private Boolean canCancel = false;

    @Column(name = "can_approve", nullable = false)
    private Boolean canApprove = false;

    @Column(name = "can_verify", nullable = false)
    private Boolean canVerify = false;
}
