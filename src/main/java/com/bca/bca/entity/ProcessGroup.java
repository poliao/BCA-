package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "process_groups")
@Data
@EqualsAndHashCode(callSuper = true)
public class ProcessGroup extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private Long id;

    @Column(name = "group_name", length = 100, nullable = false)
    private String groupName;

    @Column(name = "display_order")
    private Integer displayOrder = 0;
}
