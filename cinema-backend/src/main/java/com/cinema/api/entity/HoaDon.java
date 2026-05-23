package com.cinema.api.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;
import java.math.BigDecimal;

@Data @Entity @Table(name = "HOADON")
public class HoaDon {
    @Id @Column(name = "MaHoaDon") private String maHoaDon;
    @ManyToOne @JoinColumn(name = "MaNguoiDung") private NguoiDung nguoiDung;
    @Column(name = "NgayLap") private Date ngayLap;
    @Column(name = "TongTien") private BigDecimal tongTien;
    @Column(name = "PhuongThucThanhToan") private String phuongThucThanhToan;
    @Column(name = "TrangThaiThanhToan") private String trangThaiThanhToan;
    
    @OneToMany(mappedBy = "hoaDon")
    private List<ChiTietHoaDon> chiTietHoaDons;
}
