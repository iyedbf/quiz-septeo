import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../App.jsx';
import socket from '../socket.js';
import { useGameSounds } from '../hooks/useGameSounds.js';

const MEDALS = ['🥇', '🥈', '🥉'];
const PODIUM_HEIGHTS = [180, 130, 100];
const PODIUM_COLORS = ['#C47A20', '#9B8EC4', '#5A8A2A'];
const PODIUM_POSITIONS = [1, 0, 2];

export default function PodiumPage() {
  const navigate = useNavigate();
  const { gameState } = useContext(GameContext);
  const [visible, setVisible] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const { muted, toggleMute, playVictory } = useGameSounds();

  const finalScores = gameState.finalScores || [];

  useEffect(() => {
    if (!finalScores.length) {
      navigate('/');
      return;
    }

    setTimeout(() => setVisible(true), 100);
    setTimeout(() => playVictory(), 600);

    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 8 + 6,
      color: ['#D4A843', '#9B8EC4', '#5A8A2A', '#C47A20', '#f59e0b'][Math.floor(Math.random() * 5)],
    }));
    setConfetti(pieces);
  }, []);

  const myEntry = finalScores.find((p) => p.id === socket.id);
  const myRank = finalScores.findIndex((p) => p.id === socket.id) + 1;

  const top3 = finalScores.slice(0, 3);
  const rest = finalScores.slice(3);

  return (
    <div className="podium-page jungle-bg">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

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
                <div
                  className="podium-bar"
                  style={{
                    height: PODIUM_HEIGHTS[pos],
                    backgroundColor: PODIUM_COLORS[pos],
                  }}
                >
                  <span className="podium-rank">#{rank}</span>
                </div>
              </div>
            );
          })}
        </div>

        {rest.length > 0 && (
          <div className="rest-scores">
            <h3>Autres joueurs</h3>
            {rest.map((p, i) => (
              <div key={p.id} className={`rest-row ${p.id === socket.id ? 'rest-row-me' : ''}`}>
                <span className="rest-rank">#{i + 4}</span>
                <span className="rest-avatar">{p.avatar}</span>
                <span className="rest-name">{p.name}</span>
                <span className="rest-score">{p.score} pts</span>
              </div>
            ))}
          </div>
        )}

        <button className="btn-start" onClick={() => navigate('/')} style={{ marginTop: 32, maxWidth: 320 }}>
          🏠 Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
