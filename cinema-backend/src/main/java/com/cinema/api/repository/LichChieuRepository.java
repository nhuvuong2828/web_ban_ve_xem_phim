package com.cinema.api.repository;
import com.cinema.api.entity.LichChieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LichChieuRepository extends JpaRepository<LichChieu, String> {
}