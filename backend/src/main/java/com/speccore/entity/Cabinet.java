package com.speccore.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "cabinets")
@Data
@EqualsAndHashCode(callSuper = true)
public class Cabinet extends Component {
    private String formFactor;
    private Integer gpuClearance;
    private Integer cpuCoolerClearance;
    private String radiatorSupport;
    private String dimensions;
    private String weight;
}
