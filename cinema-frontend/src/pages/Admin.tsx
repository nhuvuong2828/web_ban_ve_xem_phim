import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Ticket, PlusCircle, Clock, Activity } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ADD_MOVIE');
  const [movies, setMovies] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // States for forms
  const [formData, setFormData] = useState({
    title: '', description: '', durationMinutes: '', ageRestriction: '', posterUrl: '', status: 'NOW_SHOWING', genre: 'Hành Động'
  });
  const [stFormData, setStFormData] = useState({
    movieId: '', room: 'Phòng 1 (2D)', date: new Date().toISOString().split('T')[0], startTime: '19:00', endTime: '21:00'
  });
  const [msg, setMsg] = useState('');

  if (localStorage.getItem('role') !== 'ADMIN') {
    return <div style={{ paddingTop: '120px', textAlign: 'center' }}><h2>Access Denied. Admins Only.</h2><button onClick={() => navigate('/login')} className="btn-primary">Go to Login</button></div>;
  }

  useEffect(() => {
    if (activeTab === 'VIEW_MOVIES') {
      fetch('http://localhost:8080/api/v1/movies').then(res => res.json()).then(data => setMovies(data)).catch(console.error);
    } else if (activeTab === 'MANAGE_TICKETS') {
      setBookings(JSON.parse(localStorage.getItem('bookings') || '[]'));
    } else if (activeTab === 'MANAGE_SHOWTIMES') {
      setShowtimes(JSON.parse(localStorage.getItem('showtimes') || '[]'));
      fetch('http://localhost:8080/api/v1/movies').then(res => res.json()).then(data => {
        setMovies(data);
        if (data.length > 0) setStFormData(prev => ({...prev, movieId: data[0].id}));
      }).catch(console.error);
    } else if (activeTab === 'BEHAVIOR_HISTORY') {
      fetch('http://localhost:8080/api/v1/logs').then(res => res.json()).then(data => setHistoryLogs(data)).catch(console.error);
    } else if (activeTab === 'MANAGE_USERS') {
      fetch('http://localhost:8080/api/v1/users').then(res => res.json()).then(data => setUsers(data)).catch(console.error);
    }
  }, [activeTab]);

  const logAdminAction = (type: string, content: string) => {
    fetch('http://localhost:8080/api/v1/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'admin@cineflex.com', type, content })
    }).catch(console.error);
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Đang lưu...');
    try {
      const res = await fetch('http://localhost:8080/api/v1/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          durationMinutes: parseInt(formData.durationMinutes),
          ageRestriction: parseInt(formData.ageRestriction)
        })
      });
      if (res.ok) {
        setMsg('Thêm phim thành công rực rỡ! 🎉');
        setFormData({ title: '', description: '', durationMinutes: '', ageRestriction: '', posterUrl: '', status: 'NOW_SHOWING', genre: 'Hành Động' });
        logAdminAction('THÊM PHIM', `Admin đã xuất bản phim mới: ${formData.title}`);
      } else {
        const err = await res.json();
        setMsg('Lỗi: ' + (err.message || 'Dữ liệu không hợp lệ'));
      }
    } catch (error) {
      setMsg('Không thể kết nối đến máy chủ Backend.');
    }
  };

  const handleAddShowtime = (e: React.FormEvent) => {
    e.preventDefault();
    const newShowtime = {
      id: 'ST' + Math.random().toString(36).substring(7).toUpperCase(),
      status: 'OPEN',
      ...stFormData
    };
    const updated = [newShowtime, ...showtimes];
    localStorage.setItem('showtimes', JSON.stringify(updated));
    setShowtimes(updated);
    setMsg('Đã thêm lịch chiếu thành công!');
    setTimeout(() => setMsg(''), 3000);
    logAdminAction('TẠO SUẤT CHIẾU', `Admin tạo suất chiếu mới ở ${stFormData.room} lúc ${stFormData.startTime}`);
  };

  const handleToggleShowtimeStatus = (stId: string) => {
    const updated = showtimes.map(st => {
      if (st.id === stId) {
        return { ...st, status: st.status === 'CLOSED' ? 'OPEN' : 'CLOSED' };
      }
      return st;
    });
    localStorage.setItem('showtimes', JSON.stringify(updated));
    setShowtimes(updated);
    logAdminAction('SỬA SUẤT CHIẾU', `Admin đã thay đổi trạng thái Đóng/Mở của suất chiếu ${stId}`);
  };

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '50px', paddingLeft: '5%', paddingRight: '5%' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}><span className="gradient-text">Admin Dashboard</span></h2>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button className={`btn-tab ${activeTab === 'ADD_MOVIE' ? 'active' : ''}`} onClick={() => setActiveTab('ADD_MOVIE')}><PlusCircle size={18}/> Thêm Phim</button>
        <button className={`btn-tab ${activeTab === 'VIEW_MOVIES' ? 'active' : ''}`} onClick={() => setActiveTab('VIEW_MOVIES')}><Film size={18}/> Phim Đã Đăng</button>
        <button className={`btn-tab ${activeTab === 'MANAGE_SHOWTIMES' ? 'active' : ''}`} onClick={() => setActiveTab('MANAGE_SHOWTIMES')}><Clock size={18}/> Quản Lý Lịch Chiếu</button>
        <button className={`btn-tab ${activeTab === 'MANAGE_TICKETS' ? 'active' : ''}`} onClick={() => setActiveTab('MANAGE_TICKETS')}><Ticket size={18}/> Quản Lý Vé</button>
        <button className={`btn-tab ${activeTab === 'MANAGE_USERS' ? 'active' : ''}`} onClick={() => setActiveTab('MANAGE_USERS')}><Ticket size={18}/> Người Dùng</button>
        <button className={`btn-tab ${activeTab === 'BEHAVIOR_HISTORY' ? 'active' : ''}`} onClick={() => setActiveTab('BEHAVIOR_HISTORY')}><Activity size={18}/> Lịch Sử Hành Vi</button>
      </div>
      
      {/* Tab: Add Movie */}
      {activeTab === 'ADD_MOVIE' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Thêm Phim Mới</h3>
          {msg && <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', marginBottom: '1rem', borderRadius: '8px', color: '#00e5ff' }}>{msg}</div>}
          <form onSubmit={handleAddMovie} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input required type="text" placeholder="Tên phim (vd: Spider-Man)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={inputStyle} />
            <textarea placeholder="Mô tả phim" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: '100px'}} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input required type="number" placeholder="Thời lượng (Phút)" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: e.target.value})} style={inputStyle} />
              <input required type="number" placeholder="Độ tuổi (vd: 13, 18)" value={formData.ageRestriction} onChange={e => setFormData({...formData, ageRestriction: e.target.value})} style={inputStyle} />
              <select value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} style={inputStyle}>
                <option value="Hành Động">Hành Động</option>
                <option value="Hài Hước">Hài Hước</option>
                <option value="Kinh Dị">Kinh Dị</option>
                <option value="Tình Cảm">Tình Cảm</option>
                <option value="Hoạt Hình">Hoạt Hình</option>
                <option value="Sci-Fi">Sci-Fi</option>
              </select>
            </div>
            <input type="text" placeholder="Link ảnh Poster (URL)" value={formData.posterUrl} onChange={e => setFormData({...formData, posterUrl: e.target.value})} style={inputStyle} />
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={inputStyle}>
              <option value="NOW_SHOWING">Đang chiếu</option>
              <option value="COMING_SOON">Sắp chiếu</option>
            </select>
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>🚀 Đăng Phim Lên Hệ Thống</button>
          </form>
        </div>
      )}

      {/* Tab: View Movies */}
      {activeTab === 'VIEW_MOVIES' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Danh Sách Phim Hệ Thống ({movies.length})</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {movies.map(movie => (
              <div key={movie.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <div><strong>{movie.title}</strong><div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{movie.durationMinutes} Phút | {movie.genre || 'Chưa cập nhật'} | {movie.status}</div></div>
                <div style={{ color: '#00e5ff' }}>ID: {movie.id.substring(0, 8)}...</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Manage Showtimes */}
      {activeTab === 'MANAGE_SHOWTIMES' && (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Add Showtime Form */}
          <div className="glass-panel" style={{ padding: '2rem', flex: '1 1 400px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Tạo Lịch Chiếu Mới</h3>
            {msg && <div style={{ padding: '10px', background: 'rgba(70,211,105,0.2)', color: '#46d369', marginBottom: '1rem', borderRadius: '8px' }}>{msg}</div>}
            <form onSubmit={handleAddShowtime} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select required value={stFormData.movieId} onChange={e => setStFormData({...stFormData, movieId: e.target.value})} style={inputStyle}>
                {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
              <select required value={stFormData.room} onChange={e => setStFormData({...stFormData, room: e.target.value})} style={inputStyle}>
                <option value="Phòng 1 (2D)">Phòng 1 (2D)</option>
                <option value="Phòng 2 (3D)">Phòng 2 (3D)</option>
                <option value="Phòng 3 (IMAX)">Phòng 3 (IMAX)</option>
                <option value="Phòng 4 (Couple)">Phòng 4 (Couple)</option>
              </select>
              <input type="date" required value={stFormData.date} onChange={e => setStFormData({...stFormData, date: e.target.value})} style={inputStyle} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Giờ Bắt Đầu</label>
                  <input type="time" required value={stFormData.startTime} onChange={e => setStFormData({...stFormData, startTime: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Giờ Kết Thúc</label>
                  <input type="time" required value={stFormData.endTime} onChange={e => setStFormData({...stFormData, endTime: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}><Clock size={18}/> Thêm Lịch Chiếu</button>
            </form>
          </div>

          {/* List Showtimes */}
          <div className="glass-panel" style={{ padding: '2rem', flex: '2 1 500px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Lịch Chiếu Hệ Thống ({showtimes.length})</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {showtimes.map(st => {
                const m = movies.find(x => x.id === st.movieId);
                return (
                  <div key={st.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: `3px solid ${st.status === 'CLOSED' ? '#666' : 'var(--accent-primary)'}`, opacity: st.status === 'CLOSED' ? 0.6 : 1 }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem', color: st.status === 'CLOSED' ? '#999' : 'white' }}>{st.startTime} - {st.endTime} {st.status === 'CLOSED' && <span style={{fontSize: '0.8rem', color: '#e50914'}}>(Đã Đóng)</span>}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Phim: <span style={{ color: 'white' }}>{m ? m.title : st.movieId.substring(0,8)}</span></div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                      <div style={{ color: '#00e5ff' }}>{st.room}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{st.date}</div>
                      <button 
                        onClick={() => handleToggleShowtimeStatus(st.id)}
                        style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', border: 'none', cursor: 'pointer', background: st.status === 'CLOSED' ? 'var(--accent-primary)' : '#e50914', color: 'white' }}
                      >
                        {st.status === 'CLOSED' ? 'Mở Lại' : 'Đóng Lịch'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Manage Tickets */}
      {activeTab === 'MANAGE_TICKETS' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Tất Cả Vé Đã Đặt Trên Hệ Thống ({bookings.length})</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {bookings.map(booking => (
              <div key={booking.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: '3px solid var(--accent-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong>Mã Vé: {booking.id.toUpperCase()}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{booking.date}</span>
                </div>
                <div style={{ fontSize: '0.95rem' }}>Người đặt: <span style={{ color: '#00e5ff' }}>{booking.user}</span></div>
                <div style={{ fontSize: '0.95rem' }}>Phòng/Thời gian: <strong>{booking.room} | {booking.time}</strong></div>
                <div style={{ fontSize: '0.95rem' }}>Phim ID: {booking.movieId.substring(0,8)}...</div>
                <div style={{ fontSize: '0.95rem', color: '#00e5ff' }}>Ghế: <strong>{booking.seats.join(', ')}</strong></div>
                {booking.combos && booking.combos.length > 0 && (
                  <div style={{ fontSize: '0.9rem', color: '#46d369' }}>Bắp nước: {booking.combos.join(', ')}</div>
                )}
                <div style={{ fontSize: '0.95rem', marginTop: '5px' }}>Tổng doanh thu: <strong>{booking.totalPrice.toLocaleString()} VNĐ</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Behavior History */}
      {activeTab === 'BEHAVIOR_HISTORY' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Activity color="#46d369" /> Giám Sát Lịch Sử Hành Vi Hệ Thống (Log)</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Theo dõi mọi hành động của Quản trị viên và Khách hàng trên nền tảng (Thêm phim, Đặt vé,...)</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {historyLogs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Chưa có bản ghi lịch sử nào.</p>
            ) : (
              historyLogs.map(log => (
                <div key={log.id} style={{ display: 'flex', gap: '15px', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: log.user.includes('admin') ? '3px solid #f5c518' : '3px solid #00e5ff' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', minWidth: '160px' }}>{log.time}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
                      <strong style={{ color: log.user.includes('admin') ? '#f5c518' : '#00e5ff' }}>{log.user}</strong>
                      <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', color: '#fff' }}>{log.type}</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '0.95rem' }}>{log.content}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Manage Users */}
      {activeTab === 'MANAGE_USERS' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Quản Lý Người Dùng Hệ Thống ({users.length})</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {users.map(u => (
              <div key={u.maNguoiDung} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: u.vaiTro === 'ADMIN' ? '3px solid #f5c518' : '3px solid #00e5ff' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>{u.hoTen || u.maNguoiDung}</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email: <span style={{ color: 'white' }}>{u.email}</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: u.vaiTro === 'ADMIN' ? '#f5c518' : '#00e5ff', fontWeight: 'bold' }}>{u.vaiTro}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tham gia: {u.ngayDangKy ? new Date(u.ngayDangKy).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

const inputStyle = { padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1rem', width: '100%', boxSizing: 'border-box' as 'border-box' };

export default Admin;
