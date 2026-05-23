package com.cinema.api.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;
import java.math.BigDecimal;

@Data @Entity @Table(name = "LICHCHIEU")
public class LichChieu {
    @Id @Column(name = "MaLichChieu") private String maLichChieu;
    @ManyToOne @JoinColumn(name = "MaPhim") private Phim phim;
    @ManyToOne @JoinColumn(name = "MaPhong") private PhongChieu phongChieu;
    @Column(name = "ThoiGianBatDau") private Date thoiGianBatDau;
    @Column(name = "ThoiGianKetThuc") private Date thoiGianKetThuc;
    @Column(name = "GiaVe") private BigDecimal giaVe;
    @Column(name = "TrangThai") private String trangThai;
    
    @OneToMany(mappedBy = "lichChieu")
    private List<Ve> ves;
}
