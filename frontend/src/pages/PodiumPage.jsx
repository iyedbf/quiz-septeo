import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../App.jsx';
import socket from '../socket.js';
import { useGameSounds } from '../hooks/useGameSounds.js';

const MEDALS        = ['🥇', '🥈', '🥉'];
const PODIUM_HEIGHTS  = [180, 130, 100];
const PODIUM_COLORS   = ['#C47A20', '#9B8EC4', '#5A8A2A'];
const PODIUM_POSITIONS = [1, 0, 2];

/* ── Rang → couleur de fond dans le classement complet ── */
function rankBg(rank) {
  if (rank === 1) return 'rgba(212,168,67,0.22)';
  if (rank === 2) return 'rgba(155,142,196,0.18)';
  if (rank === 3) return 'rgba(90,138,42,0.18)';
  return 'rgba(245,232,192,0.55)';
}
function rankBorder(rank) {
  if (rank === 1) return '1.5px solid rgba(212,168,67,0.6)';
  if (rank === 2) return '1.5px solid rgba(155,142,196,0.5)';
  if (rank === 3) return '1.5px solid rgba(90,138,42,0.4)';
  return '1px solid rgba(139,90,26,0.14)';
}

export default function PodiumPage() {
  const navigate = useNavigate();
  const { gameState } = useContext(GameContext);
  const [visible,       setVisible]       = useState(false);
  const [confetti,      setConfetti]      = useState([]);
  const [showFullRank,  setShowFullRank]  = useState(false);
  const { muted, toggleMute, playVictory } = useGameSounds();

  const finalScores = gameState.finalScores || [];

  useEffect(() => {
    if (!finalScores.length) { navigate('/'); return; }
    setTimeout(() => setVisible(true), 100);
    setTimeout(() => playVictory(), 600);
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 8 + 6,
      color: ['#D4A843','#9B8EC4','#5A8A2A','#C47A20','#f59e0b'][Math.floor(Math.random() * 5)],
    }));
    setConfetti(pieces);
  }, []);

  const myEntry = finalScores.find((p) => p.id === socket.id);
  const myRank  = finalScores.findIndex((p) => p.id === socket.id) + 1;
  const top3    = finalScores.slice(0, 3);

  return (
    <div className="podium-page jungle-bg">

      {/* Confettis */}
      {confetti.map((c) => (
        <div key={c.id} className="confetti-piece" style={{
          left: `${c.left}%`, width: c.size, height: c.size,
          backgroundColor: c.color, animationDelay: `${c.delay}s`,
        }} />
      ))}

      {/* ── Modale classement complet ── */}
      {showFullRank && (
        <div className="fullrank-overlay" onClick={() => setShowFullRank(false)}>
          <div className="fullrank-modal" onClick={(e) => e.stopPropagation()}>

            <div className="fullrank-header">
              <h2 className="fullrank-title">🏆 Classement complet</h2>
              <span className="fullrank-count">{finalScores.length} joueurs</span>
              <button className="fullrank-close" onClick={() => setShowFullRank(false)}>✕</button>
            </div>

            <div className="fullrank-list">
              {finalScores.map((p, i) => {
                const rank  = i + 1;
                const isMe  = p.id === socket.id;
                return (
                  <div
                    key={p.id}
                    className={`fullrank-row ${isMe ? 'fullrank-row-me' : ''}`}
                    style={{ background: isMe ? 'rgba(139,90,26,0.14)' : rankBg(rank), border: isMe ? '2px solid rgba(139,90,26,0.45)' : rankBorder(rank) }}
                  >
                    <span className="fullrank-pos">
                      {rank <= 3 ? MEDALS[rank - 1] : `#${rank}`}
                    </span>
                    <span className="fullrank-avatar">{p.avatar}</span>
                    <span className="fullrank-name">
                      {p.name}{isMe && <span className="fullrank-you"> (vous)</span>}
                    </span>
                    <span className="fullrank-score">{p.score} pts</span>
                  </div>
                );
              })}
            </div>

            <button className="btn-start fullrank-btn-close" onClick={() => setShowFullRank(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* ── Contenu principal ── */}
      <div className="podium-container">

        <div className="podium-header">
          <h1 className="podium-title">🏆 Résultats Finaux</h1>
          <p className="podium-subtitle">Quiz SEPTEO — {finalScores.length} joueurs</p>
          <button className="mute-btn" onClick={toggleMute} style={{ marginTop: 8 }}>
            {muted ? '🔇 Son coupé' : '🔊 Son activé'}
          </button>
        </div>

        {myEntry && (
          <div className="my-result-banner">
            <span>{myEntry.avatar}</span>
            <span>{myEntry.name}</span>
            <span>—</span>
            <span>Classé <strong>#{myRank}</strong></span>
            <span>avec <strong>{myEntry.score} pts</strong></span>
          </div>
        )}

        {/* Podium top 3 */}
        <div className={`podium-stage ${visible ? 'podium-visible' : ''}`}>
          {PODIUM_POSITIONS.map((pos) => {
            const player = top3[pos];
            if (!player) return null;
            const rank = pos + 1;
            const isMe = player.id === socket.id;
            return (
              <div
                key={player.id}
                className={`podium-slot podium-slot-${rank} ${isMe ? 'podium-slot-me' : ''}`}
                style={{ animationDelay: `${pos * 0.2}s` }}
              >
                <div className="podium-player-info">
                  <div className="podium-medal">{MEDALS[pos]}</div>
                  <div className="podium-avatar">{player.avatar}</div>
                  <div className="podium-player-name">{player.name}</div>
                  <div className="podium-player-score">{player.score} pts</div>
                </div>
                <div className="podium-bar" style={{ height: PODIUM_HEIGHTS[pos], backgroundColor: PODIUM_COLORS[pos] }}>
                  <span className="podium-rank">#{rank}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 8, width: '100%' }}>

          {finalScores.length > 3 && (
            <button
              className="btn-classement"
              onClick={() => setShowFullRank(true)}
            >
              📋 Voir tout le classement ({finalScores.length} joueurs)
            </button>
          )}

          <button className="btn-start" onClick={() => navigate('/')} style={{ maxWidth: 320 }}>
            🏠 Retour à l'accueil
          </button>
        </div>

      </div>
    </div>
  );
}
