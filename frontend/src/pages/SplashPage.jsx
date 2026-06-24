import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BURST_COLORS = ['#FF5B27', '#FFD700', '#7ECED9', '#9B8EC4', '#FF8C5A', '#4ECDC4', '#fff', '#FFB347'];
const SPARKLE_CHARS = ['✦', '★', '✧', '✶', '✵', '⭐'];

/* ── Décor jungle ─────────────────────────────── */
const TOP_LEAVES = [
  '🌿','🍃','🌱','🍀','🌿','🍃','🌴','🌿','🍃','🌱','🍀','🌿','🍃','🌴',
];
const SIDE_ITEMS = [
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

function JungleDecor() {
  return (
    <>
      {/* ── Lianes du haut ── */}
      <div className="jungle-top" aria-hidden="true">
        {TOP_LEAVES.map((leaf, i) => (
          <span key={i} className="vine-leaf" style={{
            left: `${(i * 7.5) + 1}%`,
            top: `${(i % 3) * 10}px`,
            '--delay': `${i * 0.18}s`,
            fontSize: `${1.8 + (i % 3) * 0.5}rem`,
          }}>{leaf}</span>
        ))}
      </div>

      {/* ── Feuillage du bas ── */}
      <div className="jungle-bottom" aria-hidden="true">
        {BOTTOM_ITEMS.map((item, i) => (
          <span key={i} className="bottom-flora" style={{
            left: item.left,
            fontSize: item.size,
            '--delay': `${item.delay}s`,
          }}>{item.char}</span>
        ))}
      </div>

      {/* ── Accessoires côtés ── */}
      {SIDE_ITEMS.map((item, i) => (
        <span key={i} className="jungle-side-item" style={{
          ...item.style,
          fontSize: item.size,
          '--delay': `${item.delay}s`,
        }}>{item.char}</span>
      ))}
    </>
  );
}

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

/* ── Machine à écrire ─────────────────────────── */
function TypewriterText({ text, startDelay = 0, speed = 65 }) {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let idx = 0;
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        idx++;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, startDelay, speed]);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor(v => !v), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <>
      {displayed}
      <span className="typewriter-cursor" style={{ opacity: displayed.length >= text.length ? (showCursor ? 1 : 0) : 1 }}>|</span>
    </>
  );
}

/* ── Étincelles ───────────────────────────────── */
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
        <span key={s.id} className="sparkle-star" style={{
          top: s.top, left: s.left, fontSize: s.size + 'px', color: s.color,
          '--delay': `${s.delay}s`, '--duration': `${s.duration}s`,
        }}>{s.char}</span>
      ))}
    </div>
  );
}

/* ── Bande photos ─────────────────────────────── */
function PhotoStrip({ photos, side, offset }) {
  return (
    <div
      className={`photo-strip ${side}-strip`}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, transition: 'transform 0.12s ease-out', willChange: 'transform' }}
    >
      {photos.map((p, i) => (
        <div key={i} className="polaroid" style={{
          '--rotate': `${p.rotate}deg`, '--tx': `${p.tx}px`,
          '--delay': `${p.delay}s`, '--side': side === 'left' ? '-1' : '1',
        }}>
          <img src={p.src} alt={`souvenir ${i + 1}`} loading="lazy" />
          <div className="polaroid-footer" />
          {p.caption && <div className="polaroid-caption">{p.caption}</div>}
        </div>
      ))}
    </div>
  );
}

/* ── Ticker défilant ──────────────────────────── */
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="splash-ticker" aria-hidden="true">
      <div className="splash-ticker-track">
        {items.map((item, i) => (
          <span key={i} className="splash-ticker-item">
            {item}
            <span className="splash-ticker-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Page principale ──────────────────────────── */
export default function SplashPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('enter');
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [burstParticles, setBurstParticles] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase('visible'), 100);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left - rect.width / 2) / (rect.width / 2),
      y: (e.clientY - rect.top - rect.height / 2) / (rect.height / 2),
    });
  }, []);

  const handleCardMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: y * -9, y: x * 9 });
  }, []);

  const handleCardLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
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

      <JungleDecor />
      <div className="splash-spotlight" aria-hidden="true" />
      <Sparkles />

      {burstParticles.map(p => (
        <div key={p.id} className="burst-particle" style={{
          width: p.size, height: p.isCircle ? p.size : p.size * 1.7,
          background: p.color, borderRadius: p.isCircle ? '50%' : '2px',
          '--tx': p.tx, '--ty': p.ty, '--rotation': p.rotation,
        }} />
      ))}

      <PhotoStrip photos={LEFT_PHOTOS}  side="left"  offset={leftOffset} />

      {/* ── Carte centrale avec bordure animée + tilt 3D ── */}
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
            <p className="splash-sub">SEPTEO Tunisia présente</p>
            <h1 className="splash-title">
              <span className="splash-bienvenue">Bienvenue à</span>
              <span className="splash-event">
                <TypewriterText text="La Guinguette" startDelay={900} speed={75} />
              </span>
              <span className="splash-date">10 Juillet 2026</span>
            </h1>
          </div>

          <button className="splash-enter-btn" onClick={handleEnter}>
            Commencer l'aventure →
          </button>
        </div>
      </div>

      <PhotoStrip photos={RIGHT_PHOTOS} side="right" offset={rightOffset} />

      <Ticker />
    </div>
  );
}
