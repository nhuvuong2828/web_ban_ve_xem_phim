package com.cinema.api.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.math.BigDecimal;
import java.util.List;

@Data @Entity @Table(name = "VE")
public class Ve {
    @Id @Column(name = "MaVe") private String maVe;
    @ManyToOne @JoinColumn(name = "MaLichChieu") private LichChieu lichChieu;
    @ManyToOne @JoinColumn(name = "MaGhe") private Ghe ghe;
    @ManyToOne @JoinColumn(name = "MaNguoiDung") private NguoiDung nguoiDung;
    @Column(name = "GiaVe") private BigDecimal giaVe;
    @Column(name = "TrangThaiVe") private String trangThaiVe;
    @Column(name = "NgayDat") private Date ngayDat;
    
    @OneToMany(mappedBy = "ve")
    private List<ChiTietHoaDon> chiTietHoaDons;
}
