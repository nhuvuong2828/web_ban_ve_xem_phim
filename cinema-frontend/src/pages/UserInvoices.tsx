import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';

const UserInvoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('role') === 'ADMIN' ? 'admin@cineflex.com' : 'user@cineflex.com';
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setInvoices(allBookings.filter((b: any) => b.user === user));
  }, []);

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '50px', paddingLeft: '5%', paddingRight: '5%' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }} className="gradient-text">Quản Lý Hóa Đơn Điện Tử</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Tra cứu, tải xuống và đối soát tất cả các giao dịch thanh toán của bạn trên hệ thống CineFlex.</p>
      
      {invoices.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Bạn chưa có hóa đơn giao dịch nào.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))' }}>
          {invoices.map(invoice => (
            <div key={invoice.id} className="glass-panel" style={{ padding: '2.5rem', borderTop: '4px solid #00e5ff', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '5px' }}>HÓA ĐƠN GTGT: #{invoice.id.toUpperCase()}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Thời gian xuất: {invoice.date}</p>
                  <p style={{ color: 'var(--text-muted)' }}>Khách hàng: {invoice.user}</p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ padding: '5px 10px', background: 'rgba(70, 211, 105, 0.2)', color: '#46d369', borderRadius: '4px', fontWeight: 'bold' }}>ĐÃ THANH TOÁN</span>
                  <button onClick={() => window.open(`/invoice/${invoice.id}/print`, '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', background: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff', borderRadius: '4px', cursor: 'pointer' }}>
                    <Download size={14} /> Tải PDF
                  </button>
                </div>
              </div>
              
              {invoice.details ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem', marginBottom: '1rem', marginTop: '1.5rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <th style={{ textAlign: 'left', padding: '10px 0', color: 'var(--text-muted)' }}>Diễn Giải (Chi Tiết SP/DV)</th>
                        <th style={{ textAlign: 'center', padding: '10px 0', color: 'var(--text-muted)' }}>SL</th>
                        <th style={{ textAlign: 'right', padding: '10px 0', color: 'var(--text-muted)' }}>Đơn Giá</th>
                        <th style={{ textAlign: 'right', padding: '10px 0', color: 'var(--text-muted)' }}>Thành Tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.details.map((d: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '12px 0', color: 'white' }}>{d.name}</td>
                          <td style={{ textAlign: 'center', padding: '12px 0', color: 'white' }}>{d.quantity}</td>
                          <td style={{ textAlign: 'right', padding: '12px 0', color: 'white' }}>{d.unitPrice.toLocaleString()} ₫</td>
                          <td style={{ textAlign: 'right', padding: '12px 0', color: '#00e5ff', fontWeight: 'bold' }}>{d.total.toLocaleString()} ₫</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              ) : (
                  <div style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>
                    [Hóa đơn phiên bản cũ - Không hỗ trợ xem chi tiết phân tách]<br />
                    Phim: {invoice.movieId.substring(0,8)}... | Ghế: {invoice.seats.join(', ')}
                  </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tổng Tiền Hàng:</span>
                <span style={{ color: 'white' }}>{invoice.totalPrice.toLocaleString()} ₫</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', paddingTop: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Thuế GTGT (VAT 10%):</span>
                <span style={{ color: 'white' }}>Đã bao gồm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '1rem', marginTop: '1rem' }}>
                <strong style={{ color: 'white' }}>TỔNG THANH TOÁN:</strong>
                <strong style={{ color: '#e50914' }}>{invoice.totalPrice.toLocaleString()} VNĐ</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default UserInvoices;
