"use client";

import { Suspense, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

type PanoramaCanvasProps = {
  src: string;
};

function Dome({
  src,
  onReady,
}: {
  src: string;
  onReady: () => void;
}) {
  const map = useTexture(encodeURI(src));
  const gl = useThree((s) => s.gl);

  useLayoutEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    map.needsUpdate = true;
    onReady();
  }, [map, gl, onReady]);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 48]} />
      <meshBasicMaterial map={map} side={THREE.BackSide} />
    </mesh>
  );
}

export function PanoramaCanvas({ src }: PanoramaCanvasProps) {
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    setReady(false);
  }, [src]);

  return (
    <div className="absolute inset-0">
      {!ready && (
        <div
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-[#0c0e0a]/80"
          aria-hidden
        >
          <p className="text-[0.7rem] tracking-[0.18em] text-white/55 uppercase">
            Cargando
          </p>
        </div>
      )}
      <Canvas
        className="h-full w-full touch-none"
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 0.1] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.75]}
      >
        <color attach="background" args={["#0c0e0a"]} />
        <Suspense fallback={null}>
          <Dome key={src} src={src} onReady={markReady} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={-0.45}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI - 0.35}
        />
      </Canvas>
    </div>
  );
}
