package com.cinema.api.controller;

import com.cinema.api.entity.NguoiDung;
import com.cinema.api.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.text.SimpleDateFormat;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;
    
    // Đăng ký tài khoản (Tự động cấp token giả lập)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        if(nguoiDungRepository.findById(request.get("email")).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        NguoiDung user = new NguoiDung();
        user.setMaNguoiDung(request.get("email"));
        user.setEmail(request.get("email"));
        user.setHoTen(request.getOrDefault("name", "Người Dùng Mới"));
        user.setSoDienThoai(request.get("phone"));
        user.setGioiTinh(request.get("gender"));
        user.setDiaChi(request.get("address"));
        
        try {
            if (request.get("dob") != null && !request.get("dob").isEmpty()) {
                user.setNgaySinh(new SimpleDateFormat("yyyy-MM-dd").parse(request.get("dob")));
            }
        } catch (Exception e) {
            // ignore date parse error
        }
        
        user.setMatKhau(passwordEncoder.encode(request.get("password")));
        user.setVaiTro(request.getOrDefault("role", "USER"));
        user.setNgayDangKy(new java.util.Date());
        nguoiDungRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("token", "dummy-jwt-token-for-" + user.getEmail());
        response.put("role", user.getVaiTro());
        return ResponseEntity.ok(response);
    }

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        NguoiDung user = nguoiDungRepository.findById(request.get("email"))
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        if (!passwordEncoder.matches(request.get("password"), user.getMatKhau()) && !request.get("password").equals(user.getMatKhau())) {
            // Support both encoded and plain passwords for legacy seeded data
            return ResponseEntity.status(401).body("Wrong password");
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("token", "dummy-jwt-token-for-" + user.getEmail());
        response.put("role", user.getVaiTro());
        return ResponseEntity.ok(response);
    }
}
