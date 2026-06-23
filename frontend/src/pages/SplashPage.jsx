import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const BURST_COLORS = ['#FF5B27', '#FFD700', '#7ECED9', '#9B8EC4', '#FF8C5A', '#4ECDC4', '#fff', '#FFB347'];

const LEFT_PHOTOS = [
  { src: '/photos/IMG_0065_20250710_212145.jpg',   rotate: -7, tx:  18, delay: 0.15, caption: 'Guinguette 2025 🎊' },
  { src: '/photos/DSC_2182 2.jpg',                 rotate:  4, tx: -12, delay: 0.30, caption: 'Team SEPTEO' },
  { src: '/photos/IMG_0137_20250710_221804 1.jpg', rotate: -5, tx:  10, delay: 0.45, caption: 'La soirée !' },
];
const RIGHT_PHOTOS = [
  { src: '/photos/IMG_0070_20250710_212450 1.jpg', rotate:  6, tx: -16, delay: 0.20, caption: 'Juillet 2025' },
  { src: '/photos/DSC_2369 1.jpg',                 rotate: -3, tx:  12, delay: 0.35, caption: 'SEPTEO Tunisia' },
  { src: '/photos/IMG_0233_20250710_235931 1.jpg', rotate:  5, tx:  -8, delay: 0.50, caption: 'On y était 🎉' },
];

const SPARKLE_CHARS = ['✦', '★', '✧', '✶', '✵', '⭐'];

function Sparkles() {
  const items = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: `${8 + (i * 4.6) % 84}%`,
      left: `${3 + (i * 5.1) % 93}%`,
      delay: (i * 0.21) % 4,
      duration: 2.0 + (i % 4) * 0.7,
      size: 11 + (i % 3) * 5,
      char: SPARKLE_CHARS[i % SPARKLE_CHARS.length],
      color: BURST_COLORS[i % 5],
    })), []
  );

  return (
    <div className="sparkles-container" aria-hidden="true">
      {items.map(s => (
        <span
          key={s.id}
          className="sparkle-star"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size + 'px',
            color: s.color,
            '--delay': `${s.delay}s`,
            '--duration': `${s.duration}s`,
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}

function PhotoStrip({ photos, side, offset }) {
  return (
    <div
      className={`photo-strip ${side}-strip`}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.12s ease-out',
        willChange: 'transform',
      }}
    >
      {photos.map((p, i) => (
        <div
          key={i}
          className="polaroid"
          style={{
            '--rotate': `${p.rotate}deg`,
            '--tx': `${p.tx}px`,
            '--delay': `${p.delay}s`,
            '--side': side === 'left' ? '-1' : '1',
          }}
        >
          <img src={p.src} alt={`souvenir ${i + 1}`} loading="lazy" />
          <div className="polaroid-footer" />
          {p.caption && <div className="polaroid-caption">{p.caption}</div>}
        </div>
      ))}
    </div>
  );
}

export default function SplashPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('enter');
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [burstParticles, setBurstParticles] = useState([]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('visible'), 100);
    return () => clearTimeout(t1);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left - rect.width / 2) / (rect.width / 2),
      y: (e.clientY - rect.top - rect.height / 2) / (rect.height / 2),
    });
  }, []);

  const handleEnter = () => {
    const particles = Array.from({ length: 40 }, (_, i) => {
      const angle = (i / 40) * Math.PI * 2;
      const dist = 70 + (i % 6) * 35;
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

  const leftOffset  = { x: mouse.x * -16, y: mouse.y * -10 };
  const rightOffset = { x: mouse.x *  16, y: mouse.y *  10 };

  return (
    <div className={`splash-page ${phase}`} onMouseMove={handleMouseMove}>

      {/* ── Projecteur ── */}
      <div className="splash-spotlight" aria-hidden="true" />

      {/* ── Étincelles ── */}
      <Sparkles />

      {/* ── Explosion de confettis ── */}
      {burstParticles.map(p => (
        <div
          key={p.id}
          className="burst-particle"
          style={{
            width: p.size,
            height: p.isCircle ? p.size : p.size * 1.7,
            background: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            '--tx': p.tx,
            '--ty': p.ty,
            '--rotation': p.rotation,
          }}
        />
      ))}

      <PhotoStrip photos={LEFT_PHOTOS}  side="left"  offset={leftOffset} />

      <div className="splash-content">
        <div className="splash-logo-wrap">
          <div className="splash-logo-ring" />
          <div className="splash-logo-ring ring-2" />
          <img src="/septeo-logo.png" alt="Septeo Tunisia" className="splash-logo-img" />
        </div>

        <div className="splash-divider">
          <div className="splash-line" />
          <span className="splash-diamond">◆</span>
          <div className="splash-line" />
        </div>

        <div className="splash-welcome">
          <p className="splash-sub">vous présente</p>
          <h1 className="splash-title">
            Bienvenue au
            <br />
            <span className="splash-event">Guinguette 2026</span>
          </h1>
        </div>

        <button className="splash-enter-btn" onClick={handleEnter}>
          Commencer l'aventure →
        </button>
      </div>

      <PhotoStrip photos={RIGHT_PHOTOS} side="right" offset={rightOffset} />
    </div>
  );
}
