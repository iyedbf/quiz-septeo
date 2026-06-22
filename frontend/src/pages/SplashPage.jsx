import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <div className="splash-content">
        <div className="splash-logo-wrap">
          <div className="splash-logo-ring" />
          <div className="splash-logo-ring ring-2" />
          <img
            src="/septeo-logo.png"
            alt="Septeo Tunisia"
            className="splash-logo-img"
          />
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
