package com.nashtech.assetmanagementwebservice.utils;


import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class DateUtils {
    public static String dateToString( String pattern, LocalDate date ){
        DateTimeFormatter fm = DateTimeFormatter.ofPattern(pattern);
        return date.format(fm);
    }

}
