package com.speccore.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "components")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
public class Component {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String category;
    private String brand;
    private String model;
    private String productName;
    private Double price;
    private Double rating;
    private Integer reviewCount;
    private String imageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
