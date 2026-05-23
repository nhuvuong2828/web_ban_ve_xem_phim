package com.cinema.api.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data @Entity @Table(name = "COMBO")
public class Combo {
    @Id @Column(name = "MaCombo") private String maCombo;
    @Column(name = "TenCombo") private String tenCombo;
    @Column(name = "GiaCombo") private BigDecimal giaCombo;
    @Column(name = "MoTa") private String moTa;
    @Column(name = "TrangThai") private String trangThai;
    
    @OneToMany(mappedBy = "combo")
    private List<ChiTietHoaDon> chiTietHoaDons;
}
