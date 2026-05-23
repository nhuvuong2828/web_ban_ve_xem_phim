package com.cinema.api.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data @Entity @Table(name = "NGUOIDUNG")
public class NguoiDung {
    @Id @Column(name = "MaNguoiDung") private String maNguoiDung;
    @Column(name = "HoTen") private String hoTen;
    @Column(name = "Email") private String email;
    @Column(name = "SoDienThoai") private String soDienThoai;
    @Column(name = "MatKhau") private String matKhau;
    @Column(name = "VaiTro") private String vaiTro;
    @Column(name = "NgaySinh") private Date ngaySinh;
    @Column(name = "GioiTinh") private String gioiTinh;
    @Column(name = "DiaChi") private String diaChi;
    @Column(name = "NgayDangKy") private Date ngayDangKy;
    @Column(name = "TrangThai") private String trangThai;
    
    @OneToMany(mappedBy = "nguoiDung") private List<Ve> ves;
    @OneToMany(mappedBy = "nguoiDung") private List<HoaDon> hoaDons;
    @OneToMany(mappedBy = "nguoiDung") private List<LichSuHanhVi> lichSuHanhVis;
    @OneToMany(mappedBy = "nguoiDung") private List<GoiYCanhanHoa> goiYCanhanHoas;
}
