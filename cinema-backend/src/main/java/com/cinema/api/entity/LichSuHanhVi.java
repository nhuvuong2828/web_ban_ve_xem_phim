package com.cinema.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "LICHSUHANHVI")
public class LichSuHanhVi {
    @Id
    @Column(name = "MaHanhVi")
    private String maHanhVi;
    @ManyToOne
    @JoinColumn(name = "MaNguoiDung")
    private NguoiDung nguoiDung;
    @Column(name = "LoaiHanhVi")
    private String loaiHanhVi;
    @Column(name = "NoiDung")
    private String noiDung;
    @Column(name = "ThoiGian")
    private Date thoiGian;
}
