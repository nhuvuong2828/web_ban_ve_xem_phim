import { Play, Info, Star, Ticket } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero">
      <img 
        src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1925&q=80" 
        alt="Hero Background" 
        className="hero-bg"
      />
      <div className="hero-overlay"></div>
      <div className="hero-gradient-bottom"></div>

      <div className="hero-content">
        <span className="hero-tag">#1 In Vietnam Today</span>
        <h1 className="hero-title">Avengers: <br/>Endgame</h1>
        
        <div className="hero-meta">
          <span><Star size={16} color="#f5c518" fill="#f5c518"/> 9.2/10</span>
          <span>181 min</span>
          <span>Action, Sci-Fi</span>
          <span>13+</span>
        </div>

        <p className="hero-desc">
          After the devastating events of Infinity War, the universe is in ruins. 
          With the help of remaining allies, the Avengers assemble once more in order 
          to reverse Thanos' actions and restore balance to the universe.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={20} /> Book Ticket Now
          </button>
          <button className="btn-icon">
            <Play size={24} fill="currentColor" />
          </button>
          <button className="btn-icon">
            <Info size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
