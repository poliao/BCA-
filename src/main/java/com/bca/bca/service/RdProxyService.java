package com.bca.bca.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RdProxyService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String RD_API_URL = "https://ecqyzf1qgi.execute-api.ap-southeast-1.amazonaws.com/prod/rdcontact";

    public Object searchRdContact(String keyword) {
        String url = UriComponentsBuilder.fromUriString(RD_API_URL)
                .queryParam("ocr", false)
                .queryParam("keyword", keyword)
                .toUriString();

        try {
            return restTemplate.getForObject(url, Object.class);
        } catch (Exception e) {
            return Map.of(
                "status", false,
                "message", "Error connecting to RD API: " + e.getMessage()
            );
        }
    }
}
