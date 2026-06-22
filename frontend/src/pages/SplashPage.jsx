import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LEFT_PHOTOS = [
  { src: '/photos/IMG_0065_20250710_212145.jpg',   rotate: -7, tx:  18, delay: 0.15 },
  { src: '/photos/DSC_2182 2.jpg',                 rotate:  4, tx: -12, delay: 0.30 },
  { src: '/photos/IMG_0137_20250710_221804 1.jpg', rotate: -5, tx:  10, delay: 0.45 },
];
const RIGHT_PHOTOS = [
  { src: '/photos/IMG_0070_20250710_212450 1.jpg', rotate:  6, tx: -16, delay: 0.20 },
  { src: '/photos/DSC_2369 1.jpg',                 rotate: -3, tx:  12, delay: 0.35 },
  { src: '/photos/IMG_0233_20250710_235931 1.jpg', rotate:  5, tx:  -8, delay: 0.50 },
];

function PhotoStrip({ photos, side }) {
  return (
    <div className={`photo-strip ${side}-strip`}>
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
        </div>
      ))}
    </div>
  );
}

export default function SplashPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('visible'), 100);
    return () => clearTimeout(t1);
  }, []);

  const handleEnter = () => {
    setPhase('exit');
    setTimeout(() => navigate('/home'), 500);
  };

  return (
    <div className={`splash-page ${phase}`}>
      <PhotoStrip photos={LEFT_PHOTOS} side="left" />

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

      <PhotoStrip photos={RIGHT_PHOTOS} side="right" />
    </div>
  );
}
