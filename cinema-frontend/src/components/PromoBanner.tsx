import { Sparkles, Ticket } from 'lucide-react';

const PromoBanner = () => {
  return (
    <div className="promo-banner">
      <div className="promo-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Sparkles size={24} color="var(--accent-secondary)" />
          <h3 className="gradient-text">Exclusive Weekend Treat!</h3>
        </div>
        <p>Because you love watching Action movies on weekends, here's a 20% discount just for you.</p>
      </div>
      <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Ticket size={20} /> Claim Voucher
      </button>
    </div>
  );
};

export default PromoBanner;
