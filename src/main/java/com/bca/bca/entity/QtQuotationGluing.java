package com.bca.bca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "qt_quotation_gluing")
@Data
@EqualsAndHashCode(callSuper = false)
public class QtQuotationGluing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gluing_process_id")
    private Long gluingProcessId;

    @Column(name = "gluing_note", length = 500)
    private String gluingNote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id")
    @JsonIgnore
    private QtQuotationPart part;
}
