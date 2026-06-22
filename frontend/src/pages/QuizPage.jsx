import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../App.jsx';
import socket from '../socket.js';

const OPTION_COLORS = ['#FF5B27', '#7C3AED', '#059669', '#D97706'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const navigate = useNavigate();
  const { gameState } = useContext(GameContext);
  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questionResults, setQuestionResults] = useState([]);
  const [myScore, setMyScore] = useState(0);
  const [pointsGained, setPointsGained] = useState(null);
  const [phase, setPhase] = useState('loading');
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!gameState.roomCode) {
      navigate('/');
      return;
    }

    socket.on('question:new', (data) => {
      setQuestion(data);
      setSelectedAnswer(null);
      setCorrectIndex(null);
      setShowResult(false);
      setQuestionResults([]);
      setPointsGained(null);
      setTimeLeft(data.timeLimit);
      setPhase('question');
      startTimeRef.current = Date.now();

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

    socket.on('answer:confirmed', ({ answerIndex, isCorrect }) => {
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
      }
    });

    return () => {
      socket.off('question:new');
      socket.off('answer:confirmed');
      socket.off('question:end');
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [navigate, gameState.roomCode]);

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
  const timerColor = timeLeft > 7 ? '#22c55e' : timeLeft > 4 ? '#f59e0b' : '#ef4444';

  if (phase === 'loading') {
    return (
      <div className="page-center gradient-bg">
        <div className="loading-card">
          <div className="loading-spinner" />
          <p>Chargement de la question…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page gradient-bg">
      <div className="quiz-topbar">
        <div className="quiz-level">
          <span>{question?.emoji}</span>
          <span>{question?.level}</span>
        </div>
        <div className="quiz-progress">
          Question {(question?.questionIndex ?? 0) + 1} / {question?.totalQuestions}
        </div>
        <div className="quiz-score">
          ⭐ {myScore} pts
        </div>
      </div>

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

      <div className="timer-display" style={{ color: timerColor }}>
        {showResult ? '⏱' : timeLeft}
        {!showResult && <span style={{ fontSize: '0.6em' }}>s</span>}
      </div>

      <div className="quiz-content">
        <div className="question-card">
          <p className="question-text">{question?.question}</p>
        </div>

        <div className={`options-grid ${question?.options?.length === 2 ? 'options-two' : 'options-four'}`}>
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
