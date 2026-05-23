package com.cinema.api.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data @Entity @Table(name = "GHE")
public class Ghe {
    @Id @Column(name = "MaGhe") private String maGhe;
    @ManyToOne @JoinColumn(name = "MaPhong") private PhongChieu phongChieu;
    @Column(name = "TenGhe") private String tenGhe;
    @Column(name = "LoaiGhe") private String loaiGhe;
    @Column(name = "ViTriHang") private String viTriHang;
    @Column(name = "ViTriCot") private Integer viTriCot;
    @Column(name = "TrangThai") private String trangThai;
    
    @OneToMany(mappedBy = "ghe")
    private List<Ve> ves;
}
