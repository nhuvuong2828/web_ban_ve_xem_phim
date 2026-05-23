package com.cinema.api.repository;
import com.cinema.api.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, String> {
}
