"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function BubbleCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 4);

    // Colored lights give the bubbles a brand-matching sheen
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const blueLight = new THREE.PointLight(0x2d9cff, 5, 14);
    blueLight.position.set(-2, 2, 2);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x00e5ff, 3, 10);
    cyanLight.position.set(2, -1, 3);
    scene.add(cyanLight);

    // ── Bubble InstancedMesh ──────────────────────────────────
    const BUBBLE_COUNT = 80;
    const geo = new THREE.SphereGeometry(1, 10, 10);
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#58c5ff"),
      transparent: true,
      opacity: 0.32,
      roughness: 0.0,
      clearcoat: 1.0,
    });
    const bubblesIM = new THREE.InstancedMesh(geo, mat, BUBBLE_COUNT);
    bubblesIM.frustumCulled = false;
    scene.add(bubblesIM);

    const bubbleData = Array.from({ length: BUBBLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 4.5,
      y: (Math.random() - 0.5) * 7.0,
      z: (Math.random() - 0.5) * 3.0,
      r: 0.012 + Math.random() * 0.052,
      speed: 0.08 + Math.random() * 0.28,
      swayAmp: 0.04 + Math.random() * 0.10,
      swayFreq: 0.20 + Math.random() * 0.60,
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

      // Animate lights for dynamic sheen
      blueLight.position.x = -2 + Math.sin(t * 0.4) * 1.0;
      cyanLight.position.x = 2 + Math.cos(t * 0.35) * 0.8;

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
      geo.dispose();
      mat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
