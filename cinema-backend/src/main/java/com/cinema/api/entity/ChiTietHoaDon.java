package com.cinema.api.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data @Entity @Table(name = "CHITIETHOADON")
public class ChiTietHoaDon {
    @Id @Column(name = "MaChiTietHD") private String maChiTietHD;
    @ManyToOne @JoinColumn(name = "MaHoaDon") private HoaDon hoaDon;
    @ManyToOne @JoinColumn(name = "MaVe") private Ve ve;
    @ManyToOne @JoinColumn(name = "MaCombo") private Combo combo;
    @Column(name = "SoLuong") private Integer soLuong;
    @Column(name = "ThanhTien") private BigDecimal thanhTien;
}
