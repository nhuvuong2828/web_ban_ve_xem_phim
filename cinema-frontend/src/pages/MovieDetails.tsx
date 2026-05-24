import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Ticket, Clock, AlertCircle } from 'lucide-react';

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
  genre: string;
}

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showtimes, setShowtimes] = useState<any[]>([]);

  useEffect(() => {
    // Load from DB (API)
    fetch(`http://localhost:8080/api/v1/movies/${id}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Load Showtimes dynamically
    const allShowtimes = JSON.parse(localStorage.getItem('showtimes') || '[]');
    const filtered = allShowtimes.filter((st: any) => st.movieId === id);
    setShowtimes(filtered);

  }, [id]);

  if (loading) {
    return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Đang tải thông tin phim...</div>;
  }

  if (!movie) {
    return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Không tìm thấy bộ phim này!</div>;
  }

  return (
    <div style={{ paddingBottom: '50px' }}>
      {/* Banner */}
      <div style={{ position: 'relative', width: '100%', height: '60vh' }}>
        <img 
          src={movie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1"} 
          alt={movie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, var(--bg-dark) 0%, rgba(7,7,10,0.5) 50%, transparent 100%)' }}></div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 5%', marginTop: '-100px', position: 'relative', zIndex: 10, display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        
        {/* Left: Poster small */}
        <div style={{ flex: '0 0 250px' }}>
          <img 
            src={movie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"} 
            alt={movie.title}
            style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', border: '1px solid var(--glass-border)' }}
          />
        </div>

        {/* Right: Info */}
        <div style={{ flex: '1 1 500px', paddingTop: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={14} /> {movie.durationMinutes} Phút
            </span>
            <span style={{ padding: '4px 10px', background: 'var(--accent-primary)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {movie.ageRestriction}+
            </span>
            {movie.genre && (
              <span style={{ padding: '4px 10px', border: '1px solid #f5c518', color: '#f5c518', borderRadius: '4px', fontSize: '0.8rem' }}>
                {movie.genre}
              </span>
            )}
            <span style={{ padding: '4px 10px', background: 'rgba(0, 229, 255, 0.2)', color: '#00e5ff', borderRadius: '4px', fontSize: '0.8rem' }}>
              {movie.status === 'NOW_SHOWING' ? 'Đang Chiếu' : 'Sắp Chiếu'}
            </span>
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>{movie.title}</h1>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            {movie.description || "Chưa có mô tả cho bộ phim này."}
          </p>

          {/* Showtimes Selection */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={20} /> Lịch Chiếu (Dynamic)</h3>
            {showtimes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa có lịch chiếu nào cho bộ phim này. Vui lòng quay lại sau (hoặc dùng tài khoản Admin để thêm).</p>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {showtimes.map(st => (
                  <button 
                    key={st.id}
                    onClick={() => st.status !== 'CLOSED' && navigate(`/book/${movie.id}/${st.id}`)}
                    className="btn-primary" 
                    style={{ padding: '10px 20px', background: st.status === 'CLOSED' ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.1)', border: `1px solid ${st.status === 'CLOSED' ? '#444' : 'var(--accent-primary)'}`, color: st.status === 'CLOSED' ? '#666' : 'white', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px', boxShadow: 'none', cursor: st.status === 'CLOSED' ? 'not-allowed' : 'pointer' }}
                    disabled={st.status === 'CLOSED'}
                  >
                    <strong style={{ fontSize: '1.1rem', color: st.status === 'CLOSED' ? '#666' : 'var(--accent-primary)' }}>{st.startTime} - {st.endTime}</strong>
                    <span style={{ fontSize: '0.8rem', color: st.status === 'CLOSED' ? '#555' : '#ccc' }}>
                      {st.room} | {st.date} {st.status === 'CLOSED' && <span style={{ color: '#e50914', marginLeft: '5px' }}>(Đã Đóng)</span>}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-icon" style={{ width: '56px', height: '56px' }}>
              <Play size={24} fill="currentColor" />
            </button>
          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--accent-secondary)' }}>
            <AlertCircle size={24} color="var(--accent-secondary)" />
            <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Lưu ý: Bạn chỉ được đặt tối đa 4 vé trong một giao dịch để đảm bảo quyền lợi cho mọi khách hàng. Vui lòng chọn ghế cẩn thận.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
