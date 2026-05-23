package com.cinema.api.service.impl;

import com.cinema.api.dto.MovieDto;
import com.cinema.api.entity.Phim;
import com.cinema.api.entity.TheLoai;
import com.cinema.api.exception.ResourceNotFoundException;
import com.cinema.api.repository.PhimRepository;
import com.cinema.api.repository.TheLoaiRepository;
import com.cinema.api.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final PhimRepository phimRepository;
    private final TheLoaiRepository theLoaiRepository;

    @Override
    public MovieDto createMovie(MovieDto movieDto) {
        Phim phim = mapToEntity(movieDto);
        if (movieDto.getId() == null || movieDto.getId().isEmpty()) {
            phim.setMaPhim(UUID.randomUUID().toString());
        } else {
            phim.setMaPhim(movieDto.getId());
        }
        Phim newPhim = phimRepository.save(phim);
        return mapToDTO(newPhim);
    }

    @Override
    public MovieDto getMovieById(String id) {
        Phim phim = phimRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Phim", "id", id));
        return mapToDTO(phim);
    }

    @Override
    public List<MovieDto> getAllMovies() {
        List<Phim> phims = phimRepository.findAll();
        return phims.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public MovieDto updateMovie(String id, MovieDto movieDto) {
        Phim phim = phimRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Phim", "id", id));

        phim.setTenPhim(movieDto.getTitle());
        phim.setMoTa(movieDto.getDescription());
        phim.setThoiLuong(movieDto.getDurationMinutes());
        if (movieDto.getReleaseDate() != null) {
            phim.setNgayKhoiChieu(java.sql.Date.valueOf(movieDto.getReleaseDate()));
        }
        phim.setDoTuoiGioiHan(movieDto.getAgeRestriction());
        phim.setPoster(movieDto.getPosterUrl());
        phim.setTrailer(movieDto.getTrailerUrl());
        phim.setTrangThai(movieDto.getStatus());
        
        if (movieDto.getGenre() != null && !movieDto.getGenre().isEmpty()) {
            TheLoai tl = theLoaiRepository.findAll().stream()
                .filter(t -> t.getTenTheLoai().equalsIgnoreCase(movieDto.getGenre()))
                .findFirst().orElse(null);
            phim.setTheLoai(tl);
        }

        Phim updatedPhim = phimRepository.save(phim);
        return mapToDTO(updatedPhim);
    }

    @Override
    public void deleteMovie(String id) {
        Phim phim = phimRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Phim", "id", id));
        phimRepository.delete(phim);
    }

    private MovieDto mapToDTO(Phim phim) {
        return MovieDto.builder()
                .id(phim.getMaPhim())
                .title(phim.getTenPhim())
                .description(phim.getMoTa())
                .durationMinutes(phim.getThoiLuong())
                .releaseDate(phim.getNgayKhoiChieu() != null ? new java.sql.Date(phim.getNgayKhoiChieu().getTime()).toLocalDate() : null)
                .ageRestriction(phim.getDoTuoiGioiHan())
                .posterUrl(phim.getPoster())
                .trailerUrl(phim.getTrailer())
                .status(phim.getTrangThai())
                .genre(phim.getTheLoai() != null ? phim.getTheLoai().getTenTheLoai() : "")
                .build();
    }

    private Phim mapToEntity(MovieDto movieDto) {
        Phim phim = new Phim();
        phim.setMaPhim(movieDto.getId());
        phim.setTenPhim(movieDto.getTitle());
        phim.setMoTa(movieDto.getDescription());
        phim.setThoiLuong(movieDto.getDurationMinutes());
        if (movieDto.getReleaseDate() != null) {
            phim.setNgayKhoiChieu(java.sql.Date.valueOf(movieDto.getReleaseDate()));
        }
        phim.setDoTuoiGioiHan(movieDto.getAgeRestriction());
        phim.setPoster(movieDto.getPosterUrl());
        phim.setTrailer(movieDto.getTrailerUrl());
        phim.setTrangThai(movieDto.getStatus());
        
        if (movieDto.getGenre() != null && !movieDto.getGenre().isEmpty()) {
            TheLoai tl = theLoaiRepository.findAll().stream()
                .filter(t -> t.getTenTheLoai().equalsIgnoreCase(movieDto.getGenre()))
                .findFirst().orElse(null);
            phim.setTheLoai(tl);
        }
        return phim;
    }
}
