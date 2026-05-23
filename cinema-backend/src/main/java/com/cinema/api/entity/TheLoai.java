package com.cinema.api.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data @Entity @Table(name = "THELOAI")
public class TheLoai {
    @Id @Column(name = "MaTheLoai") private String maTheLoai;
    @Column(name = "TenTheLoai") private String tenTheLoai;
    @Column(name = "MoTa") private String moTa;
    
    @OneToMany(mappedBy = "theLoai")
    private List<Phim> phims;
}
