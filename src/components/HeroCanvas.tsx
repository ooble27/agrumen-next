"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingBlob() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.12;
    meshRef.current.rotation.y = t * 0.18;
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.25;
    meshRef.current.position.x = Math.cos(t * 0.4) * 0.15;
  });

  return (
    <mesh ref={meshRef} scale={1.8}>
      <icosahedronGeometry args={[1, 3]} />
      <MeshDistortMaterial
        color="#C5F135"
        transparent
        opacity={0.08}
        wireframe
        distort={0.35}
        speed={1.5}
      />
    </mesh>
  );
}

function Ring() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.08;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });
  return (
    <mesh ref={ref} scale={2.6}>
      <torusGeometry args={[1, 0.02, 16, 80]} />
      <meshBasicMaterial color="#C5F135" transparent opacity={0.12} />
    </mesh>
  );
}

function SmallRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.22;
    ref.current.rotation.x = state.clock.elapsedTime * 0.1;
  });
  return (
    <mesh ref={ref} position={[1.5, -0.5, 0]} scale={1.2}>
      <torusGeometry args={[1, 0.025, 16, 64]} />
      <meshBasicMaterial color="#22C55E" transparent opacity={0.10} />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: "transparent", pointerEvents: "none" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={1} />
      <FloatingBlob />
      <Ring />
      <SmallRing />
    </Canvas>
  );
}
