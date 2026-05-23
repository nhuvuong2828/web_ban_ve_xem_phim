package com.cinema.api.repository;
import com.cinema.api.entity.LichSuHanhVi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LichSuHanhViRepository extends JpaRepository<LichSuHanhVi, String> {
    List<LichSuHanhVi> findAllByOrderByThoiGianDesc();
}