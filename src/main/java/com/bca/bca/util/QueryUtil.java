package com.bca.bca.util;

import org.springframework.data.domain.Sort;
import java.util.ArrayList;
import java.util.List;

public class QueryUtil {

    /**
     * Parses a sort string from the frontend into a Spring Data Sort object.
     * Expected format: "property direction,property direction"
     * Example: "username asc,firstName desc"
     */
    public static Sort parseSort(String sortStr) {
        if (sortStr == null || sortStr.trim().isEmpty()) {
            return Sort.unsorted();
        }

        List<Sort.Order> orders = new ArrayList<>();
        String[] sortParams = sortStr.split(",");

        for (String param : sortParams) {
            String[] split = param.trim().split("\\s+");
            if (split.length > 0) {
                String property = split[0];
                Sort.Direction direction = Sort.Direction.ASC;
                if (split.length > 1) {
                    if ("desc".equalsIgnoreCase(split[1])) {
                        direction = Sort.Direction.DESC;
                    }
                }
                orders.add(new Sort.Order(direction, property));
            }
        }

        return orders.isEmpty() ? Sort.unsorted() : Sort.by(orders);
    }
}
