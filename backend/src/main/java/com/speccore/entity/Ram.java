package com.speccore.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "ram")
@Data
@EqualsAndHashCode(callSuper = true)
public class Ram extends Component {
    private Integer capacity;
    private String generation;
    private Integer speed;
    private String latency;
    private Double voltage;
    private Integer moduleCount;
}
