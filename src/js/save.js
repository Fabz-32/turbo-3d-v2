// ========== Turbo 3D — Guardado y Progresión ==========

import { SAVE_KEY, CARS } from './constants.js';

export let save = loadSave();

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        totalMoney: data.totalMoney || 0,
        best: data.best || 0,
        owned: data.owned || [0],
        active: data.active || 0,
        gamesPlayed: data.gamesPlayed || 0,
        chestStreak: data.chestStreak || 0,
        lastDailyChest: data.lastDailyChest || 0,
        leaderboard: data.leaderboard || [],
        ...data
      };
    }
  } catch (e) { console.warn('Error cargando save:', e); }
  return {
    totalMoney: 0, best: 0, owned: [0], active: 0,
    gamesPlayed: 0, chestStreak: 0, lastDailyChest: 0, leaderboard: []
  };
}

export function saveGame() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }
  catch (e) { console.warn('Error guardando:', e); }
}

export function currentCar() { return CARS[save.active]; }

// Cofres
const CHEST_STREAK_TARGET = 3;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;

export function canOpenDailyChest() {
  return Date.now() - save.lastDailyChest >= DAILY_COOLDOWN;
}

export function canOpenStreakChest() {
  return save.chestStreak >= CHEST_STREAK_TARGET;
}

export function getTimeUntilDaily() {
  const remaining = DAILY_COOLDOWN - (Date.now() - save.lastDailyChest);
  if (remaining <= 0) return null;
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export function openChest(type) {
  const rng = () => Math.random();
  const rewards = [];
  const baseMoney = type === 'daily' ? 200 : 100;
  const variance = type === 'daily' ? 300 : 150;
  rewards.push({ type: 'money', amount: Math.floor(baseMoney + rng() * variance) });

  const bonusChance = type === 'daily' ? 0.2 : 0.1;
  if (rng() < bonusChance) {
    rewards.push({ type: 'money', amount: Math.floor(500 + rng() * 500), bonus: true });
  }

  if (type === 'daily') save.lastDailyChest = Date.now();
  else if (type === 'streak') save.chestStreak = 0;

  rewards.forEach(r => { if (r.type === 'money') save.totalMoney += r.amount; });
  saveGame();
  return rewards;
}

// Leaderboard
export function addToLeaderboard(score, initials = 'AAA') {
  save.leaderboard.push({
    score, initials: initials.toUpperCase().slice(0, 3),
    date: new Date().toISOString(), car: CARS[save.active].name
  });
  save.leaderboard.sort((a, b) => b.score - a.score);
  save.leaderboard = save.leaderboard.slice(0, 10);
  saveGame();
}

export function getLeaderboard() { return save.leaderboard; }

export function incrementGamesPlayed() {
  save.gamesPlayed++;
  save.chestStreak++;
  saveGame();
}
