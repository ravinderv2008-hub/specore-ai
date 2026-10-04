package com.speccore.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "psus")
@Data
@EqualsAndHashCode(callSuper = true)
public class Psu extends Component {
    private Integer wattage;
    private String efficiencyRating;
    private String modular;
    private String connectorInformation;
}
