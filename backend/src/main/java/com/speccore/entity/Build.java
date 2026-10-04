package com.speccore.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "builds")
@Data
public class Build {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String buildName;
    private Double totalCost;
    private Double targetBudget;
    private Integer compatibilityScore;
    private Integer performanceScore;
    private Integer valueScore;
    private Integer overallScore;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    private LocalDateTime createdAt = LocalDateTime.now();
}
