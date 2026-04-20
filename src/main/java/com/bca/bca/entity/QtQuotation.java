package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "qt_quotations")
@Data
@EqualsAndHashCode(callSuper = true, exclude = { "boxes" })
@ToString(exclude = { "boxes" })
public class QtQuotation extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quotation_id")
    private Long id;

    @Column(name = "quotation_no", length = 50, unique = true, nullable = false)
    private String quotationNo;

    @Column(name = "quotation_date")
    private LocalDate quotationDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "customer_code", length = 50)
    private String customerCode;

    @Column(name = "customer_name", length = 255)
    private String customerName;

    @Column(name = "contact_name", length = 255)
    private String contactName;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "branch_type", length = 100)
    private String branchType;

    @Column(name = "zip_code", length = 20)
    private String zipCode;

    @Column(name = "tax_id", length = 20)
    private String taxId;

    @Column(name = "remark", columnDefinition = "TEXT")
    private String remark;

    @Column(name = "remark_internal", columnDefinition = "TEXT")
    private String remarkInternal;

    @Column(name = "total_cost", precision = 18, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "total_amount", precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "vat_type", length = 50)
    private String vatType;

    @Column(name = "is_vat_included")
    private Boolean isVatIncluded = false;

    @Column(name = "vat_rate", precision = 5, scale = 2)
    private BigDecimal vatRate;

    @Column(name = "vat_amount", precision = 18, scale = 2)
    private BigDecimal vatAmount;

    @Column(name = "wht_rate", precision = 5, scale = 2)
    private BigDecimal whtRate;

    @Column(name = "wht_amount", precision = 18, scale = 2)
    private BigDecimal whtAmount;

    @Column(name = "grand_total", precision = 18, scale = 2)
    private BigDecimal grandTotal;

    @Column(name = "profit_amount", precision = 18, scale = 2)
    private BigDecimal profitAmount;

    @Column(name = "profit_margin_percent", precision = 10, scale = 2)
    private BigDecimal profitMarginPercent;

    @Column(name = "status", length = 20)
    private String status = "NEW";

    @Column(name = "job_name", length = 255)
    private String jobName;

    @Column(name = "job_type", length = 100)
    private String jobType;

    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<QtQuotationBox> boxes = new ArrayList<>();
}
