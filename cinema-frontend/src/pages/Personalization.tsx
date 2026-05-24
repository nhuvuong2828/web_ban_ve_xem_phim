import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Gift, Film, TrendingUp, Award } from 'lucide-react';

const Personalization = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ ticketCount: 0, comboCount: 0, totalSpent: 0 });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [voucher, setVoucher] = useState<{title: string, desc: string, code: string} | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role) {
      navigate('/login');
      return;
    }

    const userEmail = role === 'ADMIN' ? 'admin@cineflex.com' : 'user@cineflex.com';
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const userBookings = allBookings.filter((b: any) => b.user === userEmail);

    let tCount = 0;
    let cCount = 0;
    let spent = 0;
    const watchedIds = new Set();

    userBookings.forEach((b: any) => {
      tCount += b.seats ? b.seats.length : 0;
      cCount += b.combos ? b.combos.length : 0;
      spent += b.totalPrice || 0;
      watchedIds.add(b.movieId);
    });

    setStats({ ticketCount: tCount, comboCount: cCount, totalSpent: spent });

    // Thuật toán gán quà tặng
    if (cCount > 0) {
      setVoucher({ title: 'Khách hàng Sành ăn', desc: 'Hệ thống nhận thấy bạn rất thích Bắp Nước. Tặng bạn mã giảm 50% ăn uống cho lần sau!', code: 'POPCORN50' });
    } else if (tCount > 0) {
      setVoucher({ title: 'Mở Khoá Trải Nghiệm Mới', desc: 'Lần trước bạn chưa thử Combo giải khát. Thử ngay hôm nay với mã giảm 30%!', code: 'TRYME30' });
    } else {
      setVoucher({ title: 'Quà Tặng Bạn Mới', desc: 'Chào mừng gia nhập CineFlex. Nhập mã này khi đặt vé để được giảm giá nhé!', code: 'WELCOME' });
    }

    // AI Recommend phim theo thể loại (Genre)
    fetch('http://localhost:8080/api/v1/movies')
      .then(res => res.json())
      .then(movies => {
        // Phân tích thể loại yêu thích nhất
        const genreCounts: Record<string, number> = {};
        userBookings.forEach((b: any) => {
          const m = movies.find((x: any) => x.id === b.movieId);
          if (m && m.genre) {
            genreCounts[m.genre] = (genreCounts[m.genre] || 0) + 1;
          }
        });

        let topGenre = '';
        let maxCount = 0;
        Object.entries(genreCounts).forEach(([genre, count]) => {
          if (count > maxCount) {
            maxCount = count;
            topGenre = genre;
          }
        });

        // Lọc phim
        let unwatched = movies.filter((m: any) => !watchedIds.has(m.id));
        
        // Nếu có top genre, ưu tiên hiển thị phim cùng thể loại đó lên đầu
        if (topGenre && unwatched.length > 0) {
          const sameGenre = unwatched.filter((m: any) => m.genre === topGenre);
          const others = unwatched.filter((m: any) => m.genre !== topGenre);
          unwatched = [...sameGenre, ...others];
        }

        setRecommendations(unwatched.length > 0 ? unwatched : movies);
      })
      .catch(console.error);

  }, [navigate]);

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '50px', paddingLeft: '5%', paddingRight: '5%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
        <Sparkles size={40} color="var(--accent-primary)" />
        <h2 style={{ fontSize: '2.5rem' }} className="gradient-text">Không Gian Cá Nhân Hoá</h2>
      </div>

      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
        Chào mừng trở lại! Đây là bảng tổng hợp thói quen xem phim và những ưu đãi được hệ thống AI của CineFlex may đo dành riêng cho bạn.
      </p>

      {/* Thống kê */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
        <div className="glass-panel" style={{ flex: '1 1 200px', padding: '2rem', textAlign: 'center', borderTop: '3px solid #00e5ff' }}>
          <Film size={32} color="#00e5ff" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stats.ticketCount}</h3>
          <p style={{ color: 'var(--text-muted)' }}>Chiếc vé đã đặt</p>
        </div>
        <div className="glass-panel" style={{ flex: '1 1 200px', padding: '2rem', textAlign: 'center', borderTop: '3px solid #46d369' }}>
          <Award size={32} color="#46d369" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stats.comboCount}</h3>
          <p style={{ color: 'var(--text-muted)' }}>Combo bắp nước</p>
        </div>
        <div className="glass-panel" style={{ flex: '1 1 200px', padding: '2rem', textAlign: 'center', borderTop: '3px solid #e50914' }}>
          <TrendingUp size={32} color="#e50914" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{(stats.totalSpent / 1000).toLocaleString()}k</h3>
          <p style={{ color: 'var(--text-muted)' }}>Tổng chi tiêu (VNĐ)</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        {/* Khuyến mãi */}
        <div style={{ flex: '1 1 350px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Gift color="#f5c518" /> Quà Tặng Độc Quyền</h3>
          {voucher && (
            <div style={{ background: 'linear-gradient(135deg, rgba(245, 197, 24, 0.15), rgba(229, 9, 20, 0.15))', padding: '3rem 2rem', borderRadius: '16px', border: '1px dashed rgba(245, 197, 24, 0.5)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <Gift size={64} color="#f5c518" style={{ margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#f5c518' }}>{voucher.title}</h4>
              <p style={{ color: '#ddd', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>{voucher.desc}</p>
              <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.6)', padding: '15px 30px', borderRadius: '8px', fontSize: '1.5rem', fontWeight: 'bold', color: '#00e5ff', letterSpacing: '4px', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
                {voucher.code}
              </div>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.05 }}><Gift size={200} /></div>
            </div>
          )}
        </div>

        {/* Phim gợi ý */}
        <div style={{ flex: '2 1 500px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Sparkles color="var(--accent-primary)" /> Đề Xuất Phim Theo Thể Loại</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Dựa trên các bộ phim bạn đã xem, chúng tôi nhận thấy bạn thích những tựa phim cùng gu, hãy thử xem:</p>
          <div className="movie-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {recommendations.slice(0, 4).map(movie => (
              <div key={movie.id} className="movie-card" onClick={() => navigate('/movie/' + movie.id)}>
                <img 
                  src={movie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                  alt={movie.title}
                  style={{ height: '250px' }}
                />
                <div className="movie-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="movie-tag">{movie.genre || 'Phim rạp'}</span>
                    <span className="movie-rating">{movie.ageRestriction}+</span>
                  </div>
                  <h3 className="movie-title">{movie.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Personalization;
