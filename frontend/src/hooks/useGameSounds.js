/**
 * useGameSounds — effets sonores 100% Web Audio API (aucun fichier requis)
 *
 * Sons disponibles :
 *   tick(fast)       — clic de métronome (fast=true → urgent, 3 dernières secondes)
 *   playCorrect()    — jingle de bonne réponse  (arpège ascendant)
 *   playWrong()      — son de mauvaise réponse  (descente grave)
 *   playStart()      — fanfare de lancement de question
 *   playVictory()    — mélodie de victoire (podium)
 *   playCountdown()  — 3-2-1 solennel avant le quiz
 *   startBg()        — ambiance jungle en boucle (bruit rose filtré + drone)
 *   stopBg()         — arrêter l'ambiance
 *   muted            — état muet
 *   toggleMute()     — basculer muet/son
 */

import { useRef, useCallback, useState } from 'react';

/* ── Contexte audio partagé ──────────────────────────────────── */
let _ctx = null;
function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Reprendre si suspendu (politique autoplay navigateur)
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

/* ── Note simple ─────────────────────────────────────────────── */
function note(freq, duration, { type = 'sine', vol = 0.28, delay = 0 } = {}) {
  const c = ctx();
  const osc  = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + delay);
  gain.gain.setValueAtTime(0, c.currentTime + delay);
  gain.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + duration);
  osc.start(c.currentTime + delay);
  osc.stop(c.currentTime + delay + duration + 0.05);
}

/* ── Bruit rose (ambiance fond) ──────────────────────────────── */
function buildPinkNoise(audioCtx) {
  const sr         = audioCtx.sampleRate;
  const bufSize    = sr * 3; // 3 s en boucle
  const buf        = audioCtx.createBuffer(1, bufSize, sr);
  const data       = buf.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i = 0; i < bufSize; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886*b0 + w*0.0555179;
    b1 = 0.99332*b1 + w*0.0750759;
    b2 = 0.96900*b2 + w*0.1538520;
    b3 = 0.86650*b3 + w*0.3104856;
    b4 = 0.55000*b4 + w*0.5329522;
    b5 = -0.7616*b5 - w*0.0168980;
    data[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11;
    b6 = w*0.115926;
  }
  return buf;
}

/* ═══════════════════════════════════════════════════════════════ */
export function useGameSounds() {
  const [muted, setMuted] = useState(false);
  const mutedRef  = useRef(false);
  const bgRef     = useRef(null);   // { source, gainNode }
  const droneRef  = useRef(null);   // drone harmonique

  /* ── Mute ────────────────────────────────────────────────── */
  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    if (next) {
      // couper le fond
      bgRef.current?.gainNode?.gain.setTargetAtTime(0, ctx().currentTime, 0.3);
      droneRef.current?.gain.setTargetAtTime(0, ctx().currentTime, 0.3);
    } else {
      bgRef.current?.gainNode?.gain.setTargetAtTime(0.06, ctx().currentTime, 0.5);
      droneRef.current?.gain.setTargetAtTime(0.04, ctx().currentTime, 0.5);
    }
    return next;
  }, []);

  /* ── Tick-tock ───────────────────────────────────────────── */
  const tick = useCallback((fast = false) => {
    if (mutedRef.current) return;
    const freq = fast ? 1400 : 950;
    const vol  = fast ? 0.40 : 0.22;
    note(freq, fast ? 0.05 : 0.07, { type: 'square', vol });
    // "tock" léger 40 ms après
    note(fast ? 950 : 650, fast ? 0.04 : 0.06, { type: 'square', vol: vol * 0.6, delay: 0.04 });
  }, []);

  /* ── Bonne réponse ───────────────────────────────────────── */
  const playCorrect = useCallback(() => {
    if (mutedRef.current) return;
    // Arpège majeur montant joyeux
    [[523, 0], [659, 0.09], [784, 0.18], [1047, 0.27], [1319, 0.38]].forEach(([f, d]) =>
      note(f, 0.22, { vol: 0.28, delay: d })
    );
  }, []);

  /* ── Mauvaise réponse ────────────────────────────────────── */
  const playWrong = useCallback(() => {
    if (mutedRef.current) return;
    // Descente grave dissonante
    [[330, 0], [294, 0.1], [247, 0.22]].forEach(([f, d]) =>
      note(f, 0.2, { type: 'sawtooth', vol: 0.22, delay: d })
    );
    note(180, 0.35, { type: 'sawtooth', vol: 0.15, delay: 0.32 });
  }, []);

  /* ── Lancement question ──────────────────────────────────── */
  const playStart = useCallback(() => {
    if (mutedRef.current) return;
    note(880,  0.12, { vol: 0.20 });
    note(1047, 0.15, { vol: 0.22, delay: 0.13 });
  }, []);

  /* ── Compte à rebours solennel (3-2-1) ──────────────────── */
  const playCountdown = useCallback(() => {
    if (mutedRef.current) return;
    [0, 0.55, 1.10].forEach((d) => note(660, 0.25, { vol: 0.25, delay: d }));
    note(1047, 0.4, { vol: 0.3, delay: 1.65 });
  }, []);

  /* ── Victoire (podium) ───────────────────────────────────── */
  const playVictory = useCallback(() => {
    if (mutedRef.current) return;
    const melody = [
      [523, 0.00], [659, 0.13], [784, 0.26],
      [1047, 0.40], [784, 0.55], [1047, 0.68], [1319, 0.82],
      [1047, 1.05], [1319, 1.20], [1568, 1.35],
    ];
    melody.forEach(([f, d]) => note(f, 0.26, { vol: 0.28, delay: d }));
    // accord final
    [523, 659, 784, 1047].forEach((f) => note(f, 0.9, { vol: 0.18, delay: 1.65 }));
  }, []);

  /* ── Ambiance jungle fond ────────────────────────────────── */
  const startBg = useCallback(() => {
    if (mutedRef.current) return;
    const c = ctx();

    // Bruit rose → vent
    if (!bgRef.current) {
      const noiseBuf = buildPinkNoise(c);
      const source   = c.createBufferSource();
      source.buffer  = noiseBuf;
      source.loop    = true;

      const filter   = c.createBiquadFilter();
      filter.type    = 'bandpass';
      filter.frequency.value = 350;
      filter.Q.value = 0.5;

      const gainNode = c.createGain();
      gainNode.gain.setValueAtTime(0, c.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.06, c.currentTime + 2);

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(c.destination);
      source.start();
      bgRef.current = { source, gainNode };
    }

    // Drone harmonique doux
    if (!droneRef.current) {
      const osc  = c.createOscillator();
      const gain = c.createGain();
      osc.type   = 'sine';
      osc.frequency.setValueAtTime(110, c.currentTime);
      gain.gain.setValueAtTime(0, c.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, c.currentTime + 3);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      droneRef.current = gain;
    }
  }, []);

  const stopBg = useCallback(() => {
    const c = ctx();
    if (bgRef.current) {
      bgRef.current.gainNode.gain.setTargetAtTime(0, c.currentTime, 0.5);
      setTimeout(() => {
        try { bgRef.current?.source.stop(); } catch (_) {}
        bgRef.current = null;
      }, 1500);
    }
    if (droneRef.current) {
      droneRef.current.gain.setTargetAtTime(0, c.currentTime, 0.5);
      droneRef.current = null;
    }
  }, []);

  return {
    muted, toggleMute,
    tick, playCorrect, playWrong, playStart, playCountdown, playVictory,
    startBg, stopBg,
  };
}
