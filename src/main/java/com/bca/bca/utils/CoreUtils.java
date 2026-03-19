package com.bca.bca.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

import org.springframework.util.StringUtils;

/**
 * คลาสเครื่องมือทั่วไปสำหรับจัดดการข้อมูลต่างๆ เช่น วันที่, ข้อความ
 * และสถานะว่าง
 */
public class CoreUtils {

    // --- Date & Time Utilities ---

    /**
     * แปลง String เป็น LocalDate โดยใช้รูปแบบ "dd/MM/yyyy"
     * 
     * @param text ข้อความวันที่ เช่น "31/12/2023"
     * @return วัตถุ LocalDate
     */
    public static LocalDate parseLocalDate(String text) {
        if (isEmpty(text))
            return null;
        return LocalDate.parse(trim(text), DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    /**
     * แปลง String เป็น LocalDateTime โดยใช้รูปแบบ "dd/MM/yyyy HH:mm:ss"
     * 
     * @param text ข้อความวันเวลา เช่น "31/12/2023 23:59:59"
     * @return วัตถุ LocalDateTime
     */
    public static LocalDateTime parseLocalDateTime(String text) {
        if (isEmpty(text))
            return null;
        return LocalDateTime.parse(trim(text), DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
    }

    /**
     * แปลง LocalDate เป็น java.util.Date เพื่อใช้กับ Library รุ่นเก่า
     * 
     * @param localDate วัตถุ LocalDate
     * @return วัตถุ java.util.Date
     */
    public static Date toDate(LocalDate localDate) {
        if (localDate == null)
            return null;
        Instant instant = localDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        return Date.from(instant);
    }

    /**
     * แปลง LocalDateTime เป็น java.util.Date
     * 
     * @param localDateTime วัตถุ LocalDateTime
     * @return วัตถุ java.util.Date
     */
    public static Date toDate(LocalDateTime localDateTime) {
        if (localDateTime == null)
            return null;
        Instant instant = localDateTime.atZone(ZoneId.systemDefault()).toInstant();
        return Date.from(instant);
    }

    /**
     * แปลง java.util.Date เป็น String ตามรูปแบบที่กำหนด (Pattern)
     * 
     * @param date    วัตถุวันที่
     * @param pattern รูปแบบ เช่น "yyyy-MM-dd"
     * @return ข้อความวันที่ที่จัดรูปแบบแล้ว
     */
    public static String format(Date date, String pattern) {
        if (date == null)
            return "";
        DateFormat dateFormat = new SimpleDateFormat(pattern, Locale.US);
        return dateFormat.format(date);
    }

    /**
     * แปลง String เป็น java.util.Date ตามรูปแบบที่กำหนด
     * 
     * @param source  ข้อความวันที่
     * @param pattern รูปแบบของข้อความต้นทาง
     * @return วัตถุ java.util.Date
     */
    public static Date parse(String source, String pattern) {
        if (isEmpty(source))
            return null;
        DateFormat dateFormat = new SimpleDateFormat(pattern, Locale.US);
        try {
            return dateFormat.parse(source);
        } catch (ParseException e) {
            throw new RuntimeException("Error parsing date: " + source + " with pattern: " + pattern, e);
        }
    }

    /**
     * ดึงวันเวลาปัจจุบันในรูปแบบ String ตามแพทเทิร์นที่ต้องการ
     * 
     * @param pattern รูปแบบที่ต้องการ เช่น "yyyyMMddHHmmss"
     * @return ข้อความวันเวลาปัจจุบัน
     */
    public static String getCurrentDateTime(String pattern) {
        return format(new Date(), pattern);
    }

    /**
     * ดึงเวลาปัจจุบันในหน่วยมิลลิวินาที (Milliseconds) เป็น String
     */
    public static String getCurrentTimeMill() {
        return String.valueOf(new Date().getTime());
    }

    /**
     * ดึงวันเวลาปัจจุบันแบบระบุ Timezone (Asia/Bangkok)
     * 
     * @return วัตถุ OffsetDateTime
     */
    public static OffsetDateTime getCurrentOffsetDateTime() {
        return OffsetDateTime.now(ZoneId.of("Asia/Bangkok"));
    }

    /**
     * ดึงเวลาเริ่มต้นของวัน (00:00:00) ในรูปแบบ java.util.Date
     * 
     * @param localDate วัตถุวันที่
     * @return วัตถุ Date ที่เวลาเป็นเริ่มต้นวัน
     */
    public static Date atStartOfDay(LocalDate localDate) {
        if (localDate == null)
            return null;
        return toDate(localDate.atStartOfDay());
    }

    /**
     * ดึงเวลาสิ้นสุดของวัน (23:59:59.999) ในรูปแบบ java.util.Date
     * 
     * @param localDate วัตถุวันที่
     * @return วัตถุ Date ที่เวลาเป็นสิ้นสุดวัน
     */
    public static Date atEndOfDay(LocalDate localDate) {
        if (localDate == null)
            return null;
        return toDate(localDate.atStartOfDay().with(LocalTime.MAX));
    }

    // --- Null & Empty Checks ---

    /**
     * ตรวจสอบว่าข้อความเป็นค่าว่างหรือไม่ (รวมกรณี null, "null", "undefined")
     * โดยจะทำการตัดช่องว่าง (trim) ก่อนตรวจสอบด้วย
     * 
     * @param value ข้อความที่ต้องการตรวจสอบ
     * @return true ถ้าเป็นค่าว่าง หรือเป็นคำว่า "null"/"undefined"
     */
    public static boolean isEmpty(String value) {
        String trimmed = trim(value);
        return !StringUtils.hasText(trimmed)
                || "null".equalsIgnoreCase(trimmed)
                || "undefined".equalsIgnoreCase(trimmed);
    }

    /**
     * ตรวจสอบว่าข้อความไม่เป็นค่าว่าง (NotEmpty)
     * 
     * @param value ข้อความที่ต้องการตรวจสอบ
     * @return true ถ้ามีข้อมูลและไม่ใช่ "null"/"undefined"
     */
    public static boolean isNotEmpty(String value) {
        return !isEmpty(value);
    }

    /**
     * ตรวจสอบว่า Collection (เช่น List, Set) เป็นค่าว่างหรือเป็น null หรือไม่
     */
    public static boolean isEmpty(Collection<?> collection) {
        return collection == null || collection.isEmpty();
    }

    /**
     * ตรวจสอบว่า Collection มีข้อมูลอยู่ข้างในอย่างน้อย 1 รายการ
     */
    public static boolean isNotEmpty(Collection<?> collection) {
        return !isEmpty(collection);
    }

    /**
     * ตรวจสอบว่า Map เป็นค่าว่างหรือเป็น null หรือไม่
     */
    public static boolean isEmpty(Map<?, ?> map) {
        return map == null || map.isEmpty();
    }

    /**
     * ตรวจสอบว่า Map มีข้อมูล (key-value pair) อยู่หรือไม่
     */
    public static boolean isNotEmpty(Map<?, ?> map) {
        return !isEmpty(map);
    }

    /**
     * ตรวจสอบว่า Array เป็นค่าว่างหรือเป็น null หรือไม่
     */
    public static boolean isEmpty(Object[] map) {
        return map == null || map.length == 0;
    }

    /**
     * ตรวจสอบว่า Array มีข้อมูลอยู่หรือไม่
     */
    public static boolean isNotEmpty(Object[] map) {
        return !isEmpty(map);
    }

    /**
     * ตรวจสอบว่าวัตถุ (Object) เป็น null หรือไม่
     */
    public static boolean isNull(Object object) {
        return object == null;
    }

    /**
     * ตรวจสอบว่าวัตถุ (Object) ไม่เป็นค่า null
     */
    public static boolean isNotNull(Object object) {
        return object != null;
    }

    /**
     * ตัดช่องว่าง (Whitespace) ที่หัวและท้ายของข้อความ
     * ถ้าข้อความเป็น null จะคืนค่าว่าง ("") เพื่อป้องกัน NullPointerException
     * 
     * @param text ข้อความที่ต้องการตัดช่องว่าง
     * @return ข้อความที่ถูกตัดช่องว่างแล้ว
     */
    public static String trim(String text) {
        return text == null ? "" : text.trim();
    }
}
