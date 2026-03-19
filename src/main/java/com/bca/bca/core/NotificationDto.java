package com.bca.bca.core;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto<T> {
    private String title;
    private String message;
    private RowState state;
    private T data;
    private String timestamp;
}
