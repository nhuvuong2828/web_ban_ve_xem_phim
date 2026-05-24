import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle } from 'lucide-react';

const BASE_PRICE = 85000;

const getSeatPrice = (type: string) => {
  if (type === 'VIP') return BASE_PRICE + 15000; // 100k
  if (type === 'COUPLE') return BASE_PRICE * 2 + 20000; // 190k
  return BASE_PRICE;
};

const getSeatLabel = (type: string) => {
  if (type === 'VIP') return 'VIP';
  if (type === 'COUPLE') return 'Ghế Đôi';
  return 'Thường';
};

const COMBOS = [
  { id: 'C1', name: 'Combo Single (1 Bắp + 1 Nước)', price: 75000, img: '🍿🥤' },
  { id: 'C2', name: 'Combo Couple (1 Bắp to + 2 Nước)', price: 120000, img: '🍿🥤🥤' },
  { id: 'C3', name: 'Combo Family (2 Bắp to + 4 Nước)', price: 210000, img: '🍿🍿🥤🥤🥤🥤' },
];

const SeatSelection = () => {
  const { movieId, showtimeId } = useParams();
  const navigate = useNavigate();
  
  // Read dynamic showtime from localStorage
  const allShowtimes = JSON.parse(localStorage.getItem('showtimes') || '[]');
  const currentShowtime = allShowtimes.find((s: any) => s.id === showtimeId) || { room: 'Phòng Mặc Định', startTime: '??:??', endTime: '??:??' };
  
  const [selectedSeats, setSelectedSeats] = useState<{id: string, type: string, price: number}[]>([]);
  const [selectedCombos, setSelectedCombos] = useState<{ [key: string]: number }>({});
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Load booked seats from actual bookings for this specific showtime
  const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const relevantBookings = allBookings.filter((b: any) => b.movieId === movieId && b.time === `${currentShowtime.startTime} - ${currentShowtime.endTime}`);
  const bookedSeatIds = relevantBookings.flatMap((b: any) => b.seats);

  // Generate real-time seat map
  const layout = [
    { row: 'A', cols: 8, type: 'STANDARD' },
    { row: 'B', cols: 8, type: 'STANDARD' },
    { row: 'C', cols: 8, type: 'VIP' },
    { row: 'D', cols: 8, type: 'VIP' },
    { row: 'E', cols: 4, type: 'COUPLE' }
  ];

  const roomSeats = layout.map(r => {
    return Array.from({ length: r.cols }, (_, i) => {
      const seatId = `${r.row}${i + 1}`;
      return {
        id: seatId,
        number: i + 1,
        type: r.type,
        name: seatId,
        // Mark as occupied if it exists in any booked tickets for this showtime
        isOccupied: bookedSeatIds.includes(seatId)
      };
    });
  });

  const totalSeatsInRoom = roomSeats.reduce((acc, row) => acc + row.length, 0);

  const handleSeatClick = (seatId: string, isOccupied: boolean, type: string) => {
    if (isOccupied) return;
    
    if (selectedSeats.find(s => s.id === seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
    } else {
      if (selectedSeats.length < 4) {
        setSelectedSeats([...selectedSeats, { id: seatId, type, price: getSeatPrice(type) }]);
      } else {
        alert("Bạn chỉ được chọn tối đa 4 vé mỗi lần!");
      }
    }
  };

  const handleComboChange = (comboId: string, delta: number) => {
    setSelectedCombos(prev => {
      const current = prev[comboId] || 0;
      const next = current + delta;
      if (next < 0) return prev;
      return { ...prev, [comboId]: next };
    });
  };

  const totalSeatPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const totalComboPrice = COMBOS.reduce((acc, combo) => acc + (combo.price * (selectedCombos[combo.id] || 0)), 0);
  const totalPrice = totalSeatPrice + totalComboPrice;

  const handleCheckout = () => {
    if (selectedSeats.length === 0) return;
    setBookingStatus('loading');
    setTimeout(() => {
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const comboTextArray = COMBOS.map(c => selectedCombos[c.id] > 0 ? `${c.name} x${selectedCombos[c.id]}` : null).filter(Boolean);

      const invoiceDetails = [
        ...selectedSeats.map(s => ({
          name: `Vé - Ghế ${s.id} (${getSeatLabel(s.type)})`,
          quantity: 1,
          unitPrice: s.price,
          total: s.price
        })),
        ...COMBOS.filter(c => selectedCombos[c.id] > 0).map(c => ({
          name: c.name,
          quantity: selectedCombos[c.id],
          unitPrice: c.price,
          total: c.price * selectedCombos[c.id]
        }))
      ];

      const newBooking = {
        id: Math.random().toString(36).substring(7),
        movieId: movieId,
        room: currentShowtime.room,
        time: `${currentShowtime.startTime} - ${currentShowtime.endTime}`,
        seats: selectedSeats.map(s => s.id),
        combos: comboTextArray,
        totalPrice: totalPrice,
        date: new Date().toLocaleString(),
        user: localStorage.getItem('role') === 'ADMIN' ? 'admin@cineflex.com' : 'user@cineflex.com',
        details: invoiceDetails
      };

      // 1. Send data to Backend API to save to DB (HoaDon, Ve, ChiTietHoaDon)
      const checkoutPayload = {
        userEmail: newBooking.user,
        movieId: movieId,
        room: currentShowtime.room,
        time: newBooking.time,
        seats: selectedSeats.map(s => ({ id: s.id, price: s.price })),
        combos: COMBOS.map(c => ({ id: c.id, quantity: selectedCombos[c.id] || 0 })),
        totalPrice: totalPrice
      };

      fetch('http://localhost:8080/api/v1/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutPayload)
      }).catch(console.error);

      // 2. Save locally for UI state
      localStorage.setItem('bookings', JSON.stringify([newBooking, ...existingBookings]));

      // 3. Log behavior history
      fetch('http://localhost:8080/api/v1/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user: newBooking.user, 
          type: 'ĐẶT VÉ', 
          content: `Khách hàng đã thanh toán thành công hóa đơn ${newBooking.id} (Trị giá: ${totalPrice.toLocaleString()}đ)` 
        })
      }).catch(console.error);

      setBookingStatus('success');
    }, 1500);
  };

  if (bookingStatus === 'success') {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', minHeight: '80vh' }}>
        <CheckCircle size={80} color="#00e5ff" style={{ margin: '0 auto', marginBottom: '2rem' }} />
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="gradient-text">Đặt Vé & Bắp Nước Thành Công!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Bạn đã đặt các ghế: <strong>{selectedSeats.map(s => s.id).join(', ')}</strong></p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Tổng thanh toán: <strong>{totalPrice.toLocaleString()} VNĐ</strong></p>
        <button className="btn-primary" onClick={() => navigate('/tickets')}>Xem vé của tôi</button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '50px', paddingLeft: '5%', paddingRight: '5%', display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
      
      {/* Sơ đồ ghế và Bắp nước */}
      <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Sơ đồ ghế */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }}>{currentShowtime.room}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Thời gian: {currentShowtime.startTime} - {currentShowtime.endTime}</p>
            <p style={{ color: '#00e5ff', fontSize: '0.9rem', marginTop: '5px' }}>Tổng số ghế: {totalSeatsInRoom} ghế</p>
          </div>
          <div className="screen">MÀN HÌNH CHÍNH</div>
          <div className="seat-map">
            {roomSeats.map((row, rowIndex) => (
              <div key={rowIndex} className="seat-row" style={{ justifyContent: 'center', width: '100%' }}>
                <div style={{ width: '30px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>{String.fromCharCode(65 + rowIndex)}</div>
                {row.map(seat => (
                  <div 
                    key={seat.id}
                    className={`seat ${seat.type.toLowerCase()} ${seat.isOccupied ? 'occupied' : ''} ${selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''}`}
                    onClick={() => handleSeatClick(seat.id, seat.isOccupied, seat.type)}
                    title={seat.isOccupied ? `Ghế ${seat.name} - Đã bán` : `Ghế ${seat.name} - ${getSeatLabel(seat.type)} - ${getSeatPrice(seat.type).toLocaleString()}đ`}
                  >
                    <span className="seat-name">{seat.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', color: 'var(--text-muted)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="seat" style={{ width: '25px', height: '25px' }}></div> Thường (85k)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="seat vip" style={{ width: '25px', height: '25px' }}></div> VIP (100k)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="seat couple" style={{ width: '50px', height: '25px', fontSize: '12px' }}>❤</div> Đôi (190k)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="seat occupied" style={{ width: '25px', height: '25px' }}></div> Đã Bán</div>
          </div>
        </div>

        {/* Combo Bắp Nước */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Thêm Bắp Nước (Combos)</h3>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {COMBOS.map(combo => (
              <div key={combo.id} style={{ flex: '1 1 200px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>{combo.img}</div>
                <h4 style={{ marginBottom: '0.5rem', textAlign: 'center', fontSize: '1rem' }}>{combo.name}</h4>
                <div style={{ color: '#46d369', fontWeight: 'bold', marginBottom: '1.5rem', fontSize: '1.1rem' }}>{combo.price.toLocaleString()} VNĐ</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.4)', padding: '5px', borderRadius: '30px' }}>
                  <button 
                    onClick={() => handleComboChange(combo.id, -1)}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--glass-bg)', color: 'white', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                  <span style={{ width: '25px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedCombos[combo.id] || 0}</span>
                  <button 
                    onClick={() => handleComboChange(combo.id, 1)}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--accent-primary)', color: 'white', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Box Thanh Toán */}
      <div className="glass-panel" style={{ flex: '1 1 350px', padding: '2rem', height: 'fit-content', position: 'sticky', top: '100px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Chi Tiết Thanh Toán</h3>
        
        {/* Vé */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Vé Xem Phim</h4>
          {selectedSeats.length === 0 ? (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chưa chọn ghế</span>
          ) : (
            selectedSeats.map(seat => (
              <div key={seat.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ghế {seat.id} ({getSeatLabel(seat.type)})</span>
                <strong style={{ color: 'white' }}>{seat.price.toLocaleString()} đ</strong>
              </div>
            ))
          )}
          {selectedSeats.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '5px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cộng vé:</span>
              <strong style={{ color: '#e50914' }}>{totalSeatPrice.toLocaleString()} đ</strong>
            </div>
          )}
        </div>

        {/* Bắp nước */}
        {totalComboPrice > 0 && (
          <div style={{ marginBottom: '1.5rem', borderTop: '1px dashed var(--glass-border)', paddingTop: '1rem' }}>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Bắp Nước</h4>
            {COMBOS.map(combo => selectedCombos[combo.id] > 0 && (
              <div key={combo.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{combo.name} x{selectedCombos[combo.id]}</span>
                <strong style={{ color: 'white' }}>{(combo.price * selectedCombos[combo.id]).toLocaleString()} đ</strong>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '5px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cộng bắp nước:</span>
              <strong style={{ color: '#e50914' }}>{totalComboPrice.toLocaleString()} đ</strong>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2rem 0', fontSize: '1.4rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>TỔNG CỘNG:</span>
          <strong className="gradient-text">{totalPrice.toLocaleString()} VNĐ</strong>
        </div>

        {selectedSeats.length > 0 && (
          <div style={{ background: 'rgba(255, 75, 43, 0.1)', padding: '15px', borderRadius: '8px', marginBottom: '2rem', border: '1px dashed var(--accent-secondary)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)' }}>🎉 Mã "WEEKEND20" đã được áp dụng tự động!</span>
          </div>
        )}

        <button 
          className="btn-primary" 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px 0', fontSize: '1.1rem' }}
          onClick={handleCheckout}
          disabled={selectedSeats.length === 0 || bookingStatus === 'loading'}
        >
          {bookingStatus === 'loading' ? 'Đang xử lý...' : <><CreditCard size={20} /> Thanh Toán Ngay</>}
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
