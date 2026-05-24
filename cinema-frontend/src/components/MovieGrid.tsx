import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Film } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  releaseDate: string;
  ageRestriction: number;
  posterUrl: string;
  trailerUrl: string;
  status: string;
}

const MovieGrid = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API từ Backend Spring Boot
    fetch('http://localhost:8080/api/v1/movies')
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải danh sách phim:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="section-container">
      <div className="recommendation-badge">
        <Flame size={18} /> API Connected
      </div>
      
      <div className="section-header">
        <h2 className="section-title">Latest Movies (From Database)</h2>
      </div>

      {loading ? (
        <div style={{ padding: '2rem 0', color: 'var(--text-muted)' }}>Đang tải dữ liệu từ Backend...</div>
      ) : movies.length === 0 ? (
        <div style={{ padding: '2rem 0', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Film size={24}/> Chưa có bộ phim nào trong CSDL. Hãy dùng Postman để thêm phim nhé!
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card" onClick={() => navigate('/movie/' + movie.id)}>
              {/* Nếu không có posterUrl thì dùng ảnh mặc định */}
              <img 
                src={movie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                alt={movie.title} 
              />
              <div className="movie-card-overlay">
                <h4 className="movie-card-title">{movie.title}</h4>
                <div className="movie-card-info">
                  <span className="match-score">{movie.durationMinutes} Phút</span>
                  <span>{movie.ageRestriction}+</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieGrid;
