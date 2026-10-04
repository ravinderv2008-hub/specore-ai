package com.speccore.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "motherboards")
@Data
@EqualsAndHashCode(callSuper = true)
public class Motherboard extends Component {
    private String socket;
    private String chipset;
    private String formFactor;
    private String ramType;
    private Integer maxRam;
    private Integer ramSlots;
    private Integer m2Slots;
    private Integer sataPorts;
    private Integer pcieSlots;
    private Boolean wifi;
    private Boolean bluetooth;
}
