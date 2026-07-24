// ========== Turbo 3D — Constantes ==========

export const SAVE_KEY = 'turbo3d_save_v2';
export const WORLD = 460;
export const MAX_POLICE = 5;

export const CARS = [
  { name: 'Compacto',       rarity: 'comun',      price: 0,    color: 0xf4c95d, speed: 1.00, handling: 1.00, shape: 'compacto' },
  { name: 'Pickup',         rarity: 'comun',      price: 300,  color: 0x8a8f9a, speed: 0.95, handling: 1.10, shape: 'pickup' },
  { name: 'Deportivo',      rarity: 'raro',       price: 900,  color: 0x2f6fb0, speed: 1.15, handling: 1.05, shape: 'deportivo' },
  { name: 'Muscle Car',     rarity: 'raro',       price: 1600, color: 0xe6595f, speed: 1.25, handling: 0.95, shape: 'muscle' },
  { name: 'Superdeportivo', rarity: 'epico',      price: 3500, color: 0x8a4bd1, speed: 1.40, handling: 1.10, shape: 'super' },
  { name: 'Prototipo X',    rarity: 'legendario', price: 8000, color: 0xc98f2a, speed: 1.60, handling: 1.25, shape: 'proto' },
];

export const RARITY_LABEL = {
  comun: 'Común', raro: 'Raro', epico: 'Épico', legendario: 'Legendario'
};

export const CAMERA = {
  groundDist: 22, elevationDeg: 32, cornerDeg: 35, lerpFactor: 0.18
};

export const PHYSICS = {
  accelForward: 38, accelReverse: 22, maxSpeedBase: 60,
  minSpeed: -22, friction: 0.99, turnRateBase: 1.9,
  driftRate: 0.6, driftLerpFast: 4.0, driftLerpSlow: 2.0
};

export const POLICE = {
  speedBase: 16, speedPerStar: 3.5, spawnDistance: 45,
  catchDistance: 3.2, accel: 18, wantedThreshold: 150,
  wantedDecreaseRate: 1.5, starInterval: 4
};

export const ECONOMY = {
  moneyPerSpeedUnit: 0.7, minSpeedForMoney: 4
};

export const CITY_BUILDINGS = [
  { x: 90,  z: -30, w: 14, h: 18, d: 14, color: 0xc0b8a8 },
  { x: 114, z: -28, w: 16, h: 22, d: 12, color: 0xa8b0c0 },
  { x: 138, z: -32, w: 12, h: 16, d: 16, color: 0xb8a0b0 },
  { x: 92,  z: -4,  w: 15, h: 20, d: 13, color: 0x9098a8 },
  { x: 116, z: -2,  w: 13, h: 24, d: 15, color: 0xc0b8a8 },
  { x: 140, z: -6,  w: 14, h: 19, d: 12, color: 0xa8b0c0 },
];

export const ROADS = [
  [24, 460, 0, 0], [460, 24, 0, 0],
  [16, 200, 130, 60], [200, 16, -100, -120],
  [16, 460, -180, 0], [16, 460, 180, 0],
  [460, 16, 0, -180], [460, 16, 0, 180],
  [18, 260, 60, -90], [260, 18, -60, 90],
];

export const LAKE = { x: -140, z: 120, w: 80, h: 80 };
