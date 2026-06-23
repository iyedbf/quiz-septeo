import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const CONFETTI_COLORS = ['#FF5B27', '#FFD700', '#7ECED9', '#9B8EC4', '#FF8C5A', '#4ECDC4', '#FFB347'];

function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      left: `${(i * 4.2 + 1.5) % 100}%`,
      size: 7 + (i % 4) * 2,
      delay: (i * 0.28) % 5,
      duration: 5 + (i % 4) * 1.2,
      rotation: i * 23,
      isCircle: i % 3 === 0,
    })), []
  );

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            width: p.size,
            height: p.isCircle ? p.size : p.size * 1.7,
            background: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            '--delay': `${p.delay}s`,
            '--duration': `${p.duration}s`,
            '--rotation': `${p.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-center gradient-bg">
      <Confetti />

      <div className="home-container">

        {/* ── Bandeau événementiel ── */}
        <div className="event-banner">
          <div className="event-banner-shimmer" />
          <span className="event-banner-emoji">🎊</span>
          <div className="event-banner-text">
            <span className="event-banner-title">Guinguette 2026</span>
            <span className="event-banner-sub">Soirée annuelle · SEPTEO Tunisia</span>
          </div>
          <span className="event-banner-emoji">🎉</span>
        </div>

        {/* ── Logo & titre ── */}
        <div className="logo-area">
          <img src="/septeo-logo.png" alt="Septeo Tunisia" className="home-logo-img" />
          <p className="subtitle">Quiz de Connaissance</p>
        </div>

        <div className="hero-badge">20 questions · 3 niveaux · Chrono ⚡</div>

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
          <span>Propulsé par</span>
          <strong style={{ color: '#FF5B27', marginLeft: '6px' }}>SEPTEO</strong>
        </div>
      </div>
    </div>
  );
}
