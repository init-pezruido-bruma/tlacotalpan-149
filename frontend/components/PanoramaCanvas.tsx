"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  panoLinkWorldPosition,
  type PanoNavLink,
} from "../content/panoLinks";

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

export type PanoramaCanvasProps = {
  src: string;
  /** Azimut en radianes. 0 mira a -Z (centro-derecha de la textura equirectangular). */
  yaw?: number;
  interactionEnabled?: boolean;
  links?: readonly PanoNavLink[];
  linksEnabled?: boolean;
  editLinks?: boolean;
  onNavigate?: (spaceId: string) => void;
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

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 12s3.8-7 9.5-7 9.5 7 9.5 7-3.8 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const _toHotspot = new THREE.Vector3();
const _forward = new THREE.Vector3();

function PanoLinkMarker({
  link,
  enabled,
  editMode,
  onNavigate,
}: {
  link: PanoNavLink;
  enabled: boolean;
  editMode: boolean;
  onNavigate?: (spaceId: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [inView, setInView] = useState(true);
  const position = useMemo(
    () => panoLinkWorldPosition(link.yaw, link.pitch),
    [link.yaw, link.pitch],
  );

  useFrame(({ camera }) => {
    const group = groupRef.current;
    if (!group) return;
    group.getWorldPosition(_toHotspot);
    _toHotspot.sub(camera.position).normalize();
    camera.getWorldDirection(_forward);
    const facing = _forward.dot(_toHotspot) > 0.12;
    setInView((prev) => (prev === facing ? prev : facing));
  });

  const visible = enabled && inView;

  return (
    <group ref={groupRef} position={position}>
      <Html
        center
        transform={false}
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 160ms ease",
        }}
        zIndexRange={[20, 0]}
      >
        <button
          type="button"
          data-pano-hotspot
          onClick={(event) => {
            event.stopPropagation();
            if (!visible) return;
            onNavigate?.(link.spaceId);
          }}
          onPointerDown={(event) => event.stopPropagation()}
          className="relative flex h-14 w-14 cursor-pointer items-center justify-center border-0 bg-transparent p-0 md:h-16 md:w-16"
          aria-label={`Ir a ${link.label}`}
          aria-hidden={!visible}
          tabIndex={visible ? 0 : -1}
        >
          <span className="pointer-events-none absolute bottom-[calc(100%+0.35rem)] left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.68rem] font-medium tracking-[0.14em] text-white/55 uppercase md:text-[0.72rem]">
            {editMode
              ? `${link.label} · ${link.yaw.toFixed(2)},${link.pitch.toFixed(2)}`
              : link.label}
          </span>
          <span className="pointer-events-none flex h-12 w-12 items-center justify-center rounded-full bg-[var(--hero-green-deep)]/90 text-white shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:h-14 md:w-14">
            <EyeIcon />
          </span>
        </button>
      </Html>
    </group>
  );
}

function PanoLinkLayer({
  links,
  enabled,
  editMode,
  onNavigate,
}: {
  links: readonly PanoNavLink[];
  enabled: boolean;
  editMode: boolean;
  onNavigate?: (spaceId: string) => void;
}) {
  if (!links.length) return null;
  return (
    <>
      {links.map((link) => (
        <PanoLinkMarker
          key={`${link.spaceId}-${link.yaw}-${link.pitch}`}
          link={link}
          enabled={enabled}
          editMode={editMode}
          onNavigate={onNavigate}
        />
      ))}
    </>
  );
}

export function PanoramaCanvas({
  src,
  yaw = 0,
  interactionEnabled = true,
  links = [],
  linksEnabled = true,
  editLinks = false,
  onNavigate,
}: PanoramaCanvasProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const mobile = isMobileViewport();
  const ready = loadedSrc === src;
  const markReady = useCallback(() => setLoadedSrc(src), [src]);
  const hasLinks = links.length > 0;
  // Html markers need continuous frames while orbit damping / looking around.
  const frameloop =
    interactionEnabled || hasLinks ? "always" : "demand";

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
        frameloop={frameloop}
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
        <PanoLinkLayer
          links={links}
          enabled={linksEnabled}
          editMode={editLinks}
          onNavigate={onNavigate}
        />
      </Canvas>
    </div>
  );
}
