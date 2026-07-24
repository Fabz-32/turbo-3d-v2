// ========== Turbo 3D — Lógica del Juego ==========

import { WORLD, MAX_POLICE, CAMERA, PHYSICS, POLICE, ECONOMY } from './constants.js';
import { obstacles } from './models.js';
import { currentCar, save, incrementGamesPlayed, addToLeaderboard, saveGame } from './save.js';

export const player = {
  mesh: null, x: 0, z: 60, drift: 0, speed: 0, money: 0,
  alive: false, heading: 0, survivalTime: 0, maxSpeedReached: 0
};

export let policeUnits = [];
export let wantedLevel = 0;
let wantedTimer = 0;
export const keys = {};

export function initInput() {
  window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
  window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
}

export function resetWorldForRun() {
  player.heading = 0; player.x = 0; player.z = 60;
  player.drift = 0; player.speed = 0; player.money = 0;
  player.survivalTime = 0; player.maxSpeedReached = 0;
  wantedLevel = 0; wantedTimer = 0;
  policeUnits.forEach(p => { p.active = false; p.mesh.visible = false; p.speed = 0; });
}

export function startRun(scene, buildCarFn) {
  if (player.mesh) scene.remove(player.mesh);
  const car = currentCar();
  player.mesh = buildCarFn(car.color, car.shape);
  scene.add(player.mesh);
  resetWorldForRun();
  player.alive = true;
  incrementGamesPlayed();
}

export function endRun(onEndCallback) {
  if (!player.alive) return;
  player.alive = false;
  const score = Math.floor(player.money);
  save.totalMoney += score;
  if (score > save.best) save.best = score;
  if (score > 0) addToLeaderboard(score, 'PLY');
  saveGame();
  if (onEndCallback) onEndCallback({ score, survivalTime: player.survivalTime, maxSpeed: player.maxSpeedReached, wantedLevel });
}

export function updateWanted(dt) {
  const kmh = Math.abs(player.speed) * 9;
  if (kmh > player.maxSpeedReached) player.maxSpeedReached = kmh;
  if (kmh > POLICE.wantedThreshold) wantedTimer += dt;
  else wantedTimer = Math.max(0, wantedTimer - dt * POLICE.wantedDecreaseRate);

  const newLevel = Math.min(MAX_POLICE, Math.floor(wantedTimer / POLICE.starInterval));
  if (newLevel > wantedLevel) {
    const activeCount = policeUnits.filter(p => p.active).length;
    if (activeCount < newLevel) {
      const unit = policeUnits.find(p => !p.active);
      if (unit) {
        unit.active = true; unit.mesh.visible = true; unit.speed = 0;
        const ang = Math.random() * Math.PI * 2;
        unit.x = player.x + Math.sin(ang) * POLICE.spawnDistance;
        unit.z = player.z + Math.cos(ang) * POLICE.spawnDistance;
        const lim = WORLD / 2 - 10;
        unit.x = Math.max(-lim, Math.min(lim, unit.x));
        unit.z = Math.max(-lim, Math.min(lim, unit.z));
      }
    }
  } else if (newLevel < wantedLevel) {
    const unit = [...policeUnits].reverse().find(p => p.active);
    if (unit) { unit.active = false; unit.mesh.visible = false; }
  }
  wantedLevel = newLevel;
}

export function updatePolice(dt) {
  const speedBase = POLICE.speedBase + wantedLevel * POLICE.speedPerStar;
  const lim = WORLD / 2 - 4;
  for (const u of policeUnits) {
    if (!u.active) continue;
    const dx = player.x - u.x, dz = player.z - u.z;
    const dist = Math.hypot(dx, dz);
    const ang = Math.atan2(dx, dz);
    u.speed = Math.min(speedBase, u.speed + POLICE.accel * dt);
    u.x += Math.sin(ang) * u.speed * dt;
    u.z += Math.cos(ang) * u.speed * dt;
    u.x = Math.max(-lim, Math.min(lim, u.x));
    u.z = Math.max(-lim, Math.min(lim, u.z));
    u.mesh.position.set(u.x, 0, u.z);
    u.mesh.rotation.y = ang;
    if (dist < POLICE.catchDistance) return 'caught';
  }
  return null;
}

export function updatePlayer(dt) {
  const car = currentCar();
  const accel = keys['w'] ? PHYSICS.accelForward * car.speed :
                keys['s'] ? -PHYSICS.accelReverse * car.speed : 0;
  player.speed += accel * dt;
  player.speed *= PHYSICS.friction;
  const maxSpeed = PHYSICS.maxSpeedBase * car.speed;
  player.speed = Math.max(PHYSICS.minSpeed, Math.min(maxSpeed, player.speed));

  const steer = (keys['a'] ? 1 : 0) - (keys['d'] ? 1 : 0);
  const speedFactor = Math.min(1, Math.abs(player.speed) / 45);
  const turnRate = PHYSICS.turnRateBase * car.handling * speedFactor * (player.speed < 0 ? -1 : 1);
  player.heading += steer * turnRate * dt;

  const handbrake = keys['shift'];
  const targetDrift = handbrake && Math.abs(steer) > 0 ? steer * PHYSICS.driftRate : 0;
  const lerpSpeed = handbrake ? PHYSICS.driftLerpSlow : PHYSICS.driftLerpFast;
  player.drift += (targetDrift - player.drift) * lerpSpeed * dt;

  const velAngle = player.heading + player.drift;
  player.x += Math.sin(velAngle) * player.speed * dt;
  player.z += Math.cos(velAngle) * player.speed * dt;

  const lim = WORLD / 2 - 4;
  player.x = Math.max(-lim, Math.min(lim, player.x));
  player.z = Math.max(-lim, Math.min(lim, player.z));

  player.mesh.position.set(player.x, 0, player.z);
  player.mesh.rotation.y = player.heading + player.drift * 0.5;

  if (Math.abs(player.speed) > ECONOMY.minSpeedForMoney) {
    player.money += Math.abs(player.speed) * dt * ECONOMY.moneyPerSpeedUnit;
  }
  player.survivalTime += dt;
}

export function checkObstacleCollision() {
  for (const o of obstacles) {
    const dx = player.x - o.x, dz = player.z - o.z;
    if (Math.hypot(dx, dz) < o.r) return o.type || 'obstacle';
  }
  return null;
}

export function updateCamera(camera) {
  const height = CAMERA.groundDist * Math.tan(CAMERA.elevationDeg * Math.PI / 180);
  const cornerAngle = player.heading + CAMERA.cornerDeg * Math.PI / 180;
  const camX = player.x - Math.sin(cornerAngle) * CAMERA.groundDist;
  const camZ = player.z - Math.cos(cornerAngle) * CAMERA.groundDist;
  camera.position.lerp(new THREE.Vector3(camX, height, camZ), CAMERA.lerpFactor);
  camera.lookAt(player.x, 0.5, player.z);
}
