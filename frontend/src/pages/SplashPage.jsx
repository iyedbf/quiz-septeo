import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PHOTOS = [
  { src: '/photos/IMG_0065_20250710_212145.jpg',     rotate: -8,  top: '4%',  left: '1%',   delay: 0.1 },
  { src: '/photos/IMG_0070_20250710_212450 1.jpg',   rotate:  6,  top: '2%',  right: '2%',  delay: 0.25 },
  { src: '/photos/DSC_2182 2.jpg',                   rotate: -4,  top: '38%', left: '0%',   delay: 0.4 },
  { src: '/photos/DSC_2369 1.jpg',                   rotate:  5,  top: '35%', right: '0%',  delay: 0.55 },
  { src: '/photos/IMG_0137_20250710_221804 1.jpg',   rotate: -6,  bottom: '3%', left: '2%', delay: 0.7 },
  { src: '/photos/IMG_0233_20250710_235931 1.jpg',   rotate:  7,  bottom: '2%', right: '1%', delay: 0.85 },
];

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
      {PHOTOS.map((p, i) => (
        <div
          key={i}
          className="polaroid"
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            '--rotate': `${p.rotate}deg`,
            '--delay': `${p.delay}s`,
            '--float-dir': i % 2 === 0 ? '1' : '-1',
          }}
        >
          <img src={p.src} alt={`photo ${i + 1}`} loading="lazy" />
        </div>
      ))}

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
    </div>
  );
}
