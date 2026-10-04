package com.speccore.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "storage")
@Data
@EqualsAndHashCode(callSuper = true)
public class Storage extends Component {
    private String storageType;
    private String capacity;
    private String interfaceType;
    private Integer readSpeed;
    private Integer writeSpeed;
    private String formFactor;
}
