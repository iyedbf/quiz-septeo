import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { GameContext } from '../App.jsx';
import socket from '../socket.js';

export default function AdminPage() {
  const navigate = useNavigate();
  const { gameState, setGameState } = useContext(GameContext);
  const [roomCode, setRoomCode] = useState(null);
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(true);

  const joinUrl = `${window.location.origin}/join?code=${roomCode}`;

  useEffect(() => {
    socket.emit('admin:create-room', (res) => {
      if (res?.code) {
        setRoomCode(res.code);
        setGameState((prev) => ({ ...prev, role: 'admin', roomCode: res.code }));
        setCreating(false);
      }
    });

    socket.on('room:update', (data) => {
      setPlayers(data.players);
      setGameState((prev) => ({ ...prev, players: data.players }));
    });

    return () => {
      socket.off('room:update');
    };
  }, []);

  const handleStart = () => {
    if (players.length === 0) return;
    socket.emit('admin:start');
    navigate('/quiz');
  };

  const handleKick = (playerId) => {
    socket.emit('admin:kick', { playerId });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (creating) {
    return (
      <div className="page-center gradient-bg">
        <div className="loading-spinner" />
        <p style={{ color: '#fff', marginTop: 16, fontWeight: 600 }}>Création de la room…</p>
      </div>
    );
  }

  return (
    <div className="page-center gradient-bg">
      <div className="admin-container">
        <div className="admin-header">
          <button className="back-btn" onClick={() => navigate('/')}>← Retour</button>
          <h1 className="admin-title">👑 Salle Admin</h1>
          <p className="admin-subtitle">Partagez le code ou QR Code avec vos joueurs</p>
        </div>

        <div className="admin-grid">
          <div className="admin-card qr-card">
            <h3>Code de la room</h3>
            <div className="room-code-display">{roomCode}</div>
            <div className="code-actions">
              <button className="btn-secondary" onClick={copyCode}>
                {copied ? '✅ Copié !' : '📋 Copier le code'}
              </button>
              <button className="btn-secondary" onClick={copyLink}>
                🔗 Copier le lien
              </button>
            </div>

            <div className="qr-wrapper">
              <QRCodeSVG
                value={joinUrl}
                size={180}
                bgColor="#ffffff"
                fgColor="#1A1A2E"
                level="M"
                includeMargin={true}
              />
              <p className="qr-hint">Scanner pour rejoindre</p>
            </div>
          </div>

          <div className="admin-card players-card">
            <h3>
              Joueurs connectés
              <span className="player-count">{players.length}</span>
            </h3>

            <div className="players-list">
              {players.length === 0 ? (
                <div className="empty-state">
                  <div className="pulse-dot" />
                  <p>En attente de joueurs…</p>
                </div>
              ) : (
                players.map((p) => (
                  <div key={p.id} className="player-row">
                    <span className="player-avatar">{p.avatar}</span>
                    <span className="player-name">{p.name}</span>
                    <button
                      className="kick-btn"
                      onClick={() => handleKick(p.id)}
                      title="Exclure"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              className={`btn-start ${players.length === 0 ? 'btn-disabled' : ''}`}
              onClick={handleStart}
              disabled={players.length === 0}
            >
              {players.length === 0
                ? '⏳ Attente des joueurs…'
                : `🚀 Lancer le quiz (${players.length} joueur${players.length > 1 ? 's' : ''})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
