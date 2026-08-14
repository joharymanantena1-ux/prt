import { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

// Progress ring geometry (SVG user units)
const RING_R = 70;
const RING_C = 2 * Math.PI * RING_R;
// Smooth, steady climb across the full duration (no end-of-bar stall on long loads)
const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRaf = useRef<number | null>(null);
  const parallaxRaf = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  // ── Eased progress 0→100, then fade out and hand off ─────────────────────────
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The full intro plays once per session — returning to the tab mid-session
    // fast-tracks the loader so navigation never feels gated (perf > effet).
    let seen = false;
    try {
      seen = sessionStorage.getItem("portfolio-loader-seen") === "1";
      sessionStorage.setItem("portfolio-loader-seen", "1");
    } catch {
      /* storage unavailable (private mode) → always play the full intro */
    }
    const duration = reduce ? 400 : seen ? 700 : 2500;
    const exitDelay = reduce ? 200 : seen ? 300 : 600;
    let startTs = 0;

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = Math.min((ts - startTs) / duration, 1);
      setProgress(Math.round(easeInOutQuad(t) * 100));
      if (t < 1) {
        progressRaf.current = requestAnimationFrame(tick);
      } else {
        setExiting(true);
        window.setTimeout(onComplete, exitDelay);
      }
    };

    progressRaf.current = requestAnimationFrame(tick);
    return () => {
      if (progressRaf.current) cancelAnimationFrame(progressRaf.current);
    };
  }, [onComplete]);

  // ── Pointer parallax (desktop only; rAF-throttled; off for reduced motion) ───
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const root = rootRef.current;
    if (!root) return;

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5; // -0.5 … 0.5
      const ny = e.clientY / window.innerHeight - 0.5;
      if (parallaxRaf.current) return;
      parallaxRaf.current = requestAnimationFrame(() => {
        parallaxRaf.current = null;
        root.style.setProperty("--rx", `${(-ny * 8).toFixed(2)}deg`);
        root.style.setProperty("--ry", `${(nx * 8).toFixed(2)}deg`);
        root.style.setProperty("--px", `${(nx * 26).toFixed(1)}px`);
        root.style.setProperty("--py", `${(ny * 26).toFixed(1)}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (parallaxRaf.current) cancelAnimationFrame(parallaxRaf.current);
    };
  }, []);

  // Position of the glowing node at the leading edge of the progress arc
  const theta = (progress / 100) * 2 * Math.PI;
  const dotX = 80 + RING_R * Math.sin(theta);
  const dotY = 80 - RING_R * Math.cos(theta);

  const ease = "cubic-bezier(.22,.61,.36,1)";

  return (
    <div
      ref={rootRef}
      role="progressbar"
      aria-busy={!exiting}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Chargement du portfolio"
      className={`fixed inset-0 z-loader flex flex-col items-center justify-center gap-9 overflow-hidden bg-background transition-[opacity,transform] duration-500 ease-out ${
        exiting ? "opacity-0 scale-[1.03] pointer-events-none" : "opacity-100"
      }`}
      style={{ perspective: "1200px" }}
    >
      {/* L0 — receding grid floor (depth cue) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          transform: "translate3d(calc(var(--px,0px) * -0.25), calc(var(--py,0px) * -0.25), 0)",
          transition: `transform .4s ${ease}`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: "perspective(620px) rotateX(70deg)",
            transformOrigin: "center bottom",
            WebkitMaskImage: "radial-gradient(ellipse 75% 100% at 50% 0%, #000 18%, transparent 78%)",
            maskImage: "radial-gradient(ellipse 75% 100% at 50% 0%, #000 18%, transparent 78%)",
          }}
        >
          <div
            className="absolute inset-[-60%] animate-[loader-grid_6s_linear_infinite]"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--primary) / 0.18) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary) / 0.18) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>
      </div>

      {/* L1 — ambient orbs (far, parallax) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          style={{
            transform: "translate3d(calc(var(--px,0px) * -0.5), calc(var(--py,0px) * -0.5), 0)",
            transition: `transform .4s ${ease}`,
          }}
        >
          <div className="w-[520px] h-[520px] max-w-[88vw] rounded-full bg-primary/12 blur-3xl" />
        </div>
        <div
          className="absolute"
          style={{
            transform: "translate3d(calc(var(--px,0px) * 0.5), calc(var(--py,0px) * 0.5), 0)",
            transition: `transform .4s ${ease}`,
          }}
        >
          <div className="w-[360px] h-[360px] max-w-[68vw] rounded-full bg-primary/8 blur-3xl" />
        </div>
      </div>

      {/* L2 — focal stack: tilt + parallax in one transform */}
      <div
        className="relative"
        style={{
          transform:
            "translate3d(calc(var(--px,0px) * 0.6), calc(var(--py,0px) * 0.6), 0) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
          transition: `transform .4s ${ease}`,
        }}
      >
        {/* entrance (its own transform) */}
        <div className="animate-[loader-in_.7s_cubic-bezier(.22,.61,.36,1)_both]">
          {/* breathe (its own transform) */}
          <div className="relative grid place-items-center animate-[loader-breathe_4.5s_ease-in-out_infinite]">
            {/* Decorative outer dotted ring — slow counter-rotation */}
            <svg
              viewBox="0 0 200 200"
              className="absolute w-60 h-60 md:w-72 md:h-72 animate-[spin_22s_linear_infinite]"
              role="presentation"
              aria-hidden="true"
            >
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                strokeDasharray="1.5 10"
                strokeLinecap="round"
                opacity="0.35"
              />
            </svg>

            {/* Progress ring */}
            <svg viewBox="0 0 160 160" className="w-48 h-48 md:w-56 md:h-56" role="presentation">
              <defs>
                <linearGradient id="loaderRing" x1="0" y1="0" x2="1" y2="1">
                  {/* royal quasi flat — primary→brand, s'adapte aux deux modes */}
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--brand))" />
                </linearGradient>
              </defs>
              {/* track */}
              <circle cx="80" cy="80" r={RING_R} fill="none" stroke="hsl(var(--border))" strokeWidth="2.5" opacity="0.5" />
              {/* progress arc */}
              <circle
                cx="80"
                cy="80"
                r={RING_R}
                fill="none"
                stroke="url(#loaderRing)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - progress / 100)}
                transform="rotate(-90 80 80)"
              />
              {/* leading glow node (halo + core) */}
              <circle cx={dotX} cy={dotY} r="9" fill="hsl(var(--primary))" opacity="0.22" />
              <circle cx={dotX} cy={dotY} r="4.5" fill="hsl(var(--primary))" />
            </svg>

            {/* Monogram (front plane) */}
            <div className="absolute inset-0 grid place-items-center select-none">
              <span
                className="text-5xl md:text-6xl font-bold leading-none drop-shadow-[0_6px_20px_hsl(var(--primary)/0.3)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="text-gradient">J</span>
                <span className="text-foreground/25">-</span>
                <span className="text-foreground">m</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* L3 — name composing letter-by-letter + percentage readout */}
      <div className="relative z-10 flex flex-col items-center gap-2.5 animate-[loader-in_.7s_cubic-bezier(.22,.61,.36,1)_both]">
        <p
          className="text-base md:text-lg font-display font-semibold tracking-[0.18em] uppercase"
          aria-label="Johary Manantena"
        >
          {"Johary Manantena".split("").map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="inline-block animate-[loader-letter_.5s_cubic-bezier(.22,.61,.36,1)_both]"
              style={{ animationDelay: `${0.3 + i * 0.05}s`, whiteSpace: "pre" }}
            >
              {ch}
            </span>
          ))}
        </p>
        <p className="text-xs text-muted-foreground font-medium tabular-nums tracking-[0.3em]">
          {progress}% · DÉVELOPPEUR FULL-STACK
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
