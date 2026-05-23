package com.cinema.api.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data @Entity @Table(name = "PHIM")
public class Phim {
    @Id @Column(name = "MaPhim") private String maPhim;
    @ManyToOne @JoinColumn(name = "MaTheLoai") private TheLoai theLoai;
    @Column(name = "TenPhim") private String tenPhim;
    @Column(name = "MoTa") private String moTa;
    @Column(name = "ThoiLuong") private Integer thoiLuong;
    @Column(name = "NgayKhoiChieu") private Date ngayKhoiChieu;
    @Column(name = "DoTuoiGioiHan") private Integer doTuoiGioiHan;
    @Column(name = "Poster") private String poster;
    @Column(name = "Trailer") private String trailer;
    @Column(name = "TrangThai") private String trangThai;
    
    @OneToMany(mappedBy = "phim")
    private List<LichChieu> lichChieus;
}
