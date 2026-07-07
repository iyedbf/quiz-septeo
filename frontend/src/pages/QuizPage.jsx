import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../App.jsx';
import socket from '../socket.js';
import { useGameSounds } from '../hooks/useGameSounds.js';

const OPTION_COLORS = ['#C47A20', '#5A8A2A', '#7C3AED', '#1a6ea8'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const navigate = useNavigate();
  const { gameState } = useContext(GameContext);
  const [question, setQuestion]             = useState(null);
  const [questionKey, setQuestionKey]       = useState(0);
  const [timeLeft, setTimeLeft]             = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctIndex, setCorrectIndex]     = useState(null);
  const [showResult, setShowResult]         = useState(false);
  const [questionResults, setQuestionResults] = useState([]);
  const [myScore, setMyScore]               = useState(0);
  const [pointsGained, setPointsGained]     = useState(null);
  const [phase, setPhase]                   = useState('loading');
  const timerRef     = useRef(null);
  const startTimeRef = useRef(null);
  const tickCountRef = useRef(0);

  const {
    muted, toggleMute,
    tick, playCorrect, playWrong, playStart, playVictory,
    startBg, stopBg,
  } = useGameSounds();

  /* ── Démarrer l'ambiance au montage ── */
  useEffect(() => {
    startBg();
    return () => stopBg();
  }, [startBg, stopBg]);

  /* ── Tick-tock synchronisé sur timeLeft ── */
  useEffect(() => {
    if (phase !== 'question' || showResult) return;
    const fast = timeLeft <= 3 && timeLeft > 0;
    tick(fast);
    if (fast && timeLeft > 1) {
      // double-click urgent dans les 3 dernières secondes
      const t = setTimeout(() => tick(true), fast ? 300 : 500);
      return () => clearTimeout(t);
    }
  }, [timeLeft, phase, showResult, tick]);

  useEffect(() => {
    if (!gameState.roomCode) {
      navigate('/');
      return;
    }

    socket.on('question:new', (data) => {
      // Reset complet des boutons pour éviter hover/focus persistant
      if (document.activeElement) document.activeElement.blur();
      setQuestionKey(k => k + 1);
      setQuestion(data);
      setSelectedAnswer(null);
      setCorrectIndex(null);
      setShowResult(false);
      setQuestionResults([]);
      setPointsGained(null);
      setTimeLeft(data.timeLimit);
      setPhase('question');
      startTimeRef.current = Date.now();
      tickCountRef.current = 0;
      playStart();

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('answer:confirmed', ({ answerIndex }) => {
      setSelectedAnswer(answerIndex);
      if (timerRef.current) clearInterval(timerRef.current);
    });

    socket.on('question:end', ({ correctIndex: ci, results }) => {
      setCorrectIndex(ci);
      setShowResult(true);
      setQuestionResults(results);
      setPhase('result');
      if (timerRef.current) clearInterval(timerRef.current);

      const me = results.find((r) => r.id === socket.id);
      if (me) {
        setMyScore(me.score);
        setPointsGained(me.pointsGained);
        if (me.correct) {
          playCorrect();
        } else {
          playWrong();
        }
      }
    });

    return () => {
      socket.off('question:new');
      socket.off('answer:confirmed');
      socket.off('question:end');
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [navigate, gameState.roomCode, playStart, playCorrect, playWrong]);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null || showResult) return;
    socket.emit('player:answer', { answerIndex: index });
  };

  const getOptionClass = (index) => {
    if (!showResult) {
      if (selectedAnswer === index) return 'option-selected';
      return '';
    }
    if (index === correctIndex) return 'option-correct';
    if (selectedAnswer === index && index !== correctIndex) return 'option-wrong';
    return 'option-dimmed';
  };

  const timerPercent = question ? (timeLeft / question.timeLimit) * 100 : 100;
  const isUrgent     = timeLeft <= 3 && timeLeft > 0 && !showResult;
  const timerColor   = timeLeft > 7 ? '#3a8a14' : timeLeft > 3 ? '#c47a20' : '#dc2626';

  if (phase === 'loading') {
    return (
      <div className="page-center jungle-bg">
        <div className="loading-card">
          <div className="loading-spinner" />
          <p>Chargement de la question…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page jungle-bg">

      {/* ── Topbar ── */}
      <div className="quiz-topbar">
        <div className="quiz-level">
          <span>{question?.emoji}</span>
          <span>{question?.level}</span>
        </div>
        <div className="quiz-progress">
          Q {(question?.questionIndex ?? 0) + 1}/{question?.totalQuestions}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="quiz-score">⭐ {myScore} pts</div>
          <button className="mute-btn" onClick={toggleMute} title={muted ? 'Activer le son' : 'Couper le son'}>
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* ── Barre de timer ── */}
      <div className="timer-bar-wrapper">
        <div
          className="timer-bar"
          style={{
            width: `${timerPercent}%`,
            backgroundColor: timerColor,
            transition: 'width 1s linear, background-color 0.3s',
          }}
        />
      </div>

      {/* ── Chrono ── */}
      <div
        className={`timer-display ${isUrgent ? 'timer-urgent' : ''}`}
        style={{ color: timerColor }}
      >
        {showResult ? '⏱' : timeLeft}
        {!showResult && <span style={{ fontSize: '0.6em' }}>s</span>}
      </div>

      {/* ── Contenu ── */}
      <div className="quiz-content">
        <div className="question-card">
          {question?.image && (
            <div className="question-image-wrap">
              <img
                src={question.image}
                alt="Indice visuel"
                className="question-image"
              />
            </div>
          )}
          <p className="question-text">{question?.question}</p>
        </div>

        <div key={questionKey} className={`options-grid ${question?.options?.length === 2 ? 'options-two' : 'options-four'}`}>
          {question?.options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${getOptionClass(i)}`}
              style={{ '--option-color': OPTION_COLORS[i % OPTION_COLORS.length] }}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null || showResult}
            >
              <span className="option-label">{OPTION_LABELS[i]}</span>
              <span className="option-text">{opt}</span>
              {showResult && i === correctIndex && <span className="option-tick">✓</span>}
              {showResult && selectedAnswer === i && i !== correctIndex && <span className="option-tick">✗</span>}
            </button>
          ))}
        </div>

        {selectedAnswer !== null && !showResult && (
          <div className="answer-pending">
            ⏳ Réponse envoyée — en attente des autres joueurs…
          </div>
        )}

        {showResult && (
          <div className={`result-banner ${selectedAnswer === correctIndex ? 'result-correct' : 'result-wrong'}`}>
            {selectedAnswer === null ? (
              <>⏰ Temps écoulé !</>
            ) : selectedAnswer === correctIndex ? (
              <>🎉 Bravo ! +{pointsGained} pts</>
            ) : (
              <>❌ Dommage !</>
            )}
          </div>
        )}

        {showResult && (
          <div className="mini-leaderboard">
            <h4>🏆 Classement instantané</h4>
            <div className="mini-scores">
              {[...questionResults]
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((r, i) => (
                  <div key={r.id} className={`mini-row ${r.id === socket.id ? 'mini-row-me' : ''}`}>
                    <span className="mini-rank">#{i + 1}</span>
                    <span className="mini-avatar">{r.avatar}</span>
                    <span className="mini-name">{r.name}</span>
                    <span className="mini-score">{r.score} pts</span>
                    {r.correct && <span className="mini-correct">✓</span>}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
