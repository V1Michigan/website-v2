"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

const POLARIS_RA_HOURS = 2 + 31 / 60 + 49 / 3600;
const POLARIS_DEC_DEG = 89 + 15 / 60 + 51 / 3600;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function normalizeDegrees(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function getJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function getGMSTHours(date: Date): number {
  const jd = getJulianDate(date);
  const T = (jd - 2451545.0) / 36525.0;
  let GMST =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  GMST = normalizeDegrees(GMST);
  return GMST / 15;
}

function computeAltAz(date: Date, latitudeDeg: number, longitudeDeg: number): { alt: number; az: number } {
  const lstHours = getGMSTHours(date) + longitudeDeg / 15;
  const lstHoursNorm = ((lstHours % 24) + 24) % 24;
  const haHours = lstHoursNorm - POLARIS_RA_HOURS;
  const haDeg = normalizeDegrees(haHours * 15);
  const H = toRadians(haDeg);

  const dec = toRadians(POLARIS_DEC_DEG);
  const lat = toRadians(latitudeDeg);

  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(H);
  const alt = Math.asin(sinAlt);

  const x = -Math.sin(H);
  const y = Math.tan(dec) * Math.cos(lat) - Math.sin(lat) * Math.cos(H);
  let az = Math.atan2(x, y);
  if (az < 0) az += 2 * Math.PI;

  return { alt: toDegrees(alt), az: toDegrees(az) };
}

function createRadialTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, "rgba(255,255,255,1)");
  g.addColorStop(0.12, "rgba(255,255,255,0.7)");
  g.addColorStop(0.28, "rgba(255,255,255,0.05)");
  g.addColorStop(1.0, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function PulsingNorthStar() {
  const groupRef = useRef<THREE.Group>(null);
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const { haloTexture } = useMemo(() => {
    return {
      haloTexture: createRadialTexture(256),
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scale = 1 + 0.03 * Math.sin(t * 2.4);
    if (groupRef.current) {
      groupRef.current.scale.set(scale, scale, scale);
    }
    const pulse = 0.45 + 0.22 * (0.5 + 0.5 * Math.sin(t * 2.4));
    if (haloMatRef.current) haloMatRef.current.opacity = pulse;
  });

  return (
    <group position={[0, 0.85, -10]} ref={groupRef}>
      <mesh>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial
          map={haloTexture}
          color="#ffffff"
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[1.4, 1.4]} />
        <meshBasicMaterial
          ref={haloMatRef}
          map={haloTexture}
          color="#7db6ff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function NorthStarExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [observer, setObserver] = useState<{ lat: number; lon: number } | null>(null);
  const [polarisAltAz, setPolarisAltAz] = useState<{ alt: number; az: number } | null>(null);
  const [showText, setShowText] = useState(false);
  const [stackMode, setStackMode] = useState(false);
  const hudRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const flipTimerRef = useRef<number | null>(null);
  const stackModeRef = useRef<boolean>(false);
  const lastSwitchRef = useRef<number>(0);

  useEffect(() => {
    stackModeRef.current = stackMode;
  }, [stackMode]);

  useEffect(() => {
    const id = setTimeout(() => setShowText(true), 200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fallback = { lat: 42.2808, lon: -83.7430 };
    if (!("geolocation" in navigator)) {
      setObserver(fallback);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mounted) return;
        const { latitude, longitude } = pos.coords;
        setObserver({ lat: latitude, lon: longitude });
      },
      () => {
        if (!mounted) return;
        setObserver(fallback);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
    );
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!observer) return;
    const update = () => {
      const now = new Date();
      const { alt, az } = computeAltAz(now, observer.lat, observer.lon);
      setPolarisAltAz({ alt, az });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [observer]);

  useEffect(() => {
    const STACK_BUFFER_PX = 24;
    const UNSTACK_BUFFER_PX = 160;
    const MIN_GAP = 24;
    const SWITCH_DELAY_MS = 250;
    const SWITCH_COOLDOWN_MS = 800;
    const MOBILE_FORCE_STACK_MAX_WIDTH = 430;

    const computeShouldStack = () => {
      if (window.innerWidth <= MOBILE_FORCE_STACK_MAX_WIDTH) return true;
      const hudEl = hudRef.current;
      const descEl = descRef.current;
      const containerEl = containerRef.current;
      if (!hudEl || !descEl || !containerEl) return stackModeRef.current;

      const containerWidth = containerEl.clientWidth;
      const hudWidth = hudEl.getBoundingClientRect().width;
      const descWidth = descEl.getBoundingClientRect().width;
      const isMdUp = window.matchMedia("(min-width: 768px)").matches;
      const sidePadding = isMdUp ? 32 : 24;

      const totalNeeded = hudWidth + descWidth + sidePadding * 2 + MIN_GAP;
      const threshold = containerWidth - (stackModeRef.current ? UNSTACK_BUFFER_PX : STACK_BUFFER_PX);
      return totalNeeded > threshold;
    };

    const checkNeedStack = () => {
      const desired = computeShouldStack();
      const current = stackModeRef.current;
      if (desired === current) {
        if (flipTimerRef.current) {
          clearTimeout(flipTimerRef.current);
          flipTimerRef.current = null;
        }
        return;
      }

      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      flipTimerRef.current = window.setTimeout(() => {
        const stableDesired = computeShouldStack();
        if (stableDesired !== stackModeRef.current) {
          const now = Date.now();
          if (now - lastSwitchRef.current >= SWITCH_COOLDOWN_MS) {
            setStackMode(stableDesired);
            lastSwitchRef.current = now;
          }
        }
        flipTimerRef.current = null;
      }, SWITCH_DELAY_MS);
    };

    const scheduleCheck = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(checkNeedStack);
    };

    const ro = new ResizeObserver(scheduleCheck);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", scheduleCheck);
    scheduleCheck();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", scheduleCheck);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-screen h-dvh relative overflow-hidden select-none">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 60 }}>
        <Stars radius={100} depth={50} count={2000} factor={2.6} saturation={0} fade />
        <PulsingNorthStar />
        <ambientLight intensity={0.25} />
        <directionalLight position={[2, 2, 2]} intensity={0.25} />
      </Canvas>

      <div
        ref={hudRef}
        className={`pointer-events-none ${
          stackMode
            ? "absolute top-6 left-1/2 -translate-x-1/2 text-center"
            : "absolute bottom-6 right-6 md:bottom-8 md:right-8 text-right"
        }`}
      >
        {polarisAltAz ? (
          <>
            <div className="text-white/80 text-medium">Alt {polarisAltAz.alt.toFixed(1)}°</div>
            <div className="text-white/80 text-medium">Az {polarisAltAz.az.toFixed(1)}°</div>
          </>
        ) : (
          <>
            <div className="text-white/80 text-medium">Polaris coordinates</div>
            <div className="text-white/80 text-medium">Locating…</div>
          </>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center md:pointer-events-none pointer-events-auto">
        <div className={`text-center transition-opacity duration-1000 ${showText ? "opacity-100" : "opacity-0"}`}>
          <div className="text-white/90 text-3xl sm:text-4xl font-medium">Project North Star</div>
          <a
            href="http://v1michigan.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto mt-1 block text-white/60 text-medium hover:text-white/80 transition-colors"
          >
            By V1 @ Michigan
          </a>
        </div>
      </div>

      <div
        ref={descRef}
        className={`pointer-events-auto ${
          stackMode
            ? "absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-8 text-center"
            : "absolute left-6 bottom-6 md:left-8 md:bottom-8 text-left"
        } max-w-md text-white/70 text-sm sm:text-base leading-snug`}
      >
        <div className="mt-2 text-white/80" >
          <a
            href="https://tally.so/r/w2q4o9"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline hover:text-white"
            aria-label="Join the waitlist"
          >
            Waitlist
          </a>
          <span className="mx-2">•</span>
          <Link
            href="/north-star/portfolio"
            className="underline-offset-4 hover:underline hover:text-white"
            aria-label="Portfolio"
          >
            Portfolio
          </Link>
          <span className="mx-2">•</span>
          <a
            href="mailto:team@v1michigan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline hover:text-white"
          >
            Contact
          </a>
        </div>
        <div className="mt-1 sm:mt-2 text-white/70 text-sm sm:text-base leading-snug"></div>
        <div>
          V1&apos;s first accelerator. Designed for founders ready to go all-in, connect with partners, talk to customers, and raise capital.
        </div>
      </div>
    </div>
  );
}


