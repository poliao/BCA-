package com.bca.bca.core;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class BaseDto {
    private RowState rowState = RowState.NORMAL;
}
