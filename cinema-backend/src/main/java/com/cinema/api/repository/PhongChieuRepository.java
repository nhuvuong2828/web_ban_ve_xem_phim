package com.cinema.api.repository;
import com.cinema.api.entity.PhongChieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface PhongChieuRepository extends JpaRepository<PhongChieu, String> {
}
