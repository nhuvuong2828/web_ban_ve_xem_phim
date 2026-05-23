package com.cinema.api.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data @Entity @Table(name = "GOIY_CANHANHOA")
public class GoiYCanhanHoa {
    @Id @Column(name = "MaGoiY") private String maGoiY;
    @ManyToOne @JoinColumn(name = "MaNguoiDung") private NguoiDung nguoiDung;
    @ManyToOne @JoinColumn(name = "MaPhim") private Phim phim;
    @Column(name = "DiemPhuHop") private Double diemPhuHop;
    @Column(name = "LyDoGoiY") private String lyDoGoiY;
    @Column(name = "NgayTao") private Date ngayTao;
    @Column(name = "TrangThai") private String trangThai;
}
