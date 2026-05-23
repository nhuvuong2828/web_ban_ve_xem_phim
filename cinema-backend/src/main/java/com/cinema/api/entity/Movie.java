package com.cinema.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "age_restriction")
    private Integer ageRestriction;

    @Column(name = "poster_url", columnDefinition = "VARCHAR(MAX)")
    private String posterUrl;

    @Column(name = "trailer_url", columnDefinition = "VARCHAR(MAX)")
    private String trailerUrl;

    @Column(length = 20)
    private String status;

    @Column(length = 100)
    private String genre;
}
