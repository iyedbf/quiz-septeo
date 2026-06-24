import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-center jungle-bg">
      <div className="home-container">

        {/* ── Bandeau événement ── */}
        <div className="event-banner">
          <div className="event-banner-shimmer" />
          <span className="event-banner-emoji">🌿</span>
          <div className="event-banner-text">
            <span className="event-banner-title">Guinguette 2026</span>
            <span className="event-banner-sub">Soirée annuelle · SEPTEO Tunisia · 10 Juillet</span>
          </div>
          <span className="event-banner-emoji">🎊</span>
        </div>

        {/* ── Logo & titre ── */}
        <div className="logo-area">
          <img src="/septeo-logo.png" alt="Septeo Tunisia" className="home-logo-img" />
          <p className="subtitle">Quiz de Connaissance</p>
        </div>

        <div className="hero-badge">🌿 20 questions · 3 niveaux · Chrono ⚡</div>

        {/* ── Cartes ── */}
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
          <span>🌴 Propulsé par</span>
          <strong style={{ color: '#8B5A1A', marginLeft: '6px' }}>SEPTEO</strong>
        </div>
      </div>
    </div>
  );
}
