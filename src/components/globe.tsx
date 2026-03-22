"use client";

import React, { Suspense, useRef, useMemo, useEffect, createContext, useContext } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";

import {
  latLngToPos,
  greatCircleArc,
  TECH_HUBS,
  DATA_CENTERS,
  WAR_ZONES,
  TRADE_ROUTES,
  type MarkerData,
} from "./globe-data";

// ── Theme context for Three.js components ──────────────────────
const ThemeCtx = createContext(true);
function useIsDark() {
  return useContext(ThemeCtx);
}

const GLOBE_RADIUS = 5;

// Texture URLs (self-hosted in /public/textures/)
const TEXTURE_NIGHT = "/textures/earth-night.jpg";
const TEXTURE_DAY = "/textures/earth-blue-marble.jpg";
const TEXTURE_WATER = "/textures/earth-water.png";
const TEXTURE_BUMP = "/textures/earth-topology.png";

// ── Globe Sphere (always bright, identical in both themes) ─────
function GlobeHighRes() {
  const [nightMap, dayMap, waterMap, bumpMap] = useLoader(THREE.TextureLoader, [
    TEXTURE_NIGHT,
    TEXTURE_DAY,
    TEXTURE_WATER,
    TEXTURE_BUMP,
  ]);

  // Optimize texture quality
  useMemo(() => {
    [dayMap, bumpMap, nightMap, waterMap].forEach(tex => {
      tex.anisotropy = 8; // Sharp detail at grazing angles
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
    });
    dayMap.colorSpace = THREE.SRGBColorSpace;
  }, [dayMap, bumpMap, nightMap, waterMap]);

  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
      <meshStandardMaterial
        map={dayMap}
        bumpMap={bumpMap}
        bumpScale={0.03}
        roughness={1.0}
        metalness={0.0}
      />
    </mesh>
  );
}

// ── Theme-aware stars (white on dark, black on light) ──────────
function ThemedStars() {
  const isDark = useIsDark();
  const geo = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const r = 80 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <points geometry={geo}>
      <pointsMaterial color={isDark ? "#ffffff" : "#000000"} size={0.4} sizeAttenuation transparent opacity={0.6} />
    </points>
  );
}

// ── Atmosphere glow ────────────────────────────────────────────
function Atmosphere() {
  const isDark = useIsDark();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(isDark ? "#99ccff" : "#000000") },
          glowPower: { value: isDark ? 2.0 : 3.5 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float glowPower;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
            gl_FragColor = vec4(color, intensity * glowPower);
          }
        `,
        transparent: true,
        blending: THREE.NormalBlending,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [isDark]
  );

  return (
    <mesh material={material}>
      <sphereGeometry args={[GLOBE_RADIUS * 1.04, 48, 48]} />
    </mesh>
  );
}

// ── International Space Station (ISS) ──────────────────────────
function ISS() {
  const issRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (issRef.current) {
      issRef.current.rotation.y = clock.getElapsedTime() * 0.4 + Math.PI;
    }
  });

  // Cached materials (never recreated)
  const trussMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c8c8c8', metalness: 0.9, roughness: 0.15 }), []);
  const moduleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d4d4d4', metalness: 0.7, roughness: 0.25 }), []);
  const solarMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a2e5a', metalness: 0.6, roughness: 0.3, side: THREE.DoubleSide }), []);
  const radMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e8e0d0', metalness: 0.5, roughness: 0.4, side: THREE.DoubleSide }), []);

  // Scale: real ISS ~109m wide. We want it ~0.9 units → scale ≈ 0.0083 per meter
  const S = 0.005;
  // ITS half-length ~54m each side
  const trussLen = 109 * S;    // ≈ 0.818
  const SAW_W = 34 * S;        // solar array width ≈ 0.255
  const SAW_H = 12 * S;        // solar array height ≈ 0.09
  // Solar array offsets along the truss (from center)
  const saw1 = 42 * S;         // P4/S4
  const saw2 = 76 * S;         // P6/S6

  return (
    <group rotation={[0, 0, (51.6 * Math.PI) / 180]}>
      {/* Faint orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[GLOBE_RADIUS + 0.44, GLOBE_RADIUS + 0.46, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      <group ref={issRef}>
        {/* ISS positioned at orbital altitude */}
        <group position={[GLOBE_RADIUS + 0.45, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {/* ── Integrated Truss Structure (ITS) ── */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, trussLen, 6]} />
            <primitive object={trussMat} attach="material" />
          </mesh>

          {/* ── PRESSURIZED MODULE STACK ── */}
          {/* Longitudinal core (Zarya→Zvezda direction) */}
          {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
            <mesh key={`core-${i}`} position={[x * S * 5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.019, 0.019, 0.072, 8]} />
              <primitive object={moduleMat} attach="material" />
            </mesh>
          ))}
          {/* Transverse modules (Columbus / Node 2 / Kibo) */}
          {[-1, 0, 1].map((z, i) => (
            <mesh key={`trans-${i}`} position={[0, 0, z * 0.072]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.019, 0.019, 0.072, 8]} />
              <primitive object={moduleMat} attach="material" />
            </mesh>
          ))}

          {/* ── SOLAR ARRAY WINGS (8 panels in 4 pairs) ── */}
          {/* S6 pair — far starboard */}
          <mesh position={[saw2, 0.055, 0]}>
            <planeGeometry args={[SAW_H, SAW_W]} />
            <primitive object={solarMat} attach="material" />
          </mesh>
          <mesh position={[saw2, -0.055, 0]}>
            <planeGeometry args={[SAW_H, SAW_W]} />
            <primitive object={solarMat} attach="material" />
          </mesh>

          {/* S4 pair — inner starboard */}
          <mesh position={[saw1, 0.055, 0]}>
            <planeGeometry args={[SAW_H, SAW_W]} />
            <primitive object={solarMat} attach="material" />
          </mesh>
          <mesh position={[saw1, -0.055, 0]}>
            <planeGeometry args={[SAW_H, SAW_W]} />
            <primitive object={solarMat} attach="material" />
          </mesh>

          {/* P4 pair — inner port */}
          <mesh position={[-saw1, 0.055, 0]}>
            <planeGeometry args={[SAW_H, SAW_W]} />
            <primitive object={solarMat} attach="material" />
          </mesh>
          <mesh position={[-saw1, -0.055, 0]}>
            <planeGeometry args={[SAW_H, SAW_W]} />
            <primitive object={solarMat} attach="material" />
          </mesh>

          {/* P6 pair — far port */}
          <mesh position={[-saw2, 0.055, 0]}>
            <planeGeometry args={[SAW_H, SAW_W]} />
            <primitive object={solarMat} attach="material" />
          </mesh>
          <mesh position={[-saw2, -0.055, 0]}>
            <planeGeometry args={[SAW_H, SAW_W]} />
            <primitive object={solarMat} attach="material" />
          </mesh>

          {/* ── RADIATOR PANELS (2 large, on truss near center) ── */}
          <mesh position={[0.12, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
            <planeGeometry args={[0.055, 0.22]} />
            <primitive object={radMat} attach="material" />
          </mesh>
          <mesh position={[-0.12, 0, 0]} rotation={[-Math.PI / 4, 0, 0]}>
            <planeGeometry args={[0.055, 0.22]} />
            <primitive object={radMat} attach="material" />
          </mesh>

          {/* Truss strut details — cross braces */}
          {[-saw2, -saw1, 0, saw1, saw2].map((x, i) => (
            <mesh key={`strut-${i}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.004, 0.04, 0.004]} />
              <primitive object={trussMat} attach="material" />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

// ── World Monitor Markers ──────────────────────────────────────
// "World Monitor" style markers: Flat on the surface with a central glowing dot,
// a high-glow inner ring, and an outward flashing pulse ring.

function IndicatorMarkers({
  markers,
  color,
  pulseSpeed,
  sizeScale = 1.0,
}: {
  markers: MarkerData[];
  color: string;
  pulseSpeed: number;
  sizeScale?: number;
}) {
  const isDark = useIsDark();
  const groupRef = useRef<THREE.Group>(null);

  // Instanced Meshes
  const centerDotRef = useRef<THREE.InstancedMesh>(null);
  const innerRingRef = useRef<THREE.InstancedMesh>(null);
  const flashRingRef = useRef<THREE.InstancedMesh>(null);

  // Pre-calculate unit vectors and rotations for each marker to align them perfectly flat
  const markerTransforms = useMemo(() => {
    return markers.map((m) => {
      // Slightly above surface to prevent Z-fighting
      const pos = latLngToPos(m.lat, m.lng, GLOBE_RADIUS * 1.002);
      const vecPos = new THREE.Vector3(...pos);
      // Look away from center
      const normal = vecPos.clone().normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );
      return { pos, quat };
    });
  }, [markers]);

  useEffect(() => {
    if (!centerDotRef.current || !innerRingRef.current || !flashRingRef.current) return;
    const mat = new THREE.Matrix4();
    const cColor = new THREE.Color(color);

    for (let i = 0; i < markerTransforms.length; i++) {
      const { pos, quat } = markerTransforms[i];
      // Dot
      mat.makeRotationFromQuaternion(quat);
      mat.setPosition(pos[0], pos[1], pos[2]);
      const s1 = 0.04 * sizeScale;
      mat.scale(new THREE.Vector3(s1, s1, s1));
      centerDotRef.current.setMatrixAt(i, mat);
      centerDotRef.current.setColorAt(i, cColor);

      // Inner Ring
      mat.makeRotationFromQuaternion(quat);
      mat.setPosition(pos[0], pos[1], pos[2]);
      const s2 = 0.08 * sizeScale;
      mat.scale(new THREE.Vector3(s2, s2, s2));
      innerRingRef.current.setMatrixAt(i, mat);
      innerRingRef.current.setColorAt(i, cColor);

      // Flash Ring (initial setup)
      mat.makeRotationFromQuaternion(quat);
      mat.setPosition(pos[0], pos[1], pos[2]);
      flashRingRef.current.setMatrixAt(i, mat);
      flashRingRef.current.setColorAt(i, cColor);
    }
    centerDotRef.current.instanceMatrix.needsUpdate = true;
    if (centerDotRef.current.instanceColor) centerDotRef.current.instanceColor.needsUpdate = true;
    innerRingRef.current.instanceMatrix.needsUpdate = true;
    if (innerRingRef.current.instanceColor) innerRingRef.current.instanceColor.needsUpdate = true;
  }, [markerTransforms, color, sizeScale]);

  // Animate the flash ring expanding and fading
  useFrame(({ clock }) => {
    if (!flashRingRef.current) return;
    const t = clock.getElapsedTime();
    const mat = new THREE.Matrix4();
    const cColor = new THREE.Color(color);

    for (let i = 0; i < markerTransforms.length; i++) {
      const { pos, quat } = markerTransforms[i];

      // Calculate pulse phase with an offset per marker so they don't all flash identically
      const phase = (t * pulseSpeed + i * 0.43) % 1.0;

      // Scale expands from small to large
      const currentScale = (0.05 + phase * 0.25) * sizeScale;

      mat.makeRotationFromQuaternion(quat);
      mat.setPosition(pos[0], pos[1], pos[2]);
      mat.scale(new THREE.Vector3(currentScale, currentScale, currentScale));

      flashRingRef.current.setMatrixAt(i, mat);

      // Alpha fades out as it expands
      const alpha = Math.max(0, 1.0 - phase * 1.5);
      cColor.set(color).multiplyScalar(alpha);
      flashRingRef.current.setColorAt(i, cColor);
    }
    flashRingRef.current.instanceMatrix.needsUpdate = true;
    if (flashRingRef.current.instanceColor) flashRingRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Center solid dot */}
      <instancedMesh ref={centerDotRef} args={[undefined, undefined, markers.length]} frustumCulled={false}>
        <circleGeometry args={[1, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
          depthWrite={false}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-4}
          polygonOffsetUnits={-4}
        />
      </instancedMesh>

      {/* Inner stable ring */}
      <instancedMesh ref={innerRingRef} args={[undefined, undefined, markers.length]} frustumCulled={false}>
        <ringGeometry args={[0.8, 1.0, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isDark ? 0.7 : 0.8}
          depthWrite={false}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-4}
          polygonOffsetUnits={-4}
        />
      </instancedMesh>

      {/* Outer flashing ring */}
      <instancedMesh ref={flashRingRef} args={[undefined, undefined, markers.length]} frustumCulled={false}>
        <ringGeometry args={[0.9, 1.0, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-4}
          polygonOffsetUnits={-4}
        />
      </instancedMesh>
    </group>
  );
}

// ── Solid Heatmap Polygons (For War Zones / Conflict Areas) ────
// In World Monitor, conflicts are large shaded areas. We simulate this with large semi-transparent circles.
function HeatmapZones({ markers, color }: { markers: MarkerData[]; color: string }) {
  const isDark = useIsDark();
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const markerTransforms = useMemo(() => {
    return markers.map((m) => {
      const pos = latLngToPos(m.lat, m.lng, GLOBE_RADIUS * 1.001);
      const vecPos = new THREE.Vector3(...pos);
      const normal = vecPos.clone().normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );
      return { pos, quat };
    });
  }, [markers]);

  useEffect(() => {
    if (!meshRef.current) return;
    const mat = new THREE.Matrix4();
    const cColor = new THREE.Color(color);

    for (let i = 0; i < markerTransforms.length; i++) {
      const { pos, quat } = markerTransforms[i];
      mat.makeRotationFromQuaternion(quat);
      mat.setPosition(pos[0], pos[1], pos[2]);
      // Large scale for heatmap zone (approx 400-800km radius)
      const scale = 0.25;
      mat.scale(new THREE.Vector3(scale, scale, scale));

      meshRef.current.setMatrixAt(i, mat);
      meshRef.current.setColorAt(i, cColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [markerTransforms, color]);

  // Subtle pulsing intensity for war zones
  useFrame(({ clock }) => {
    if (!meshRef.current || !meshRef.current.instanceColor) return;
    const t = clock.getElapsedTime();
    const cColor = new THREE.Color(color);

    for (let i = 0; i < markerTransforms.length; i++) {
      // Slow ominous pulse
      const intensity = 0.3 + 0.15 * Math.sin(t * 1.2 + i);
      cColor.set(color).multiplyScalar(intensity);
      meshRef.current.setColorAt(i, cColor);
    }
    meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, markers.length]} frustumCulled={false}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isDark ? 0.35 : 0.25}
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-4}
          polygonOffsetUnits={-4}
        />
      </instancedMesh>
    </group>
  );
}

// ── Trade route arcs ───────────────────────────────────────────
function TradeArcs() {
  const isDark = useIsDark();
  const groupRef = useRef<THREE.Group>(null);

  const { seaGeos, airGeos } = useMemo(() => {
    const seaG: THREE.BufferGeometry[] = [];
    const airG: THREE.BufferGeometry[] = [];

    for (const route of TRADE_ROUTES) {
      const altitude = route.type === "air" ? 0.08 : 0.01;
      const points = greatCircleArc(
        route.from[0], route.from[1],
        route.to[0], route.to[1],
        60, GLOBE_RADIUS, altitude
      );

      const verts = new Float32Array(points.length * 3);
      for (let i = 0; i < points.length; i++) {
        verts[i * 3] = points[i].x;
        verts[i * 3 + 1] = points[i].y;
        verts[i * 3 + 2] = points[i].z;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
      geo.computeBoundingSphere(); // Fix incorrect clipping on orbit/scroll

      // Add initial static color gradient for lines
      const cols = new Float32Array(points.length * 3);
      for (let i = 0; i < points.length; i++) {
        const frac = i / points.length;
        if (route.type === "sea") {
          cols[i * 3] = 0.1;
          cols[i * 3 + 1] = 0.4 + frac * 0.4;
          cols[i * 3 + 2] = 0.6 + frac * 0.9;
        } else {
          cols[i * 3] = 0.8 + frac * 0.7;
          cols[i * 3 + 1] = 0.6 + frac * 0.5;
          cols[i * 3 + 2] = 0.2;
        }
      }
      geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));

      if (route.type === "sea") seaG.push(geo);
      else airG.push(geo);
    }

    return { seaGeos: seaG, airGeos: airG };
  }, []);

  return (
    <group ref={groupRef}>
      {seaGeos.map((geo, i) => (
        /* @ts-expect-error Three/React-Three-Fiber typing quirk for line */
        <line key={`sea-${i}`} geometry={geo}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={isDark ? 0.8 : 0.6}
            blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
            depthWrite={false}
            toneMapped={false}
            linewidth={1}
          />
        </line>
      ))}
      {airGeos.map((geo, i) => (
        /* @ts-expect-error Three/React-Three-Fiber typing quirk for line */
        <line key={`air-${i}`} geometry={geo}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={isDark ? 0.7 : 0.5}
            blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
            depthWrite={false}
            toneMapped={false}
            linewidth={1}
          />
        </line>
      ))}
    </group>
  );
}

// ── Blinking live-location dot (Jalandhar, Punjab) ─────────────
function LiveLocationDot({ lat, lng, color = "#22c55e" }: { lat: number; lng: number; color?: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const dotRef = useRef<THREE.Mesh>(null);

  const pos = useMemo(() => latLngToPos(lat, lng, GLOBE_RADIUS * 1.002), [lat, lng]);
  const normal = useMemo(() => new THREE.Vector3(...pos).normalize(), [pos]);
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [normal]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      const phase = (t * 1.2) % 1.0;
      const scale = 0.02 + phase * 0.08;
      ringRef.current.scale.set(scale, scale, scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - phase);
    }
    if (dotRef.current) {
      (dotRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 + 0.4 * Math.sin(t * 4);
    }
  });

  return (
    <group position={pos} quaternion={quat}>
      <mesh ref={dotRef}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color={color} transparent opacity={1} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.8, 1.0, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ── Auto-rotating group ────────────────────────────────────────
function AutoRotateGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  // Auto rotation logic
  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05; // Gentle rotation
    }
  });

  return (
    <group ref={groupRef} rotation={[0.2, 3, 0]}>
      {children}
    </group>
  );
}

// ── Native View Offset (Centers globe in the right-side layout) ─
function CameraOffset() {
  const { camera, size } = useThree();

  React.useEffect(() => {
    if (camera.type === "PerspectiveCamera") {
      const pc = camera as THREE.PerspectiveCamera;
      // To prevent the "square canvas box" look, the Canvas is 100vw/100vh.
      // To shift the globe to the right (under the nav bar) without cropping the starfield,
      // we shift the camera's projection matrix natively!
      if (size.width > 1024) {
        // Negative X offset shifts the camera left, so the globe appears shifted RIGHT
        pc.setViewOffset(size.width, size.height, -180, -40, size.width, size.height);
      } else {
        pc.clearViewOffset();
      }
      pc.updateProjectionMatrix();
    }
  }, [camera, size]);

  return null;
}

// ── Complete globe scene ───────────────────────────────────────
function GlobeScene() {
  const isDark = useIsDark();

  return (
    <>
      {/* Strong, stable lighting — identical in both themes */}
      <ambientLight intensity={1.0} />

      {/* Primary front light */}
      <directionalLight
        position={[20, 15, 20]}
        intensity={3.0}
        color="#ffffff"
      />

      {/* Backfill so every angle of the globe is visible */}
      <directionalLight
        position={[-15, -10, -15]}
        intensity={0.8}
        color="#aabbdd"
      />

      {/* Background inverts with theme */}
      <color attach="background" args={[isDark ? "#000000" : "#f0f0f0"]} />

      {/* Same stars in both modes, color inverts with theme */}
      <ThemedStars />

      <CameraOffset />

      {/* Put ISS outside AutoRotate so it spins independently around the Earth */}
      <ISS />

      <AutoRotateGroup>
        <Suspense fallback={null}>
          <GlobeHighRes />
        </Suspense>
        <LiveLocationDot lat={31.326} lng={75.576} color="#22c55e" />
        <LiveLocationDot lat={51.507} lng={-0.128} color="#3b82f6" />
      </AutoRotateGroup>

      {/* Atmosphere glow */}
      <Atmosphere />

      <OrbitControls
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={8}
        maxDistance={35}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.6}
        zoomSpeed={0.7}
      />
    </>
  );
}

// ── Main export ────────────────────────────────────────────────
export function Globe({ isDark }: { isDark: boolean }) {
  return (
    <ThemeCtx.Provider value={isDark}>
      <Canvas
        camera={{ position: [0, 1.5, 17], fov: 48 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          cursor: "grab",
          touchAction: "none", // Prevents native scroll glitching on mobile/trackpads
        }}
        dpr={[1, 1.5]} // Adaptive resolution: crisp on retina without GPU overload
        gl={{
          antialias: true, // Smooth edges for the globe
          alpha: true,
          toneMapping: THREE.NoToneMapping,
          powerPreference: "high-performance",
        }}
      >
        <GlobeScene />
      </Canvas>
    </ThemeCtx.Provider>
  );
}
