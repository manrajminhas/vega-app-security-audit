package io.venus.vega.data.entities.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;


@AllArgsConstructor
@Getter
public enum SecurityStatus {
    PENDING ("pending","Pending"),
    NORMAL("normal","Normal"),
    ATTACKED("attacked","Attacked");
    private String status;
    private String displayStatus;

}