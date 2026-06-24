import React from 'react';
import { useLocation } from 'react-router-dom';

const TOP_LEAVES = ['🌿','🍃','🌱','🍀','🌿','🍃','🌴','🌿','🍃','🌱','🍀','🌿','🍃','🌴'];
const BOTTOM_ITEMS = [
  { char: '🌺', left: '6%',  size: '1.7rem', delay: 0.5 },
  { char: '🌿', left: '16%', size: '1.9rem', delay: 0.3 },
  { char: '🍃', left: '26%', size: '1.7rem', delay: 0.8 },
  { char: '🌸', left: '36%', size: '1.8rem', delay: 0.4 },
  { char: '🌿', left: '50%', size: '2rem',   delay: 0.6 },
  { char: '🍃', left: '62%', size: '1.7rem', delay: 1.0 },
  { char: '🌺', left: '74%', size: '1.9rem', delay: 0.35 },
  { char: '🌿', left: '85%', size: '1.8rem', delay: 0.7 },
];
const SIDE_ITEMS = [
  { char: '🦜', style: { left: '0.6%', bottom: '30%' }, size: '2.2rem', delay: 0.4 },
  { char: '🎒', style: { right: '0.6%', bottom: '30%' }, size: '2rem', delay: 0.6 },
];

export default function JungleBg() {
  const { pathname } = useLocation();
  if (pathname === '/') return null;

  return (
    <div className="jbg-root" aria-hidden="true">
      {/* Lianes haut */}
      <div className="jbg-top">
        {TOP_LEAVES.map((leaf, i) => (
          <span key={i} className="vine-leaf" style={{
            left: `${i * 7.4 + 0.8}%`,
            top: `${(i % 3) * 7}px`,
            '--delay': `${i * 0.16}s`,
            fontSize: `${1.4 + (i % 3) * 0.35}rem`,
          }}>{leaf}</span>
        ))}
      </div>

      {/* Feuillage bas */}
      <div className="jbg-bottom">
        {BOTTOM_ITEMS.map((item, i) => (
          <span key={i} className="bottom-flora" style={{
            left: item.left,
            fontSize: item.size,
            '--delay': `${item.delay}s`,
          }}>{item.char}</span>
        ))}
      </div>

      {/* Accessoires côtés */}
      {SIDE_ITEMS.map((item, i) => (
        <span key={i} className="jungle-side-item" style={{
          ...item.style,
          fontSize: item.size,
          '--delay': `${item.delay}s`,
        }}>{item.char}</span>
      ))}
    </div>
  );
}
