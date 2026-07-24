// ========== Turbo 3D — Interfaz de Usuario ==========

import { CARS, RARITY_LABEL, MAX_POLICE, ROADS, WORLD } from './constants.js';
import { save, saveGame, canOpenDailyChest, canOpenStreakChest, getTimeUntilDaily, openChest, getLeaderboard } from './save.js';

let ui = {};

export function initUI() {
  ui = {
    spd: document.getElementById('spd'),
    money: document.getElementById('money'),
    total: document.getElementById('total'),
    stars: document.getElementById('stars'),
    speedBar: document.getElementById('speedBar'),
    overlay: document.getElementById('overlay'),
    overlayTitle: document.getElementById('overlayTitle'),
    garage: document.getElementById('garage'),
    btnPlay: document.getElementById('btnPlay'),
    btnLeaderboard: document.getElementById('btnLeaderboard'),
    btnChests: document.getElementById('btnChests'),
    leaderboard: document.getElementById('leaderboard'),
    chestPanel: document.getElementById('chestPanel'),
    gameOverStats: document.getElementById('gameOverStats')
  };
}

export function getUI() { return ui; }

export function renderGarage(onCarSelect) {
  const g = ui.garage;
  g.innerHTML = '';
  CARS.forEach((car, i) => {
    const owned = save.owned.includes(i);
    const row = document.createElement('div');
    row.className = 'car-row' + (save.active === i ? ' sel' : '');
    const statsText = `Vel: ${(car.speed * 100).toFixed(0)}% | Manejo: ${(car.handling * 100).toFixed(0)}%`;
    row.innerHTML = `
      <div class="car-info">
        <span><b>${car.name}</b> <span class="rarity r-${car.rarity}">${RARITY_LABEL[car.rarity]}</span></span>
        <div class="car-stats">${statsText}</div>
      </div>
      <span>${owned ? (save.active === i ? '✅ Equipado' : 'Seleccionar') : '💰 ' + car.price}</span>
    `;
    row.onclick = () => {
      if (owned) save.active = i;
      else if (save.totalMoney >= car.price) {
        save.totalMoney -= car.price; save.owned.push(i); save.active = i;
      }
      saveGame(); renderGarage(onCarSelect); updateHud(0, 0);
      if (onCarSelect) onCarSelect();
    };
    g.appendChild(row);
  });
  const info = document.createElement('div');
  info.style.cssText = 'text-align:center;margin-top:10px;color:#8a8fb8;font-size:12px;';
  info.textContent = `💰 Disponible: ${save.totalMoney}   ·   Récord: ${save.best} pts   ·   Partidas: ${save.gamesPlayed}`;
  g.appendChild(info);
}

export function showMainMenu() {
  ui.overlayTitle.textContent = 'TURBO 3D';
  ui.garage.style.display = 'block';
  ui.leaderboard.style.display = 'none';
  ui.chestPanel.style.display = 'none';
  ui.gameOverStats.style.display = 'none';
  ui.btnPlay.textContent = '▶ Jugar';
  ui.btnPlay.style.display = 'inline-block';
  ui.overlay.classList.add('show');
}

export function showGameOver(stats) {
  ui.overlayTitle.textContent = '¡ATRAPADO!';
  ui.garage.style.display = 'none';
  ui.leaderboard.style.display = 'none';
  ui.chestPanel.style.display = 'none';
  ui.gameOverStats.style.display = 'block';
  ui.gameOverStats.innerHTML = `
    <div class="score-display">💰 ${stats.score}</div>
    <div class="stat-row"><span class="stat-label">Tiempo</span><span class="stat-value">${stats.survivalTime.toFixed(1)}s</span></div>
    <div class="stat-row"><span class="stat-label">Máx. Velocidad</span><span class="stat-value">${stats.maxSpeed.toFixed(0)} km/h</span></div>
    <div class="stat-row"><span class="stat-label">Nivel Wanted</span><span class="stat-value">${stats.wantedLevel} ★</span></div>
  `;
  ui.btnPlay.textContent = '↻ Reintentar';
  ui.btnPlay.style.display = 'inline-block';
  ui.overlay.classList.add('show');
}

export function updateHud(speed, money) {
  const kmh = Math.round(Math.abs(speed) * 9);
  ui.spd.textContent = kmh;
  ui.money.textContent = Math.floor(money);
  ui.total.textContent = save.totalMoney;
  ui.speedBar.style.width = Math.min(100, (kmh / 200) * 100) + '%';
}

export function updateStars(level) {
  ui.stars.textContent = level > 0 ? '★'.repeat(level) + '☆'.repeat(MAX_POLICE - level) : '';
}

export function renderChestPanel() {
  const panel = ui.chestPanel;
  panel.innerHTML = '<h3 style="color:#f4c95d;margin-bottom:10px;">🎁 Cofres</h3>';

  const dailyAvailable = canOpenDailyChest();
  const dailyTime = getTimeUntilDaily();
  const dailyDiv = document.createElement('div');
  dailyDiv.className = 'car-row';
  dailyDiv.style.cursor = dailyAvailable ? 'pointer' : 'default';
  dailyDiv.innerHTML = `<span>📅 Cofre Diario</span><span>${dailyAvailable ? '¡Abrir!' : dailyTime}</span>`;
  if (dailyAvailable) {
    dailyDiv.onclick = () => {
      const rewards = openChest('daily');
      alert('¡Cofre Diario abierto!\n' + rewards.map(r => `+💰 ${r.amount}`).join('\n'));
      renderChestPanel(); updateHud(0, 0);
    };
  }
  panel.appendChild(dailyDiv);

  const streakAvailable = canOpenStreakChest();
  const streakDiv = document.createElement('div');
  streakDiv.className = 'car-row';
  streakDiv.style.cursor = streakAvailable ? 'pointer' : 'default';
  streakDiv.innerHTML = `<span>🔥 Cofre de Racha (${save.chestStreak}/3)</span><span>${streakAvailable ? '¡Abrir!' : `${3 - save.chestStreak} más`}</span>`;
  if (streakAvailable) {
    streakDiv.onclick = () => {
      const rewards = openChest('streak');
      alert('¡Cofre de Racha abierto!\n' + rewards.map(r => `+💰 ${r.amount}`).join('\n'));
      renderChestPanel(); updateHud(0, 0);
    };
  }
  panel.appendChild(streakDiv);

  const backBtn = document.createElement('button');
  backBtn.textContent = '← Volver';
  backBtn.style.marginTop = '10px';
  backBtn.onclick = showMainMenu;
  panel.appendChild(backBtn);
}

export function renderLeaderboard() {
  const lb = ui.leaderboard;
  lb.innerHTML = '<h3 style="color:#f4c95d;margin-bottom:10px;">🏆 Mejores Puntajes</h3>';
  const scores = getLeaderboard();
  if (scores.length === 0) {
    lb.innerHTML += '<div style="color:#8a8fb8;text-align:center;padding:20px;">Sin partidas registradas aún</div>';
  } else {
    scores.forEach((entry, i) => {
      const row = document.createElement('div');
      row.className = 'leaderboard-row' + (i < 3 ? ' top3' : '');
      const date = new Date(entry.date).toLocaleDateString('es-ES');
      row.innerHTML = `<span>#${i + 1} ${entry.initials} — ${entry.car}</span><span>💰 ${entry.score} (${date})</span>`;
      lb.appendChild(row);
    });
  }
  const backBtn = document.createElement('button');
  backBtn.textContent = '← Volver';
  backBtn.style.marginTop = '10px';
  backBtn.onclick = showMainMenu;
  lb.appendChild(backBtn);
}

export function drawMinimap(player, policeUnits, obstacles, roads) {
  const canvas = document.getElementById('minimap');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 150, 150);
  ctx.fillStyle = '#1f2233'; ctx.fillRect(0, 0, 150, 150);
  const scale = 150 / WORLD;
  const toMap = (x, z) => [75 + x * scale, 75 + z * scale];

  const [lx, lz] = toMap(-140, 120);
  ctx.fillStyle = '#2f6fb0'; ctx.fillRect(lx - 40 * scale, lz - 40 * scale, 80 * scale, 80 * scale);

  ctx.fillStyle = '#3a3d4e';
  roads.forEach(([w, h, x, z]) => {
    const [rx, rz] = toMap(x, z);
    ctx.fillRect(rx - (w / 2) * scale, rz - (h / 2) * scale, w * scale, h * scale);
  });

  ctx.fillStyle = '#a8b0c0';
  obstacles.forEach(o => {
    if (o.type === 'lake') return;
    const [ox, oz] = toMap(o.x, o.z);
    ctx.fillRect(ox - 2, oz - 2, 4, 4);
  });

  const [px, pz] = toMap(player.x, player.z);
  ctx.fillStyle = '#f4c95d'; ctx.beginPath(); ctx.arc(px, pz, 4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#f4c95d'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(px, pz);
  ctx.lineTo(px + Math.sin(player.heading) * 8, pz + Math.cos(player.heading) * 8); ctx.stroke();

  policeUnits.forEach(u => {
    if (!u.active) return;
    const [qx, qz] = toMap(u.x, u.z);
    ctx.fillStyle = '#e6595f'; ctx.beginPath(); ctx.arc(qx, qz, 3.5, 0, Math.PI * 2); ctx.fill();
  });
}
