import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GameContext } from '../App.jsx';
import socket from '../socket.js';

const AVATARS = ['🦊', '🐯', '🦁', '🐸', '🐼', '🦄', '🐺', '🐙', '🦋', '🐲', '🦅', '🦝'];

export default function JoinPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setGameState } = useContext(GameContext);

  const [code, setCode] = useState(searchParams.get('code') || '');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Le pseudo doit contenir au moins 2 caractères.');
      return;
    }

    setLoading(true);
    setError('');

    socket.emit('player:join', { code: code.trim(), name: name.trim(), avatar: selectedAvatar }, (res) => {
      setLoading(false);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setGameState((prev) => ({
        ...prev,
        role: 'player',
        roomCode: code.trim(),
        playerName: name.trim(),
        playerAvatar: selectedAvatar,
        players: res.roomState?.players || [],
      }));
      navigate('/waiting');
    });
  };

  return (
    <div className="page-center jungle-bg">
      <div className="join-container">
        <button className="back-btn" onClick={() => navigate('/home')}>← Retour</button>

        <div className="join-header">
          <h1>🎮 Rejoindre une Room</h1>
          <p>Entrez le code partagé par l'admin</p>
        </div>

        <form className="join-form" onSubmit={handleJoin}>
          <div className="form-group">
            <label>Code de la room</label>
            <input
              type="text"
              className="code-input"
              placeholder="Ex: 847293"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              inputMode="numeric"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Votre pseudo</label>
            <input
              type="text"
              className="text-input"
              placeholder="Ex: SuperJoueur"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>Choisissez votre avatar</label>
            <div className="avatar-grid">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  className={`avatar-btn ${selectedAvatar === av ? 'avatar-selected' : ''}`}
                  onClick={() => setSelectedAvatar(av)}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="error-msg">⚠️ {error}</div>}

          <button
            type="submit"
            className={`btn-start ${loading ? 'btn-disabled' : ''}`}
            disabled={loading}
          >
            {loading ? '⏳ Connexion…' : '🚀 Rejoindre la party !'}
          </button>
        </form>
      </div>
    </div>
  );
}
