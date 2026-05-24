import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PrintInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const found = allBookings.find((b: any) => b.id === id);
    if (found) {
      setInvoice(found);
      // Automatically trigger browser print dialogue after rendering
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [id]);

  if (!invoice) return <div style={{ padding: '2rem', textAlign: 'center' }}>Không tìm thấy hóa đơn.</div>;

  return (
    <>
      <style>
        {`
          .navbar { display: none !important; }
          body { background-color: #fff !important; margin: 0; padding: 0; }
        `}
      </style>
      <div style={{ backgroundColor: '#fff', color: '#000', minHeight: '100vh', padding: '40px', fontFamily: '"Arial", sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #ddd', padding: '40px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#e50914' }}>CINEFLEX CINEMAS</h1>
            <p style={{ margin: '5px 0 0 0', color: '#555' }}>Tầng 5, Vincom Center, Quận 1, TP.HCM</p>
            <p style={{ margin: '2px 0 0 0', color: '#555' }}>MST: 0123456789</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>HÓA ĐƠN GTGT (INVOICE)</h2>
            <p style={{ margin: '5px 0 0 0' }}>Mã Hóa Đơn: <strong>#{invoice.id.toUpperCase()}</strong></p>
            <p style={{ margin: '2px 0 0 0' }}>Ngày: {invoice.date}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div style={{ marginBottom: '30px' }}>
          <p><strong>Khách hàng:</strong> {invoice.user}</p>
          <p><strong>Hình thức thanh toán:</strong> Thẻ Tín Dụng / VNPay</p>
        </div>

        {/* Details Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>STT</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Tên Hàng Hóa, Dịch Vụ</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Số Lượng</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>Đơn Giá (VNĐ)</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>Thành Tiền (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.details ? invoice.details.map((d: any, idx: number) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>{idx + 1}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{d.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>{d.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{d.unitPrice.toLocaleString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{d.total.toLocaleString()}</td>
              </tr>
            )) : (
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>1</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Vé Phim (Phiên bản cũ)</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>1</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{invoice.totalPrice.toLocaleString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{invoice.totalPrice.toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Cộng tiền hàng:</span>
              <span>{invoice.totalPrice.toLocaleString()} VNĐ</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Thuế GTGT (10%):</span>
              <span>Đã bao gồm</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '10px', fontWeight: 'bold', fontSize: '18px' }}>
              <span>Tổng Cộng:</span>
              <span>{invoice.totalPrice.toLocaleString()} VNĐ</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '50px', textAlign: 'center', color: '#555', fontSize: '14px' }}>
          <p><em>(Hóa đơn điện tử tra cứu tại: https://cineflex.com/invoices)</em></p>
          <p>Cảm ơn quý khách đã sử dụng dịch vụ của CineFlex!</p>
        </div>
      </div>
      </div>
    </>
  );
};

export default PrintInvoice;
