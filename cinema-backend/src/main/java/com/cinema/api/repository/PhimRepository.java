package com.cinema.api.repository;
import com.cinema.api.entity.Phim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface PhimRepository extends JpaRepository<Phim, String> {
}
