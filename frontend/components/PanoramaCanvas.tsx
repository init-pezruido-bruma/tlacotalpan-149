"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const CAMERA_RADIUS = 0.1;

function cameraPosition(yaw: number): [number, number, number] {
  return [
    Math.sin(yaw) * CAMERA_RADIUS,
    0,
    Math.cos(yaw) * CAMERA_RADIUS,
  ];
}

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

type PanoramaCanvasProps = {
  src: string;
  /** Azimut en radianes. 0 mira a -Z (centro-derecha de la textura equirectangular). */
  yaw?: number;
  interactionEnabled?: boolean;
};

function Dome({
  src,
  onReady,
}: {
  src: string;
  onReady: () => void;
}) {
  const gl = useThree((s) => s.gl);
  const mobile = isMobileViewport();
  const texture = useTexture(encodeURI(src), (loaded) => {
    loaded.colorSpace = THREE.SRGBColorSpace;
    loaded.anisotropy = Math.min(
      mobile ? 4 : 8,
      gl.capabilities.getMaxAnisotropy(),
    );
    loaded.needsUpdate = true;
  });

  useLayoutEffect(() => {
    onReady();
  }, [onReady, texture]);

  const segments = mobile ? 32 : 64;
  const rings = mobile ? 24 : 48;

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, segments, rings]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function PanoControls({
  src,
  yaw,
  interactionEnabled,
}: {
  src: string;
  yaw: number;
  interactionEnabled: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useLayoutEffect(() => {
    const [x, y, z] = cameraPosition(yaw);
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.set(0, 0, 0);
    controls.update();
  }, [camera, src, yaw]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableRotate={interactionEnabled}
      enableDamping={interactionEnabled}
      dampingFactor={0.06}
      rotateSpeed={-0.45}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI - 0.35}
    />
  );
}

function WebGLContextGuard() {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (event: Event) => {
      event.preventDefault();
    };
    const onRestored = () => {
      invalidate();
    };

    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl, invalidate]);

  return null;
}

export function PanoramaCanvas({
  src,
  yaw = 0,
  interactionEnabled = true,
}: PanoramaCanvasProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const mobile = isMobileViewport();
  const ready = loadedSrc === src;
  const markReady = useCallback(() => setLoadedSrc(src), [src]);

  return (
    <div className="absolute inset-0">
      {!ready && (
        <div
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-[#0c0e0a]"
          aria-hidden
        >
          <p className="text-[0.7rem] tracking-[0.18em] text-white/55 uppercase">
            Cargando
          </p>
        </div>
      )}
      <Canvas
        className={
          interactionEnabled
            ? "h-full w-full touch-none"
            : "pointer-events-none h-full w-full touch-pan-y"
        }
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: cameraPosition(yaw),
        }}
        frameloop={interactionEnabled ? "always" : "demand"}
        gl={{
          antialias: !mobile,
          alpha: false,
          powerPreference: mobile ? "default" : "high-performance",
        }}
        dpr={mobile ? 1 : [1, 1.75]}
      >
        <color attach="background" args={["#0c0e0a"]} />
        <WebGLContextGuard />
        <Suspense fallback={null}>
          <Dome key={src} src={src} onReady={markReady} />
        </Suspense>
        <PanoControls
          src={src}
          yaw={yaw}
          interactionEnabled={interactionEnabled}
        />
      </Canvas>
    </div>
  );
}
