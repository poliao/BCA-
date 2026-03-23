package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

@Entity
@Table(name = "su_audit_detail_logs")
@Data
@EqualsAndHashCode(callSuper = true)
public class AuditDetailLog extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idlog")
    private Long id;

    @Column(name = "menu_code", length = 50)
    private String menuCode;

    @Column(name = "log_timestamp")
    private LocalDateTime logTimestamp;

    @Column(name = "action_name", length = 100)
    private String action;

    @Column(name = "user_id", length = 100)
    private String userId;

    @Column(name = "head_id")
    private Long headId;
}
