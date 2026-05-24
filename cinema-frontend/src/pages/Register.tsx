import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [gioiTinh, setGioiTinh] = useState('Nam');
  const [diaChi, setDiaChi] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('Đang đăng ký...');

    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: hoTen, phone: soDienThoai, dob: ngaySinh, gender: gioiTinh, address: diaChi, role: 'USER' })
      });

      if (res.ok) {
        setMsg('Đăng ký thành công! Đang chuyển hướng...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        const errText = await res.text();
        setError('Lỗi: ' + errText);
        setMsg('');
      }
    } catch (error) {
      setError('Không thể kết nối đến máy chủ Backend.');
      setMsg('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', backgroundImage: 'url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba)', backgroundSize: 'cover' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Tạo Tài Khoản</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Gia nhập thế giới CineFlex ngay hôm nay</p>
        
        {error && <div style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>{error}</div>}
        {msg && <div style={{ color: '#00e5ff', marginBottom: '1rem' }}>{msg}</div>}
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Họ và Tên" 
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '1rem' }}
            required
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '1rem' }}
            required
          />
          <input 
            type="text" 
            placeholder="Số điện thoại" 
            value={soDienThoai}
            onChange={(e) => setSoDienThoai(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '1rem' }}
            required
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="date" 
              value={ngaySinh}
              onChange={(e) => setNgaySinh(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '1rem' }}
            />
            <select 
              value={gioiTinh}
              onChange={(e) => setGioiTinh(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '1rem' }}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <input 
            type="text" 
            placeholder="Địa chỉ" 
            value={diaChi}
            onChange={(e) => setDiaChi(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '1rem' }}
          />
          <input 
            type="password" 
            placeholder="Password (ít nhất 6 ký tự)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '1rem' }}
            required
          />
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Đăng Ký Ngay</button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: '#00e5ff', textDecoration: 'underline' }}>Đăng nhập tại đây</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
