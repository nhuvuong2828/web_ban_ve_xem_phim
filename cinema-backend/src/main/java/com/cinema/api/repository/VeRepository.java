package com.cinema.api.repository;
import com.cinema.api.entity.Ve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VeRepository extends JpaRepository<Ve, String> {
}