import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://quiz-septeo-production.up.railway.app';

const socket = io(BACKEND_URL, {
  autoConnect: true,
  reconnection: true,
  transports: ['websocket', 'polling'],
});

export default socket;
