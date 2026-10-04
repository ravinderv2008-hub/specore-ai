package com.speccore.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "cpus")
@Data
@EqualsAndHashCode(callSuper = true)
public class Cpu extends Component {
    private String socket;
    private Integer cores;
    private Integer threads;
    private String baseClock;
    private String boostClock;
    private String cache;
    private Integer tdp;
    private Boolean integratedGraphics;
    private String architecture;
}
