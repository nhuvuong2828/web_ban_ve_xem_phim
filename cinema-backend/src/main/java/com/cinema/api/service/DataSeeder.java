package com.cinema.api.service;

import com.cinema.api.entity.NguoiDung;
import com.cinema.api.entity.PhongChieu;
import com.cinema.api.entity.TheLoai;
import com.cinema.api.entity.Combo;
import com.cinema.api.repository.NguoiDungRepository;
import com.cinema.api.repository.PhongChieuRepository;
import com.cinema.api.repository.TheLoaiRepository;
import com.cinema.api.repository.GheRepository;
import com.cinema.api.repository.GoiYCanhanHoaRepository;
import com.cinema.api.repository.ComboRepository;
import com.cinema.api.entity.Ghe;
import com.cinema.api.entity.Phim;
import com.cinema.api.entity.Combo;
import com.cinema.api.entity.GoiYCanhanHoa;
import com.cinema.api.repository.PhimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.math.BigDecimal;

@Service
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private PhongChieuRepository phongChieuRepository;

    @Autowired
    private TheLoaiRepository theLoaiRepository;

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private GheRepository gheRepository;

    @Autowired
    private GoiYCanhanHoaRepository goiYCanhanHoaRepository;

    @Autowired
    private PhimRepository phimRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed Users
        if (nguoiDungRepository.count() == 0) {
            NguoiDung admin = new NguoiDung();
            admin.setMaNguoiDung("admin@cineflex.com");
            admin.setHoTen("Admin Cineflex");
            admin.setEmail("admin@cineflex.com");
            admin.setMatKhau("123456");
            admin.setVaiTro("ADMIN");
            admin.setNgayDangKy(new Date());
            nguoiDungRepository.save(admin);

            NguoiDung user = new NguoiDung();
            user.setMaNguoiDung("user@cineflex.com");
            user.setHoTen("Khách Hàng Vip");
            user.setEmail("user@cineflex.com");
            user.setMatKhau("123456");
            user.setVaiTro("USER");
            user.setNgayDangKy(new Date());
            nguoiDungRepository.save(user);
        }

        // Seed Genres
        if (theLoaiRepository.count() == 0) {
            String[] genres = {"Hành Động", "Hài Hước", "Tình Cảm", "Kinh Dị", "Khoa Học Viễn Tưởng", "Hoạt Hình"};
            for (int i = 0; i < genres.length; i++) {
                TheLoai tl = new TheLoai();
                tl.setMaTheLoai("TL0" + (i + 1));
                tl.setTenTheLoai(genres[i]);
                theLoaiRepository.save(tl);
            }
        }

        // Seed Rooms
        if (phongChieuRepository.count() == 0) {
            PhongChieu p1 = new PhongChieu();
            p1.setMaPhong("P01");
            p1.setTenPhong("Phòng 1 (2D)");
            p1.setLoaiPhong("2D");
            p1.setSoLuongGhe(36);
            phongChieuRepository.save(p1);

            PhongChieu p2 = new PhongChieu();
            p2.setMaPhong("P02");
            p2.setTenPhong("Phòng 2 (3D)");
            p2.setLoaiPhong("3D");
            p2.setSoLuongGhe(36);
            phongChieuRepository.save(p2);
        } else {
            PhongChieu p1 = phongChieuRepository.findById("P01").orElse(null);
            if (p1 != null && p1.getSoLuongGhe() != 36) {
                p1.setSoLuongGhe(36);
                p1.setTenPhong("Phòng 1 (2D)");
                phongChieuRepository.save(p1);
            }
            PhongChieu p2 = phongChieuRepository.findById("P02").orElse(null);
            if (p2 != null && p2.getSoLuongGhe() != 36) {
                p2.setSoLuongGhe(36);
                p2.setTenPhong("Phòng 2 (3D)");
                phongChieuRepository.save(p2);
            }
        }

        // Seed Seats
        for (PhongChieu p : phongChieuRepository.findAll()) {
            seedRow(p, "A", 8, "STANDARD");
            seedRow(p, "B", 8, "STANDARD");
            seedRow(p, "C", 8, "VIP");
            seedRow(p, "D", 8, "VIP");
            seedRow(p, "E", 4, "COUPLE");
        }

        // Seed Combos
        if (comboRepository.count() == 0) {
            Combo c1 = new Combo();
            c1.setMaCombo("C1");
            c1.setTenCombo("Combo Single (1 Bắp + 1 Nước)");
            c1.setGiaCombo(new BigDecimal("75000"));
            c1.setTrangThai("ACTIVE");
            comboRepository.save(c1);

            Combo c2 = new Combo();
            c2.setMaCombo("C2");
            c2.setTenCombo("Combo Couple (1 Bắp to + 2 Nước)");
            c2.setGiaCombo(new BigDecimal("120000"));
            c2.setTrangThai("ACTIVE");
            comboRepository.save(c2);

            Combo c3 = new Combo();
            c3.setMaCombo("C3");
            c3.setTenCombo("Combo Family (2 Bắp to + 4 Nước)");
            c3.setGiaCombo(new BigDecimal("210000"));
            c3.setTrangThai("ACTIVE");
            comboRepository.save(c3);
        }

        // Seed Recommendations
        if (goiYCanhanHoaRepository.count() == 0 && phimRepository.count() > 0) {
            NguoiDung user = nguoiDungRepository.findById("user@cineflex.com").orElse(null);
            Phim p1 = phimRepository.findAll().stream().findFirst().orElse(null);
            
            if (user != null && p1 != null) {
                GoiYCanhanHoa g1 = new GoiYCanhanHoa();
                g1.setMaGoiY("GY01");
                g1.setNguoiDung(user);
                g1.setPhim(p1);
                g1.setDiemPhuHop(0.95);
                g1.setLyDoGoiY("Vì bạn đã xem nhiều phim cùng thể loại");
                g1.setNgayTao(new Date());
                g1.setTrangThai("NEW");
                goiYCanhanHoaRepository.save(g1);
            }
        }
    }

    private void seedRow(PhongChieu p, String row, int cols, String type) {
        for (int i = 1; i <= cols; i++) {
            String seatId = row + i;
            String fullId = p.getMaPhong() + "_" + seatId;
            if (!gheRepository.existsById(fullId)) {
                Ghe g = new Ghe();
                g.setMaGhe(fullId);
                g.setPhongChieu(p);
                g.setLoaiGhe(type);
                gheRepository.save(g);
            }
        }
    }
}
