package com.cinema.api.controller;
import com.cinema.api.dto.LogDto;
import com.cinema.api.entity.LichSuHanhVi;
import com.cinema.api.entity.NguoiDung;
import com.cinema.api.repository.LichSuHanhViRepository;
import com.cinema.api.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LichSuHanhViController {
    private final LichSuHanhViRepository lichSuHanhViRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @GetMapping
    public ResponseEntity<List<LogDto>> getAllLogs() {
        List<LogDto> logs = lichSuHanhViRepository.findAllByOrderByThoiGianDesc().stream().map(log -> {
            LogDto dto = new LogDto();
            dto.setId(log.getMaHanhVi());
            dto.setUser(log.getNguoiDung() != null ? log.getNguoiDung().getMaNguoiDung() : "Unknown");
            dto.setType(log.getLoaiHanhVi());
            dto.setContent(log.getNoiDung());
            dto.setTime(log.getThoiGian() != null ? log.getThoiGian().toString() : "");
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(logs);
    }

    @PostMapping
    public ResponseEntity<String> createLog(@RequestBody LogDto logDto) {
        LichSuHanhVi log = new LichSuHanhVi();
        log.setMaHanhVi(logDto.getId() != null ? logDto.getId() : "LOG" + System.currentTimeMillis());
        log.setLoaiHanhVi(logDto.getType());
        log.setNoiDung(logDto.getContent());
        log.setThoiGian(new Date());

        NguoiDung user = nguoiDungRepository.findById(logDto.getUser()).orElse(null);
        if (user == null && logDto.getUser().equals("admin@cineflex.com")) {
             user = new NguoiDung();
             user.setMaNguoiDung("admin@cineflex.com");
             user.setVaiTro("ADMIN");
             nguoiDungRepository.save(user);
        } else if (user == null && logDto.getUser().equals("user@cineflex.com")) {
             user = new NguoiDung();
             user.setMaNguoiDung("user@cineflex.com");
             user.setVaiTro("USER");
             nguoiDungRepository.save(user);
        }
        
        log.setNguoiDung(user);
        lichSuHanhViRepository.save(log);
        return ResponseEntity.ok("Log saved");
    }
}