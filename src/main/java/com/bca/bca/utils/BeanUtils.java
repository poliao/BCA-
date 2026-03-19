package com.bca.bca.utils;

import java.beans.PropertyDescriptor;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

/**
 * คลาสเครื่องมือสำหรับช่วยอำนวยความสะดวกในการจัดการ Java Bean
 * มีประโยชน์อย่างมากสำหรับการทำ Partial Update ข้อมูล
 */
public class BeanUtils {

    /**
     * ก๊อปปี้ข้อมูลฟิลด์จาก source ไปยัง target เฉพาะฟิลด์ที่ค่าไม่เป็น null เท่านั้น
     * นิยมใช้ในกรณีที่เราต้องการอัปเดตข้อมูลบางส่วน (Patch Update) 
     * เพื่อไม่ให้ค่า null จาก source ไปทับข้อมูลเดิมใน target
     * 
     * @param source วัตถุต้นทางที่มีข้อมูลใหม่
     * @param target วัตถุปลายทางที่ต้องการให้ข้อมูลถูกก๊อปปี้ไปใส่
     */
    public static void copyNonNullProperties(Object source, Object target) {
        org.springframework.beans.BeanUtils.copyProperties(source, target, getNullPropertyNames(source));
    }

    /**
     * หาชื่อฟิลด์ (Property name) ที่มีค่าเป็น null ในวัตถุต้นทาง
     * 
     * @param source วัตถุที่ต้องการตรวจสอบ
     * @return อาร์เรย์ของชื่อฟิลด์ที่เป็น null
     */
    private static String[] getNullPropertyNames(Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);
        PropertyDescriptor[] pds = src.getPropertyDescriptors();

        Set<String> emptyNames = new HashSet<>();
        for (PropertyDescriptor pd : pds) {
            Object srcValue = src.getPropertyValue(pd.getName());
            if (srcValue == null) {
                emptyNames.add(pd.getName());
            }
        }

        String[] result = new String[emptyNames.size()];
        return emptyNames.toArray(result);
    }
}
