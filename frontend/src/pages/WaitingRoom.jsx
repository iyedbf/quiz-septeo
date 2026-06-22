import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../App.jsx';

export default function WaitingRoom() {
  const navigate = useNavigate();
  const { gameState } = useContext(GameContext);

  useEffect(() => {
    if (!gameState.roomCode || !gameState.playerName) {
      navigate('/');
    }
  }, []);

  return (
    <div className="page-center gradient-bg">
      <div className="waiting-container">
        <div className="waiting-header">
          <div className="waiting-logo">
            <span style={{ color: '#FF5B27', fontWeight: 900, fontSize: '2rem' }}>SEPTEO</span>
            <span style={{ marginLeft: 8, fontSize: '1.5rem' }}>Quiz</span>
          </div>
          <h2>Salle d'attente</h2>
          <p className="waiting-code">
            Code : <strong>{gameState.roomCode}</strong>
          </p>
        </div>

        <div className="waiting-you">
          <div className="waiting-avatar">{gameState.playerAvatar}</div>
          <div className="waiting-name">{gameState.playerName}</div>
          <div className="waiting-badge">Vous êtes prêt !</div>
        </div>

        <div className="waiting-players-section">
          <h3>Joueurs dans la room ({gameState.players.length})</h3>
          <div className="waiting-players-grid">
            {gameState.players.map((p) => (
              <div key={p.id} className="waiting-player-chip">
                <span>{p.avatar}</span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="waiting-info">
          <div className="pulse-ring">
            <div className="pulse-dot" />
          </div>
          <p>En attente du lancement par l'admin…</p>
        </div>
      </div>
    </div>
  );
}
