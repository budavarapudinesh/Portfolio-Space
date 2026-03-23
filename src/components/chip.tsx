"use client";

import React, {
  Suspense,
  useRef,
  useMemo,
  createContext,
  useContext,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

const ThemeCtx = createContext(true);
function useIsDark() {
  return useContext(ThemeCtx);
}

// ── Real Apple M1 Chip Model ──────────────────────────────────
function AppleChipModel() {
  const { scene } = useGLTF("/models/apple-m1-chip.glb");

  const centered = useMemo(() => {
    // Center model at origin
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    // Disable frustum culling and boost materials for a premium look
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.frustumCulled = false;
        if (child.material) {
          // Balanced, premium metallic look
          child.material.envMapIntensity = 1.5;
          // Smooth matte finish (not too rough, not a mirror)
          child.material.roughness = Math.max(0.3, (child.material.roughness || 0.5) * 0.8);
          // High metalness for that machined feel
          child.material.metalness = Math.min(0.9, (child.material.metalness || 0.5) * 1.5);

          child.material.needsUpdate = true;
        }
      }
    });
    return scene;
  }, [scene]);

  return <primitive object={centered} scale={25} />;
}

useGLTF.preload("/models/apple-m1-chip.glb");

// ── Floating particles ────────────────────────────────────────
function FloatingParticles() {
  const isDark = useIsDark();
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color={isDark ? "#334455" : "#667788"}
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.4}
      />
    </points>
  );
}

// ── Rotate + bob ──────────────────────────────────────────────
function ChipGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle vertical bobbing
      groupRef.current.position.y =
        Math.sin(clock.getElapsedTime() * 0.5) * 0.03;
      // Subtle swaying left and right
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.15;
    }
  });

  // Heroic 3/4 tilt, positioned to the right to align under navbar
  return (
    <group ref={groupRef} rotation={[0.35, 0, 0]} position={[1.5, -0.2, 0]}>
      {children}
    </group>
  );
}

// ── Scene ─────────────────────────────────────────────────────
function ChipScene() {
  const isDark = useIsDark();

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 6, 3]} intensity={0.8} color="#aaccff" />

      {/* Studio environment for premium reflections without blowing out the highlights */}
      <Environment preset="studio" />

      <color attach="background" args={[isDark ? "#000000" : "#f0f0f0"]} />

      <ChipGroup>
        <AppleChipModel />
      </ChipGroup>

      <OrbitControls
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={20}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.6}
        zoomSpeed={0.7}
      />
    </>
  );
}

// ── Export ─────────────────────────────────────────────────────
export function Chip({ isDark }: { isDark: boolean }) {
  return (
    <ThemeCtx.Provider value={isDark}>
      <Canvas
        camera={{ position: [0, 3, 8], fov: 40 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          cursor: "grab",
          touchAction: "none",
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <ChipScene />
        </Suspense>
      </Canvas>
    </ThemeCtx.Provider>
  );
}
