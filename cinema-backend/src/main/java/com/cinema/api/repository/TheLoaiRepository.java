package com.cinema.api.repository;
import com.cinema.api.entity.TheLoai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface TheLoaiRepository extends JpaRepository<TheLoai, String> {
}
