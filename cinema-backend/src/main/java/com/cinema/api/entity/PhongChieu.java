package com.cinema.api.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data @Entity @Table(name = "PHONGCHIEU")
public class PhongChieu {
    @Id @Column(name = "MaPhong") private String maPhong;
    @Column(name = "TenPhong") private String tenPhong;
    @Column(name = "LoaiPhong") private String loaiPhong;
    @Column(name = "SoLuongGhe") private Integer soLuongGhe;
    @Column(name = "TrangThai") private String trangThai;
    
    @OneToMany(mappedBy = "phongChieu")
    private List<Ghe> ghes;
    @OneToMany(mappedBy = "phongChieu")
    private List<LichChieu> lichChieus;
}
