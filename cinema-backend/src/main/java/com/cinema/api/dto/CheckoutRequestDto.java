package com.cinema.api.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CheckoutRequestDto {
    private String userEmail;
    private String movieId;
    private String room;
    private String time;
    private List<SeatDto> seats;
    private List<ComboSelectionDto> combos;
    private BigDecimal totalPrice;

    @Data
    public static class SeatDto {
        private String id;
        private BigDecimal price;
    }

    @Data
    public static class ComboSelectionDto {
        private String id;
        private Integer quantity;
    }
}