import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('visible'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 3800);
    const t3 = setTimeout(() => navigate('/home'), 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [navigate]);

  return (
    <div className={`splash-page ${phase}`}>
      <div className="splash-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

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

        <div className="splash-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}
