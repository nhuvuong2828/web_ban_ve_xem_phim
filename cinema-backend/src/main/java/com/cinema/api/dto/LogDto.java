package com.cinema.api.dto;
import lombok.Data;
@Data
public class LogDto {
    private String id;
    private String user;
    private String type;
    private String content;
    private String time;
}