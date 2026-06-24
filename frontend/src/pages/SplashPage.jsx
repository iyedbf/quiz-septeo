import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BURST_COLORS = ['#FF5B27', '#FFD700', '#7ECED9', '#9B8EC4', '#FF8C5A', '#4ECDC4', '#fff', '#FFB347'];

const TICKER_ITEMS = [
  '🌍 SEPTEO présent dans plus de 10 pays',
  '👥 Plus de 3 000 collaborateurs',
  '💻 Éditeur leader de logiciels SaaS métiers',
  '⚖️ N°1 du logiciel notarial en France',
  '🚀 Pionnier de la transformation numérique',
  '🏆 Guinguette 2026 — Soirée annuelle SEPTEO Tunisia',
  '✨ Merci d\'être là ce soir !',
  '🎊 Bonne soirée à tous !',
];

/* ── Décor jungle (arrière-plan) ─────────────────── */
const TOP_LEAVES   = ['🌿','🍃','🌱','🍀','🌿','🍃','🌴','🌿','🍃','🌱','🍀','🌿','🍃','🌴'];
const SIDE_ITEMS   = [
  { char: '🦜', style: { left:  '0.5%', bottom: '22%' }, size: '2.8rem', delay: 0.4 },
  { char: '🎒', style: { right: '0.5%', bottom: '22%' }, size: '2.6rem', delay: 0.6 },
  { char: '🧭', style: { right: '1%',   top:    '12%' }, size: '2.2rem', delay: 0.9 },
  { char: '🗺️', style: { left:  '1%',   top:    '15%' }, size: '2rem',   delay: 0.7 },
];
const BOTTOM_ITEMS = [
  { char: '👒',  left: '14%',  size: '2rem',   delay: 0.5 },
  { char: '🌺',  left: '22%',  size: '1.8rem', delay: 0.3 },
  { char: '🔭',  left: '58%',  size: '2.1rem', delay: 0.8 },
  { char: '🌸',  left: '68%',  size: '1.8rem', delay: 0.4 },
  { char: '🌿',  left: '35%',  size: '2rem',   delay: 0.6 },
  { char: '🌿',  left: '47%',  size: '2.2rem', delay: 1.0 },
];

function JungleBackground() {
  return (
    <>
      {/* Projecteur */}
      <div className="splash-spotlight" aria-hidden="true" />

      {/* Lianes haut */}
      <div className="jungle-top" aria-hidden="true">
        {TOP_LEAVES.map((leaf, i) => (
          <span key={i} className="vine-leaf" style={{
            left: `${i * 7.5 + 1}%`,
            top:  `${(i % 3) * 10}px`,
            '--delay':    `${i * 0.18}s`,
            fontSize: `${1.8 + (i % 3) * 0.5}rem`,
          }}>{leaf}</span>
        ))}
      </div>

      {/* Feuillage bas */}
      <div className="jungle-bottom" aria-hidden="true">
        {BOTTOM_ITEMS.map((item, i) => (
          <span key={i} className="bottom-flora" style={{
            left: item.left, fontSize: item.size, '--delay': `${item.delay}s`,
          }}>{item.char}</span>
        ))}
      </div>

      {/* Accessoires côtés */}
      {SIDE_ITEMS.map((item, i) => (
        <span key={i} className="jungle-side-item" style={{
          ...item.style, fontSize: item.size, '--delay': `${item.delay}s`,
        }}>{item.char}</span>
      ))}
    </>
  );
}

/* ── Ticker ───────────────────────────────────────── */
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="splash-ticker" aria-hidden="true">
      <div className="splash-ticker-track">
        {items.map((item, i) => (
          <span key={i} className="splash-ticker-item">
            {item}<span className="splash-ticker-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Page principale ──────────────────────────────── */
export default function SplashPage() {
  const navigate  = useNavigate();
  const [phase, setPhase]   = useState('enter');
  const [tilt, setTilt]     = useState({ x: 0, y: 0 });
  const [burstParticles, setBurstParticles] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase('visible'), 100);
    return () => clearTimeout(t);
  }, []);

  const handleCardMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const y = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    setTilt({ x: y * -8, y: x * 8 });
  }, []);

  const handleCardLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const handleEnter = () => {
    const particles = Array.from({ length: 40 }, (_, i) => {
      const angle = (i / 40) * Math.PI * 2;
      const dist  = 70 + (i % 6) * 35;
      return {
        id: i,
        tx: `${Math.cos(angle) * dist}px`,
        ty: `${Math.sin(angle) * dist}px`,
        color: BURST_COLORS[i % BURST_COLORS.length],
        size: 5 + (i % 5) * 2,
        isCircle: i % 3 === 0,
        rotation: `${i * 19}deg`,
      };
    });
    setBurstParticles(particles);
    setTimeout(() => {
      setPhase('exit');
      setTimeout(() => navigate('/home'), 500);
    }, 550);
  };

  return (
    <div className={`splash-page ${phase}`}>

      {/* ── Arrière-plan jungle (z-index bas) ── */}
      <JungleBackground />

      {/* ── Explosion confettis ── */}
      {burstParticles.map(p => (
        <div key={p.id} className="burst-particle" style={{
          width: p.size, height: p.isCircle ? p.size : p.size * 1.7,
          background: p.color, borderRadius: p.isCircle ? '50%' : '2px',
          '--tx': p.tx, '--ty': p.ty, '--rotation': p.rotation,
        }} />
      ))}

      {/* ── Carte centrale (z-index élevé, devant le jungle) ── */}
      <div className="card-glow-ring">
        <div
          className="splash-content"
          ref={cardRef}
          onMouseMove={handleCardMove}
          onMouseLeave={handleCardLeave}
          style={{
            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.18s ease-out',
          }}
        >
          {/* Logo Septeo petit */}
          <img src="/septeo-logo.png" alt="Septeo Tunisia" className="splash-logo-small" />

          {/* Logo Guinguette principal */}
          <img
            src="/guinguette-logo.png"
            alt="La Guinguette 2026"
            className="guinguette-logo-img"
          />

          {/* Date */}
          <p className="splash-date-line">10 Juillet 2026</p>

          <button className="splash-enter-btn" onClick={handleEnter}>
            Commencer l'aventure →
          </button>
        </div>
      </div>

      <Ticker />
    </div>
  );
}
