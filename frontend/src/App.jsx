import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SplashPage from './pages/SplashPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import JoinPage from './pages/JoinPage.jsx';
import WaitingRoom from './pages/WaitingRoom.jsx';
import QuizPage from './pages/QuizPage.jsx';
import PodiumPage from './pages/PodiumPage.jsx';
import JungleBg from './components/JungleBg.jsx';
import socket from './socket.js';

export const GameContext = React.createContext({});

function AppContent() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    role: null,
    roomCode: null,
    playerName: null,
    playerAvatar: null,
    players: [],
    currentQuestion: null,
    finalScores: null,
  });

  useEffect(() => {
    socket.on('game:start', () => {
      navigate('/quiz');
    });

    socket.on('question:new', (data) => {
      setGameState((prev) => ({ ...prev, currentQuestion: data }));
    });

    socket.on('room:update', (data) => {
      setGameState((prev) => ({ ...prev, players: data.players }));
    });

    socket.on('game:end', ({ finalScores }) => {
      setGameState((prev) => ({ ...prev, finalScores }));
      navigate('/podium');
    });

    socket.on('player:kicked', () => {
      alert("Vous avez été exclu de la room par l'admin.");
      navigate('/');
    });

    socket.on('room:closed', ({ message }) => {
      alert(message);
      navigate('/');
    });

    return () => {
      socket.off('game:start');
      socket.off('question:new');
      socket.off('room:update');
      socket.off('game:end');
      socket.off('player:kicked');
      socket.off('room:closed');
    };
  }, [navigate]);

  return (
    <GameContext.Provider value={{ gameState, setGameState }}>
      <JungleBg />
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/waiting" element={<WaitingRoom />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/podium" element={<PodiumPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </GameContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
