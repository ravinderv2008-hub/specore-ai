package com.speccore.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "gpus")
@Data
@EqualsAndHashCode(callSuper = true)
public class Gpu extends Component {
    private Integer vram;
    private String memoryType;
    private String boostClock;
    private Integer tdp;
    private Integer length;
    private Integer recommendedPsu;
}
