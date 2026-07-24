// ========== Turbo 3D — Entry Point ==========

import { ROADS } from './constants.js';
import { createWorld, buildCar, createPolice, obstacles } from './models.js';
import { player, policeUnits, initInput, startRun, endRun, updateWanted, updatePolice, updatePlayer, checkObstacleCollision, updateCamera } from './game.js';
import { initUI, renderGarage, showMainMenu, showGameOver, updateHud, updateStars, drawMinimap, renderChestPanel, renderLeaderboard, getUI } from './ui.js';
import { saveGame } from './save.js';

// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7fb8e0);
scene.fog = new THREE.Fog(0x7fb8e0, 60, 380);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false });

function sizeRenderer() {
  renderer.setPixelRatio(1);
  renderer.setSize(innerWidth, innerHeight, true);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
document.body.appendChild(renderer.domElement);
sizeRenderer();

scene.add(new THREE.HemisphereLight(0xffffff, 0x33361f, 0.9));
const sun = new THREE.DirectionalLight(0xffffff, 0.8);
sun.position.set(60, 100, 40); scene.add(sun);

// Mundo
const policeData = createPolice(scene, 5);
policeData.forEach((p, i) => { policeUnits[i] = p; });

// UI
initUI();
initInput();

const ui = getUI();

ui.btnPlay.onclick = () => {
  startRun(scene, buildCar);
  ui.overlay.classList.remove('show');
};

ui.btnLeaderboard.onclick = () => {
  ui.garage.style.display = 'none';
  ui.leaderboard.style.display = 'block';
  ui.chestPanel.style.display = 'none';
  ui.gameOverStats.style.display = 'none';
  ui.btnPlay.style.display = 'none';
  renderLeaderboard();
};

ui.btnChests.onclick = () => {
  ui.garage.style.display = 'none';
  ui.leaderboard.style.display = 'none';
  ui.chestPanel.style.display = 'block';
  ui.gameOverStats.style.display = 'none';
  ui.btnPlay.style.display = 'none';
  renderChestPanel();
};

renderGarage();
showMainMenu();

// Game Loop
let lastTime = performance.now();
let gameOverHandled = false;

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  if (player.alive) {
    gameOverHandled = false;
    updatePlayer(dt);
    updateWanted(dt);
    if (updatePolice(dt) === 'caught' || checkObstacleCollision()) {
      handleGameOver();
      return;
    }
    updateHud(player.speed, player.money);
    updateStars(wantedLevel);
  }
  updateCamera(camera);
  drawMinimap(player, policeUnits, obstacles, ROADS);
  renderer.render(scene, camera);
}

function handleGameOver() {
  if (gameOverHandled) return;
  gameOverHandled = true;
  endRun((stats) => {
    saveGame();
    renderGarage();
    showGameOver(stats);
  });
}

window.addEventListener('resize', sizeRenderer);
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'enter' && !player.alive && ui.overlay.classList.contains('show')) {
    startRun(scene, buildCar);
    ui.overlay.classList.remove('show');
  }
});

animate();
