package com.cinema.api.repository;
import com.cinema.api.entity.Ghe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GheRepository extends JpaRepository<Ghe, String> {
}