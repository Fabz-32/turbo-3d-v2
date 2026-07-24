// ========== Turbo 3D — Modelos 3D ==========

import { WORLD, CITY_BUILDINGS, ROADS, LAKE } from './constants.js';

function mat(color) { return new THREE.MeshLambertMaterial({ color }); }

function addWheels(group, wheelMat, hw, frontZ, backZ, wy, size) {
  const wheelGeo = new THREE.BoxGeometry(size, size * 1.6, size * 1.6);
  [[hw, wy, frontZ], [-hw, wy, frontZ], [hw, wy, backZ], [-hw, wy, backZ]].forEach(([x, y, z]) => {
    const w = new THREE.Mesh(wheelGeo, wheelMat); w.position.set(x, y, z); group.add(w);
  });
}

export function buildCar(color, shape) {
  shape = shape || 'compacto';
  const g = new THREE.Group();
  const wheelMat = mat(0x111111);

  if (shape === 'compacto') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 3.6), mat(color));
    body.position.y = 0.68; g.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.9, 2.2), mat(0x1a1c2a));
    cabin.position.set(0, 1.5, 0); g.add(cabin);
    addWheels(g, wheelMat, 1.1, 1.3, -1.3, 0.45, 0.5);

  } else if (shape === 'pickup') {
    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.1, 2.0), mat(color));
    cab.position.set(0, 0.85, 0.9); g.add(cab);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.9, 1.4), mat(0x1a1c2a));
    cabin.position.set(0, 1.75, 1.1); g.add(cabin);
    const bed = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 2.6), mat(color));
    bed.position.set(0, 0.65, -1.7); g.add(bed);
    const bedWalls = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 0.2), mat(color));
    bedWalls.position.set(0, 1.15, -2.9); g.add(bedWalls);
    addWheels(g, wheelMat, 1.15, 1.2, -1.8, 0.45, 0.55);

  } else if (shape === 'deportivo') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.6, 4.2), mat(color));
    body.position.y = 0.55; g.add(body);
    const wedge = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 1.2), mat(color));
    wedge.position.set(0, 0.55, 2.3); g.add(wedge);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 1.9), mat(0x1a1c2a));
    cabin.position.set(0, 1.05, -0.3); g.add(cabin);
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 0.35), mat(0x1a1c2a));
    spoiler.position.set(0, 1.05, -2.15); g.add(spoiler);
    addWheels(g, wheelMat, 1.1, 1.5, -1.5, 0.4, 0.5);

  } else if (shape === 'muscle') {
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.75, 2.4), mat(color));
    hood.position.set(0, 0.65, 1.5); g.add(hood);
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.9, 1.8), mat(color));
    body.position.set(0, 0.7, -0.5); g.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.85, 1.5), mat(0x1a1c2a));
    cabin.position.set(0, 1.35, 0.3); g.add(cabin);
    const fastback = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.55, 1.4), mat(0x1a1c2a));
    fastback.position.set(0, 1.05, -1.2); g.add(fastback);
    addWheels(g, wheelMat, 1.2, 1.3, -1.4, 0.45, 0.58);

  } else if (shape === 'super') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 4.0), mat(color));
    body.position.y = 0.42; g.add(body);
    const nose = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 1.0), mat(color));
    nose.position.set(0, 0.4, 2.4); g.add(nose);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 1.6), mat(0x1a1c2a));
    cabin.position.set(0, 0.85, -0.2); g.add(cabin);
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.4), mat(0x1a1c2a));
    spoiler.position.set(0, 1.0, -2.0); g.add(spoiler);
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.15), mat(0x1a1c2a));
    leg1.position.set(0.8, 0.85, -2.0); g.add(leg1);
    const leg2 = leg1.clone(); leg2.position.set(-0.8, 0.85, -2.0); g.add(leg2);
    addWheels(g, wheelMat, 1.25, 1.5, -1.5, 0.35, 0.55);

  } else if (shape === 'proto') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 4.2), mat(color));
    body.position.y = 0.48; g.add(body);
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 1.6), mat(0x1a1c2a));
    canopy.position.set(0, 0.95, 0.6); g.add(canopy);
    const finL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.7, 1.6), mat(color));
    finL.position.set(1.1, 0.85, -1.2); g.add(finL);
    const finR = finL.clone(); finR.position.set(-1.1, 0.85, -1.2); g.add(finR);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.5), mat(0x1a1c2a));
    wing.position.set(0, 1.2, -2.1); g.add(wing);
    addWheels(g, wheelMat, 1.25, 1.55, -1.55, 0.35, 0.55);

  } else if (shape === 'policia') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 3.8), mat(color));
    body.position.y = 0.68; g.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.85, 2.1), mat(0x1a1c2a));
    cabin.position.set(0, 1.48, 0); g.add(cabin);
    const lightbar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.5), mat(0x222222));
    lightbar.position.set(0, 1.95, 0.4); g.add(lightbar);
    const lightR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.45), mat(0xe6595f));
    lightR.position.set(0.32, 1.97, 0.4); g.add(lightR);
    const lightB = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.45), mat(0x2244cc));
    lightB.position.set(-0.32, 1.97, 0.4); g.add(lightB);
    addWheels(g, wheelMat, 1.1, 1.3, -1.3, 0.45, 0.5);
  }
  return g;
}

export const obstacles = [];

export function createWorld(scene) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD, WORLD),
    new THREE.MeshLambertMaterial({ color: 0x3a6b46 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  ROADS.forEach(([w, h, x, z]) => {
    const r = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshLambertMaterial({ color: 0x4a4d5e })
    );
    r.rotation.x = -Math.PI / 2; r.position.set(x, 0.02, z); scene.add(r);
  });

  const lake = new THREE.Mesh(
    new THREE.PlaneGeometry(LAKE.w, LAKE.h),
    new THREE.MeshLambertMaterial({ color: 0x2f6fb0 })
  );
  lake.rotation.x = -Math.PI / 2;
  lake.position.set(LAKE.x, 0.03, LAKE.z);
  scene.add(lake);
  obstacles.push({ x: LAKE.x, z: LAKE.z, r: Math.max(LAKE.w, LAKE.h) / 2 + 2, type: 'lake' });

  CITY_BUILDINGS.forEach(b => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(b.w, b.h, b.d),
      new THREE.MeshLambertMaterial({ color: b.color })
    );
    mesh.position.set(b.x, b.h / 2, b.z); scene.add(mesh);
    obstacles.push({ x: b.x, z: b.z, r: Math.max(b.w, b.d) / 2 + 1.2, type: 'building' });
  });

  const treeColors = [0x2e5a34, 0x3a6b3a, 0x256633];
  for (let i = 0; i < 14; i++) {
    let x, z, attempts = 0;
    do {
      x = (Math.random() - 0.5) * WORLD * 0.9;
      z = (Math.random() - 0.5) * WORLD * 0.9;
      attempts++;
    } while (attempts < 50 && (
      Math.abs(x) < 14 || Math.abs(z) < 14 ||
      Math.hypot(x - LAKE.x, z - LAKE.z) < 50 ||
      obstacles.some(o => o.type === 'tree' && Math.hypot(x - o.x, z - o.z) < 15)
    ));

    const trunk = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 1), mat(0x5a4030));
    trunk.position.set(x, 2, z);
    const leaves = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), mat(treeColors[i % 3]));
    leaves.position.set(x, 6.5, z);
    scene.add(trunk); scene.add(leaves);
    obstacles.push({ x, z, r: 2.6, type: 'tree' });
  }
  return { ground };
}

export function createPolice(scene, count) {
  const units = [];
  for (let i = 0; i < count; i++) {
    const m = buildCar(0x2244cc, 'policia');
    m.visible = false; scene.add(m);
    units.push({ mesh: m, x: 0, z: 0, active: false, speed: 0 });
  }
  return units;
}
