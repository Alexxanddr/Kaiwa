"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

interface ShaderBackgroundProps {
  children: ReactNode;
  className?: string;
}

/**
 * Kaiwa pink mesh-gradient hero backdrop.
 *
 * Adapted from a @paper-design/shaders demo and recoloured to Kaiwa's icon
 * palette (#ee6c85 → #d94b63). Kept light and airy — warm white drifting into
 * rose — so the deep-plum headline text stays legible on top (the same
 * light-hero approach as the health-coach reference, just pink instead of sky).
 *
 * Perf notes (a soft gradient has no fine detail, so we render it cheap):
 *   - ONE animated WebGL layer, not two. The old second "painterly depth" mesh
 *     ran a whole extra shader + a full-screen soft-light composite every frame;
 *     it's now a *static* CSS soft-light wash below (zero animation cost).
 *   - maxPixelCount caps the canvas at ~720p (vs the library's ~8.3M-px retina
 *     default) and minPixelRatio=1 stops it forcing 2x on hi-dpi screens — the
 *     GPU draws ~6x fewer pixels/frame; the grain + vignette hide the downscale.
 *   - Motion is switched off (speed 0 stops the shader's rAF loop) when the user
 *     prefers reduced motion or when the hero has scrolled out of view; the
 *     library additionally pauses whenever the tab is hidden.
 */
export function ShaderBackground({ children, className = "" }: ShaderBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reduce] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduce]);

  const paused = reduce || !inView;

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`}>
      {/* SVG filter used to give the frosted bento chips a subtle glassy edge */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="kaiwa-glass" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.008" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" />
          </filter>
        </defs>
      </svg>

      {/* base pink mesh — the single animated layer */}
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={["#fff8f9", "#fde4ec", "#ffc9d8", "#f4a5bb", "#e85d75"]}
        speed={paused ? 0 : 0.3}
        distortion={0.8}
        swirl={0.1}
        grainOverlay={0.04}
        scale={1.2}
        minPixelRatio={1}
        maxPixelCount={1280 * 720}
      />
      {/* painterly depth — a STATIC soft-light rose wash that stands in for the
          old second animated shader layer (deeper rose #ee6c85/#d94b63), giving
          the same warmth in the corners at zero per-frame GPU cost */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(90% 80% at 28% 22%, #ffd9e2 0%, transparent 55%)," +
            "radial-gradient(85% 90% at 78% 72%, #d94b63 0%, transparent 60%)," +
            "radial-gradient(120% 120% at 50% 50%, #ee6c85 0%, transparent 72%)",
        }}
      />

      {/* legibility + vignette: bright centre keeps the headline crisp; a soft
          rose vignette darkens the outer edges for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 78% at 50% 15%, rgba(255,255,255,0.72), rgba(255,255,255,0.10) 46%, transparent 66%)," +
            "radial-gradient(125% 100% at 50% 46%, transparent 58%, rgba(200,60,92,0.12) 100%)",
        }}
      />

      {/* dedicated bottom fade strip — always melts the hero into the paper of
          the next section, independent of the content height, so there's no
          visible seam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-52"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-paper) 70%, transparent) 55%, var(--color-paper) 94%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
