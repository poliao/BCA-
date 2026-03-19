package com.bca.bca.core;

import lombok.Getter;

@Getter
public enum RowState {
    NORMAL(1, "Normal"),
    NEW(2, "New"),
    MODIFIED(3, "Modified"),
    DELETED(4, "Deleted");

    private final int value;
    private final String description;

    RowState(int value, String description) {
        this.value = value;
        this.description = description;
    }

    public static RowState fromValue(int value) {
        for (RowState state : RowState.values()) {
            if (state.getValue() == value) {
                return state;
            }
        }
        throw new IllegalArgumentException("Invalid RowState value: " + value);
    }
}
