package com.cinema.api.service;

import com.cinema.api.dto.MovieDto;

import java.util.List;

public interface MovieService {
    MovieDto createMovie(MovieDto movieDto);
    MovieDto getMovieById(String id);
    List<MovieDto> getAllMovies();
    MovieDto updateMovie(String id, MovieDto movieDto);
    void deleteMovie(String id);
}
