import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const username = role === 'ADMIN' ? 'Admin' : 'User';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-brand">
        CINE<span className="gradient-text">FLEX</span>
      </Link>
      
      <ul className="nav-links">
        {role !== 'ADMIN' && <li><Link to="/">Home</Link></li>}
        {role === 'ADMIN' && <li><Link to="/admin" className="gradient-text" style={{ fontWeight: 'bold' }}>Dashboard</Link></li>}
        {role === 'USER' && <li><Link to="/tickets">Vé Của Tôi</Link></li>}
        {role === 'USER' && <li><Link to="/invoices">Hoá Đơn</Link></li>}
        {role === 'USER' && <li><Link to="/foryou" style={{ color: 'var(--accent-primary)', fontWeight: 'bold', textShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}>Dành Cho Bạn ✨</Link></li>}
      </ul>

      <div className="nav-profile">
        <Search size={20} color="var(--text-muted)" style={{ cursor: 'pointer', marginRight: '10px' }} />
        
        {role ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Chào, <strong style={{ color: 'white' }}>{username}</strong></div>
            <div onClick={handleLogout} className="avatar" style={{ cursor: 'pointer', fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.1)', color: 'white', padding: '5px 10px', borderRadius: '20px' }}>Đăng xuất</div>
          </div>
        ) : (
          <Link to="/login" className="btn-primary" style={{ padding: '8px 16px' }}>Đăng nhập</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
