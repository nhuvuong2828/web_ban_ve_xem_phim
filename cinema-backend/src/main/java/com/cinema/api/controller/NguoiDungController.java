package com.cinema.api.controller;

import com.cinema.api.entity.NguoiDung;
import com.cinema.api.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NguoiDungController {

    private final NguoiDungRepository nguoiDungRepository;

    @GetMapping
    public ResponseEntity<List<NguoiDung>> getAllUsers() {
        return ResponseEntity.ok(nguoiDungRepository.findAll());
    }
}
