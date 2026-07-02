"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Bottle profile: (radius, height) pairs for LatheGeometry
const PROFILE: [number, number][] = [
  [0.000, 0.00],  // bottom center → closed cap
  [0.360, 0.01],  // bottom outer edge
  [0.410, 0.09],  // bottom bevel
  [0.420, 0.22],  // body start
  [0.420, 1.34],  // body (straight)
  [0.400, 1.49],  // shoulder start
  [0.300, 1.70],  // shoulder curve
  [0.190, 1.91],  // neck base
  [0.175, 1.97],  // neck taper
  [0.175, 2.38],  // neck straight
  [0.192, 2.40],  // top lip
];

export function BottleCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    // ── Renderer ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 4);

    // ── Lights ────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const sun = new THREE.DirectionalLight(0xffffff, 2.0);
    sun.position.set(3, 8, 5);
    scene.add(sun);

    const blueLight = new THREE.PointLight(0x2d9cff, 5, 12);
    blueLight.position.set(-3, 2, 2);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x00e5ff, 3, 8);
    cyanLight.position.set(2, -2, 3);
    scene.add(cyanLight);

    const redAccent = new THREE.PointLight(0xff3333, 1.5, 6);
    redAccent.position.set(0, 3.5, -1.5);
    scene.add(redAccent);

    // ── Bottle geometry ───────────────────────────────────────
    const profilePoints = PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
    const bottleGeo = new THREE.LatheGeometry(profilePoints, 80);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#c0dcff"),
      metalness: 0.0,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 0.68,
      side: THREE.DoubleSide,
    });
    const bottleMesh = new THREE.Mesh(bottleGeo, glassMat);

    // Inner glow — makes bottle look water-filled
    const glowGeo = new THREE.CylinderGeometry(0.37, 0.37, 1.1, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#1a50ff"),
      transparent: true,
      opacity: 0.18,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.y = 0.53;

    // Water surface
    const waterGeo = new THREE.CylinderGeometry(0.375, 0.375, 0.04, 32);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#60aaff"),
      transparent: true,
      opacity: 0.55,
      roughness: 0.0,
      metalness: 0.0,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = 1.07; // top of water fill

    // Label band
    const labelGeo = new THREE.CylinderGeometry(0.426, 0.426, 0.80, 80, 1, true);
    const labelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffffff"),
      transparent: true,
      opacity: 0.10,
      side: THREE.FrontSide,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = 0.55;

    // Cap body
    const capGeo = new THREE.CylinderGeometry(0.196, 0.186, 0.26, 32);
    const capMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#E11B22"),
      roughness: 0.3,
      metalness: 0.06,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 2.53;

    // Cap dome
    const capDomeGeo = new THREE.SphereGeometry(0.196, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const capDomeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#c81218"),
      roughness: 0.2,
      metalness: 0.06,
    });
    const capDomeMesh = new THREE.Mesh(capDomeGeo, capDomeMat);
    capDomeMesh.position.y = 2.66;

    // Group everything
    const bottleGroup = new THREE.Group();
    bottleGroup.add(bottleMesh, glowMesh, waterMesh, labelMesh, capMesh, capDomeMesh);
    bottleGroup.position.y = -1.2;
    scene.add(bottleGroup);

    // ── Bubble particles (InstancedMesh) ──────────────────────
    const BUBBLE_COUNT = 55;
    const bubbleGeo = new THREE.SphereGeometry(1, 10, 10);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#58c5ff"),
      transparent: true,
      opacity: 0.32,
      roughness: 0.0,
      clearcoat: 1.0,
    });
    const bubblesIM = new THREE.InstancedMesh(bubbleGeo, bubbleMat, BUBBLE_COUNT);
    bubblesIM.frustumCulled = false;
    scene.add(bubblesIM);

    const bubbleData = Array.from({ length: BUBBLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 5.0,
      y: (Math.random() - 0.5) * 7.0,
      z: (Math.random() - 0.5) * 2.5 - 0.5,
      r: 0.014 + Math.random() * 0.042,
      speed: 0.10 + Math.random() * 0.28,
      swayAmp: 0.04 + Math.random() * 0.08,
      swayFreq: 0.25 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
    }));
    const dummy = new THREE.Object3D();

    // ── Resize ────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(mount);

    // ── Render loop ───────────────────────────────────────────
    const clock = new THREE.Clock();
    let frameId: number;

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Bottle: float + gentle sway
      bottleGroup.position.y = -1.2 + Math.sin(t * 0.75) * 0.09;
      bottleGroup.rotation.y = Math.sin(t * 0.38) * 0.32;

      // Animate blue / cyan lights for dynamic feel
      blueLight.position.x = -3 + Math.sin(t * 0.5) * 0.8;
      cyanLight.position.x = 2 + Math.cos(t * 0.4) * 0.6;

      // Bubbles
      bubbleData.forEach((b, i) => {
        const y = ((b.y + t * b.speed + 3.5) % 7) - 3.5;
        const x = b.x + Math.sin(t * b.swayFreq + b.phase) * b.swayAmp;
        dummy.position.set(x, y, b.z);
        dummy.scale.setScalar(b.r);
        dummy.updateMatrix();
        bubblesIM.setMatrixAt(i, dummy.matrix);
      });
      bubblesIM.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };
    tick();

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      renderer.dispose();
      [
        bottleGeo, glowGeo, waterGeo, labelGeo,
        capGeo, capDomeGeo, bubbleGeo,
      ].forEach((g) => g.dispose());
      [
        glassMat, glowMat, waterMat, labelMat,
        capMat, capDomeMat, bubbleMat,
      ].forEach((m) => m.dispose());
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
