package com.cinema.api.controller;

import com.cinema.api.entity.PhongChieu;
import com.cinema.api.repository.PhongChieuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PhongChieuController {

    private final PhongChieuRepository phongChieuRepository;

    @GetMapping
    public ResponseEntity<List<PhongChieu>> getAllRooms() {
        return ResponseEntity.ok(phongChieuRepository.findAll());
    }
}
