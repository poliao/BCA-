package com.bca.bca.entity;

import com.bca.bca.core.EntityBase;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "po_item_sizes")
@Data
@EqualsAndHashCode(callSuper = true, exclude = {"poItem", "grams"})
public class PoItemSize extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_size_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    @JsonIgnore
    private PoItem poItem;

    @Column(name = "width", precision = 18, scale = 4)
    private BigDecimal width;

    @Column(name = "length", precision = 18, scale = 4)
    private BigDecimal length;

    @OneToMany(mappedBy = "poItemSize", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PoItemGram> grams = new ArrayList<>();

    // Helper method to link sizes to grams during save
    public void setGrams(List<PoItemGram> grams) {
        if (this.grams != null) {
            this.grams.clear();
        } else {
            this.grams = new ArrayList<>();
        }
        if (grams != null) {
            for (PoItemGram gram : grams) {
                gram.setPoItemSize(this);
                this.grams.add(gram);
            }
        }
    }
}
