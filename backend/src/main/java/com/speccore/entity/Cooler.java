package com.speccore.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "coolers")
@Data
@EqualsAndHashCode(callSuper = true)
public class Cooler extends Component {
    private String supportedSockets;
    private String coolerType;
    private String fanSize;
    private Integer height;
    private Integer tdpCapacity;
}
