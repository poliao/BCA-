package com.bca.bca.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Optional;

@Configuration
@EnableJpaAuditing
public class JpaConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        // ในระบบจริง จะดึงข้อมูล User จาก SecurityContext
        // ตัวอย่างนี้คืนค่าคงที่ไปก่อน
        return () -> Optional.of("SYSTEM");
    }
}
