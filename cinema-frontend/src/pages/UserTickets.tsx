import React, { useState, useEffect } from 'react';
import { Ticket, X, QrCode } from 'lucide-react';

const UserTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    // Lấy thông tin user hiện tại
    const user = localStorage.getItem('role') === 'ADMIN' ? 'admin@cineflex.com' : 'user@cineflex.com';
    // Lấy lịch sử đặt vé từ LocalStorage
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    // Lọc vé theo user
    setTickets(allBookings.filter((b: any) => b.user === user));
  }, []);

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '50px', paddingLeft: '5%', paddingRight: '5%' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }} className="gradient-text">Vé Đã Đặt Của Tôi</h2>
      
      {tickets.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <Ticket size={48} color="var(--text-muted)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Bạn chưa đặt chiếc vé nào.</p>
          <p style={{ color: 'var(--text-muted)' }}>Hãy chọn cho mình một bộ phim và ra rạp ngay cuối tuần này nhé!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {tickets.map(ticket => (
            <div key={ticket.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <strong style={{ fontSize: '1.2rem' }}>Mã Vé: {ticket.id.toUpperCase()}</strong>
                <Ticket size={24} color="var(--accent-primary)" />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: 'white', marginBottom: '10px', fontSize: '1.1rem' }}>{ticket.room}</h4>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>Thời gian: <strong style={{ color: 'white' }}>{ticket.time}</strong></p>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>Phim ID: <span style={{ color: 'white' }}>{ticket.movieId.substring(0,8)}...</span></p>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>Ghế ngồi: <strong style={{ color: '#00e5ff', fontSize: '1.2rem' }}>{ticket.seats.join(', ')}</strong></p>
                  
                  {ticket.combos && ticket.combos.length > 0 && (
                    <div style={{ color: 'var(--text-muted)', marginBottom: '5px', fontSize: '0.9rem' }}>
                      Bắp nước mua kèm: 
                      <ul style={{ listStyle: 'circle', paddingLeft: '20px', color: '#46d369', marginTop: '3px' }}>
                        {ticket.combos.map((c: string, idx: number) => <li key={idx}>{c}</li>)}
                      </ul>
                    </div>
                  )}

                  <p style={{ color: 'var(--text-muted)', marginBottom: '5px', marginTop: '10px' }}>Tổng thanh toán: <strong style={{ color: 'white', fontSize: '1.2rem' }}>{ticket.totalPrice.toLocaleString()} VNĐ</strong></p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ padding: '8px', background: 'white', borderRadius: '8px' }}>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${ticket.id.toUpperCase()}`} alt="QR Code" style={{ display: 'block', width: '80px', height: '80px' }} />
                  </div>
                  <button onClick={() => setSelectedTicket(ticket)} style={{ marginTop: '10px', background: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}>
                    <QrCode size={14} /> Phóng to
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem' }}>
                Thời gian đặt: {ticket.date}
              </p>
              
              {/* Trang trí góc vé */}
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }}>
                <Ticket size={120} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {selectedTicket && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '100%', position: 'relative', textAlign: 'center' }}>
            <button onClick={() => setSelectedTicket(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            
            <h3 style={{ marginBottom: '5px', fontSize: '1.5rem' }}>Mã Soát Vé</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>Vui lòng đưa mã này cho nhân viên tại quầy kiểm soát</p>
            
            <div style={{ padding: '15px', background: 'white', borderRadius: '12px', display: 'inline-block', marginBottom: '20px' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${selectedTicket.id.toUpperCase()}`} alt="Large QR Code" style={{ display: 'block', width: '250px', height: '250px' }} />
            </div>
            
            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{selectedTicket.room}</h4>
            <p style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Ghế: <strong style={{ color: '#00e5ff' }}>{selectedTicket.seats.join(', ')}</strong></p>
            <p style={{ color: 'var(--text-muted)' }}>Thời gian: {selectedTicket.time}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTickets;
