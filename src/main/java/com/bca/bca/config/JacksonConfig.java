package com.bca.bca.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * คลาสสำหรับตั้งค่าการแปลงข้อมูล JSON (Jackson)
 * ใช้เป็นตัวกลางในการจัดการรูปแบบข้อมูลก่อนส่งออกไปให้ Frontend
 * 
 * ใช้วิธีสร้าง Bean ประเภท Module เพื่อให้ Spring Boot นำไปลงทะเบียนกับ ObjectMapper โดยอัตโนมัติ
 * ซึ่งวิธีนี้จะทำงานได้ครอบคลุมและลดปัญหาความต่างของเวอร์ชัน Spring Boot
 */
@Configuration
public class JacksonConfig {

    private static final String DATE_FORMAT = "dd/MM/yyyy";
    private static final String DATETIME_FORMAT = "dd/MM/yyyy HH:mm:ss";

    /**
     * กำหนดการ Serializer สำหรับ Java Time (LocalDate, LocalDateTime)
     * เพื่อให้ทุกๆ API คืนค่ารูปแบบวันที่เดียวกันทั้งหมด
     */
    @Bean
    public Module javaTimeModule() {
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // เพิ่ม Serializer สำหรับ LocalDate
        javaTimeModule.addSerializer(LocalDate.class, 
            new LocalDateSerializer(DateTimeFormatter.ofPattern(DATE_FORMAT)));
            
        // เพิ่ม Serializer สำหรับ LocalDateTime
        javaTimeModule.addSerializer(LocalDateTime.class, 
            new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DATETIME_FORMAT)));
            
        return javaTimeModule;
    }
}


