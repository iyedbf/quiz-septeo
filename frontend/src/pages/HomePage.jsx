import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-center gradient-bg">
      <div className="home-container">
        <div className="logo-area">
          <div className="septeo-logo">
            <svg width="160" height="40" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="32" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="34" fill="#FF5B27">SEPTEO</text>
            </svg>
          </div>
          <p className="subtitle">Quiz de Connaissance</p>
        </div>

        <div className="hero-badge">20 questions · 3 niveaux · Chrono ⚡</div>

        <div className="home-cards">
          <button className="card-btn card-admin" onClick={() => navigate('/admin')}>
            <span className="card-icon">👑</span>
            <span className="card-title">Je suis Admin</span>
            <span className="card-desc">Créer une room et inviter des joueurs</span>
          </button>

          <button className="card-btn card-player" onClick={() => navigate('/join')}>
            <span className="card-icon">🎮</span>
            <span className="card-title">Rejoindre</span>
            <span className="card-desc">Entrer avec un code ou QR code</span>
          </button>
        </div>

        <div className="home-footer">
          <span>Propulsé par</span>
          <strong style={{ color: '#FF5B27', marginLeft: '6px' }}>SEPTEO</strong>
        </div>
      </div>
    </div>
  );
}
