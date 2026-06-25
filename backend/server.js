const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const questions = [
  {
    id: 1, level: 'Facile', emoji: '🟢',
    question: "En quelle année SEPTEO a-t-elle été créée ?",
    options: ["2008", "2010", "2013", "2018"],
    correctIndex: 2, timeLimit: 15,
  },
  {
    id: 2, level: 'Facile', emoji: '🟢',
    question: "Quel est le secteur d'activité principal de SEPTEO ?",
    options: ["Construction", "Banque", "Édition de logiciels et services numériques", "Automobile"],
    correctIndex: 2, timeLimit: 15,
  },
  {
    id: 3, level: 'Facile', emoji: '🟢',
    question: "Dans combien de pays SEPTEO est-elle implantée ?",
    options: ["2 pays", "5 pays", "Plus de 10 pays", "Plus de 20 pays"],
    correctIndex: 2, timeLimit: 15,
  },
  {
    id: 4, level: 'Facile', emoji: '🟢',
    question: "Combien de collaborateurs compte environ SEPTEO ?",
    options: ["500", "1 500", "Plus de 3 000", "Plus de 5 000"],
    correctIndex: 2, timeLimit: 15,
  },
  {
    id: 5, level: 'Facile', emoji: '🟢',
    question: "Quel est le cœur de métier de SEPTEO ?",
    options: ["Fabrication de matériel informatique", "Développement de logiciels métiers", "Vente de téléphones", "Publicité"],
    correctIndex: 1, timeLimit: 15,
  },
  {
    id: 6, level: 'Moyen', emoji: '🟡',
    question: "Quel secteur n'est PAS adressé par SEPTEO ?",
    options: ["Immobilier", "Notaires", "Avocats", "Compagnies aériennes"],
    correctIndex: 3, timeLimit: 15,
  },
  {
    id: 7, level: 'Moyen', emoji: '🟡',
    question: "SEPTEO accompagne principalement :",
    options: ["Les particuliers", "Les professionnels", "Les étudiants", "Les touristes"],
    correctIndex: 1, timeLimit: 15,
  },
  {
    id: 8, level: 'Moyen', emoji: '🟡',
    question: "Quelle est la couleur dominante du logo SEPTEO ?",
    options: ["Rouge", "Orange", "Vert", "Violet"],
    correctIndex: 1, timeLimit: 15,
  },
  {
    id: 9, level: 'Moyen', emoji: '🟡',
    question: "Que signifie la transformation digitale pour SEPTEO ?",
    options: ["Utiliser uniquement le papier", "Accompagner les métiers grâce au numérique", "Vendre des ordinateurs", "Créer des jeux vidéo"],
    correctIndex: 1, timeLimit: 15,
  },
  {
    id: 10, level: 'Moyen', emoji: '🟡',
    question: "Quel est l'objectif principal des logiciels SEPTEO ?",
    options: ["Jouer", "Simplifier le travail des professionnels", "Regarder des vidéos", "Faire du montage photo"],
    correctIndex: 1, timeLimit: 15,
  },
  {
    id: 11, level: 'Difficile', emoji: '🔴',
    question: "Quel est le slogan ou la vision de SEPTEO ?",
    options: [
      "Innover pour demain",
      "Accompagner la transformation numérique des professionnels",
      "Le numérique pour tous",
      "Simplifier le monde",
    ],
    correctIndex: 1, timeLimit: 15,
  },
  {
    id: 12, level: 'Difficile', emoji: '🔴',
    question: "Quel secteur historique est fortement représenté chez SEPTEO ?",
    options: ["Agriculture", "Notariat", "Textile", "Tourisme"],
    correctIndex: 1, timeLimit: 15,
  },
  {
    id: 13, level: 'Difficile', emoji: '🔴',
    question: "SEPTEO développe principalement :",
    options: ["Des logiciels SaaS", "Des vêtements", "Des appareils médicaux", "Des voitures"],
    correctIndex: 0, timeLimit: 15,
  },
  {
    id: 14, level: 'Difficile', emoji: '🔴',
    question: "Que signifie SaaS ?",
    options: ["Software as a Service", "Security as a System", "Software and Services", "Simple Application System"],
    correctIndex: 0, timeLimit: 15,
  },
  {
    id: 15, level: 'Difficile', emoji: '🔴',
    question: "Quel est l'objectif d'une innovation chez SEPTEO ?",
    options: ["Rendre les métiers plus performants", "Créer plus de papier", "Remplacer les collaborateurs", "Vendre des télévisions"],
    correctIndex: 0, timeLimit: 15,
  },
  {
    id: 16, level: '📸 Photo', emoji: '📸',
    question: "🏢 Reconnaissez-vous ce bâtiment ? Dans quelle ville se trouve le siège principal de SEPTEO ?",
    image: '/siege.png',
    options: ["Paris", "Île-de-France", "Toulouse", "Montpellier"],
    correctIndex: 3, timeLimit: 20,
  },
  {
    id: 17, level: 'Fun ⚡', emoji: '⚡',
    question: "⚡ SPEED ROUND ! En quelle année SEPTEO a-t-elle été fondée ?",
    options: ["2011", "2012", "2013", "2014"],
    correctIndex: 2, timeLimit: 10,
  },
  {
    id: 18, level: 'Fun ⚡', emoji: '⚡',
    question: "Vrai ou Faux : SEPTEO développe des logiciels pour les notaires.",
    options: ["✅ Vrai", "❌ Faux"],
    correctIndex: 0, timeLimit: 10,
  },
  {
    id: 19, level: 'Fun ⚡', emoji: '⚡',
    question: "Vrai ou Faux : SEPTEO fabrique des smartphones.",
    options: ["✅ Vrai", "❌ Faux"],
    correctIndex: 1, timeLimit: 10,
  },
  {
    id: 20, level: 'Fun ⚡', emoji: '⚡',
    question: "🔍 Quel est l'intrus parmi les clients de SEPTEO ?",
    options: ["Notaires", "Avocats", "Immobilier", "Fast-food"],
    correctIndex: 3, timeLimit: 10,
  },
  {
    id: 21, level: 'Fun ⚡', emoji: '⚡',
    question: "Compléter : SEPTEO accompagne la __________ des professionnels.",
    options: ["innovation technologique", "transformation numérique", "révolution digitale", "modernisation informatique"],
    correctIndex: 1, timeLimit: 10,
  },
  {
    id: 22, level: 'RH 🏢', emoji: '🏢',
    question: "À partir de combien de minutes un retard est-il comptabilisé ?",
    options: ["2 minutes", "4 minutes", "5 minutes", "10 minutes"],
    correctIndex: 1, timeLimit: 10,
  },
  {
    id: 23, level: 'RH 🏢', emoji: '🏢',
    question: "Quel est le délai maximal pour transmettre un certificat médical au RH ?",
    options: ["24 heures", "48 heures", "72 heures", "1 semaine"],
    correctIndex: 1, timeLimit: 10,
  },
];

const rooms = new Map();

function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function calculateScore(timeElapsed, timeLimit) {
  const ratio = 1 - timeElapsed / timeLimit;
  return Math.round(500 + 500 * ratio);
}

function getRoomPublicState(room) {
  return {
    code: room.code,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      score: p.score,
      avatar: p.avatar,
    })),
    status: room.status,
    currentQuestionIndex: room.currentQuestionIndex,
  };
}

function startQuestionTimer(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const q = questions[room.currentQuestionIndex];
  const timeLimit = q.timeLimit;
  room.questionStartTime = Date.now();
  room.answeredPlayers = new Set();

  if (room.questionTimer) clearTimeout(room.questionTimer);

  room.questionTimer = setTimeout(() => {
    endQuestion(roomCode);
  }, timeLimit * 1000);
}

function endQuestion(roomCode) {
  const room = rooms.get(roomCode);
  if (!room || room.status !== 'playing') return;

  if (room.questionTimer) {
    clearTimeout(room.questionTimer);
    room.questionTimer = null;
  }

  const q = questions[room.currentQuestionIndex];

  const questionResults = room.players.map((p) => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    score: p.score,
    answerIndex: p.currentAnswer !== undefined ? p.currentAnswer : null,
    correct: p.currentAnswer === q.correctIndex,
    pointsGained: p.currentAnswerPoints || 0,
  }));

  room.players.forEach((p) => {
    p.currentAnswer = undefined;
    p.currentAnswerPoints = 0;
  });

  io.to(roomCode).emit('question:end', {
    correctIndex: q.correctIndex,
    results: questionResults,
  });

  setTimeout(() => {
    room.currentQuestionIndex++;
    if (room.currentQuestionIndex >= questions.length) {
      endGame(roomCode);
    } else {
      sendNextQuestion(roomCode);
    }
  }, 4000);
}

function sendNextQuestion(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const q = questions[room.currentQuestionIndex];
  const questionData = {
    id: q.id,
    question: q.question,
    options: q.options,
    level: q.level,
    emoji: q.emoji,
    timeLimit: q.timeLimit,
    image: q.image || null,
    questionIndex: room.currentQuestionIndex,
    totalQuestions: questions.length,
  };

  io.to(roomCode).emit('question:new', questionData);
  startQuestionTimer(roomCode);
}

function endGame(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  room.status = 'finished';

  const finalScores = room.players
    .map((p) => ({ id: p.id, name: p.name, score: p.score, avatar: p.avatar }))
    .sort((a, b) => b.score - a.score);

  io.to(roomCode).emit('game:end', { finalScores });
}

io.on('connection', (socket) => {
  console.log(`[+] Connected: ${socket.id}`);

  socket.on('admin:create-room', (callback) => {
    let code;
    do {
      code = generateRoomCode();
    } while (rooms.has(code));

    const room = {
      code,
      adminId: socket.id,
      players: [],
      status: 'waiting',
      currentQuestionIndex: 0,
      questionTimer: null,
      questionStartTime: null,
      answeredPlayers: new Set(),
    };

    rooms.set(code, room);
    socket.join(code);
    socket.roomCode = code;
    socket.isAdmin = true;

    console.log(`[Room] Created: ${code}`);
    if (callback) callback({ code });
  });

  socket.on('player:join', ({ code, name, avatar }, callback) => {
    const room = rooms.get(code);

    if (!room) {
      if (callback) callback({ error: 'Room introuvable. Vérifiez le code.' });
      return;
    }
    if (room.status !== 'waiting') {
      if (callback) callback({ error: 'La partie a déjà commencé.' });
      return;
    }

    const existingPlayer = room.players.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (existingPlayer) {
      if (callback) callback({ error: 'Ce pseudo est déjà utilisé.' });
      return;
    }

    const player = {
      id: socket.id,
      name,
      avatar: avatar || '🎮',
      score: 0,
      currentAnswer: undefined,
      currentAnswerPoints: 0,
    };

    room.players.push(player);
    socket.join(code);
    socket.roomCode = code;
    socket.playerName = name;

    io.to(code).emit('room:update', getRoomPublicState(room));
    if (callback) callback({ success: true, roomState: getRoomPublicState(room) });
    console.log(`[Room ${code}] ${name} joined`);
  });

  socket.on('admin:start', () => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.adminId !== socket.id) return;
    if (room.players.length === 0) return;

    room.status = 'playing';
    room.currentQuestionIndex = 0;

    io.to(socket.roomCode).emit('game:start');

    setTimeout(() => {
      sendNextQuestion(socket.roomCode);
    }, 1000);
  });

  socket.on('player:answer', ({ answerIndex }) => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.status !== 'playing') return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
    if (player.currentAnswer !== undefined) return;

    const timeElapsed = (Date.now() - room.questionStartTime) / 1000;
    const q = questions[room.currentQuestionIndex];
    const isCorrect = answerIndex === q.correctIndex;

    player.currentAnswer = answerIndex;
    player.currentAnswerPoints = 0;

    if (isCorrect) {
      const points = calculateScore(timeElapsed, q.timeLimit);
      player.score += points;
      player.currentAnswerPoints = points;
    }

    room.answeredPlayers.add(socket.id);
    socket.emit('answer:confirmed', { answerIndex, isCorrect });

    if (room.answeredPlayers.size === room.players.length) {
      endQuestion(socket.roomCode);
    }
  });

  socket.on('admin:kick', ({ playerId }) => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.adminId !== socket.id) return;

    room.players = room.players.filter((p) => p.id !== playerId);
    io.to(playerId).emit('player:kicked');
    io.to(socket.roomCode).emit('room:update', getRoomPublicState(room));
  });

  socket.on('disconnect', () => {
    console.log(`[-] Disconnected: ${socket.id}`);
    const roomCode = socket.roomCode;
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    if (room.adminId === socket.id) {
      io.to(roomCode).emit('room:closed', { message: "L'admin a quitté la partie." });
      if (room.questionTimer) clearTimeout(room.questionTimer);
      rooms.delete(roomCode);
      console.log(`[Room ${roomCode}] Closed (admin left)`);
    } else {
      room.players = room.players.filter((p) => p.id !== socket.id);
      io.to(roomCode).emit('room:update', getRoomPublicState(room));
      if (room.status === 'playing' && room.answeredPlayers) {
        room.answeredPlayers.delete(socket.id);
        if (room.players.length > 0 && room.answeredPlayers.size === room.players.length) {
          endQuestion(roomCode);
        }
      }
    }
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok', rooms: rooms.size }));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 Quiz SEPTEO Server running on port ${PORT}\n`);
});
