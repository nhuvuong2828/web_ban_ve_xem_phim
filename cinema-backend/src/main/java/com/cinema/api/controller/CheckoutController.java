package com.cinema.api.controller;

import com.cinema.api.dto.CheckoutRequestDto;
import com.cinema.api.entity.*;
import com.cinema.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CheckoutController {

    private final HoaDonRepository hoaDonRepository;
    private final ChiTietHoaDonRepository chiTietHoaDonRepository;
    private final VeRepository veRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final PhimRepository phimRepository;
    private final LichChieuRepository lichChieuRepository;
    private final PhongChieuRepository phongChieuRepository;
    private final GheRepository gheRepository;
    private final ComboRepository comboRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequestDto request) {
        // 1. Resolve User
        NguoiDung user = nguoiDungRepository.findById(request.getUserEmail()).orElseGet(() -> {
            NguoiDung newUser = new NguoiDung();
            newUser.setMaNguoiDung(request.getUserEmail());
            newUser.setVaiTro(request.getUserEmail().contains("admin") ? "ADMIN" : "USER");
            return nguoiDungRepository.save(newUser);
        });

        // 2. Create HoaDon
        HoaDon hoaDon = new HoaDon();
        hoaDon.setMaHoaDon("HD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        hoaDon.setNguoiDung(user);
        hoaDon.setNgayLap(new Date());
        hoaDon.setTongTien(request.getTotalPrice());
        hoaDon.setTrangThaiThanhToan("PAID");
        hoaDon.setPhuongThucThanhToan("ONLINE");
        hoaDonRepository.save(hoaDon);

        // 3. Resolve PhongChieu and LichChieu
        PhongChieu phong = phongChieuRepository.findAll().stream()
                .filter(p -> p.getTenPhong().equals(request.getRoom()))
                .findFirst().orElseGet(() -> {
                    PhongChieu p = new PhongChieu();
                    p.setMaPhong("P" + System.currentTimeMillis());
                    p.setTenPhong(request.getRoom());
                    p.setSoLuongGhe(100);
                    return phongChieuRepository.save(p);
                });

        Phim phim = phimRepository.findById(request.getMovieId()).orElse(null);

        LichChieu lichChieu = new LichChieu();
        lichChieu.setMaLichChieu("LC" + System.currentTimeMillis());
        lichChieu.setPhim(phim);
        lichChieu.setPhongChieu(phong);
        // Note: Time parsing simplified for now
        lichChieu.setThoiGianBatDau(new Date()); 
        lichChieu.setTrangThai("OPEN");
        lichChieuRepository.save(lichChieu);

        // 4. Process Seats (Ve + ChiTietHoaDon)
        if (request.getSeats() != null) {
            for (CheckoutRequestDto.SeatDto seatDto : request.getSeats()) {
                Ghe ghe = gheRepository.findById(phong.getMaPhong() + "_" + seatDto.getId()).orElseGet(() -> {
                    Ghe g = new Ghe();
                    g.setMaGhe(phong.getMaPhong() + "_" + seatDto.getId());
                    g.setPhongChieu(phong);
                    g.setLoaiGhe("STANDARD");
                    return gheRepository.save(g);
                });

                Ve ve = new Ve();
                ve.setMaVe("V" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                ve.setLichChieu(lichChieu);
                ve.setGhe(ghe);
                ve.setNguoiDung(user);
                ve.setGiaVe(seatDto.getPrice());
                ve.setTrangThaiVe("SOLD");
                ve.setNgayDat(new Date());
                veRepository.save(ve);

                ChiTietHoaDon cthd = new ChiTietHoaDon();
                cthd.setMaChiTietHD("CT" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                cthd.setHoaDon(hoaDon);
                cthd.setVe(ve);
                cthd.setSoLuong(1);
                cthd.setThanhTien(seatDto.getPrice());
                chiTietHoaDonRepository.save(cthd);
            }
        }

        // 5. Process Combos (ChiTietHoaDon)
        if (request.getCombos() != null) {
            for (CheckoutRequestDto.ComboSelectionDto comboDto : request.getCombos()) {
                if (comboDto.getQuantity() > 0) {
                    Combo combo = comboRepository.findById(comboDto.getId()).orElse(null);
                    if (combo != null) {
                        ChiTietHoaDon cthd = new ChiTietHoaDon();
                        cthd.setMaChiTietHD("CT" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                        cthd.setHoaDon(hoaDon);
                        cthd.setCombo(combo);
                        cthd.setSoLuong(comboDto.getQuantity());
                        BigDecimal itemTotal = combo.getGiaCombo().multiply(BigDecimal.valueOf(comboDto.getQuantity()));
                        cthd.setThanhTien(itemTotal);
                        chiTietHoaDonRepository.save(cthd);
                    }
                }
            }
        }

        return ResponseEntity.ok(hoaDon);
    }
}