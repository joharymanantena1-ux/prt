import { useEffect, useRef } from "react";

/* Fragments de code qui dérivent vers le haut dans une fenêtre terminal.
   Canvas 2D minimal : ~20 colonnes, un seul rAF, mis en pause hors écran
   et quand l'onglet est masqué. Sous prefers-reduced-motion : une seule
   frame statique. Le vert vient du token --success (vert sobre du système). */

const CHARS = "01{}[]()<>=+*/;:.#$&|~^%?";

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
}

const CodeRain = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Teinte du token success ("150 40% 45%" par ex.), repli vert sobre. La
    // fenêtre est toujours sombre : on relève la luminosité au plancher lisible
    // (le vert « light mode » du token serait trop éteint sur du noir).
    const [h = "150", s = "40%", l = "45%"] = (
      getComputedStyle(document.documentElement).getPropertyValue("--success").trim() ||
      "150 40% 45%"
    ).split(/\s+/);
    const lum = Math.max(parseFloat(l) || 45, 58);
    const color = (alpha: number) => `hsla(${h}, ${s}, ${lum}%, ${alpha})`;

    const FONT = 13;
    const LINE = FONT + 4;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols: Column[] = [];
    let raf = 0;
    let last = 0;
    let visible = false;
    let hovered = false;

    const pick = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    const spawn = (x: number, h: number, init: boolean): Column => ({
      x,
      y: init ? Math.random() * h : h + 10 + Math.random() * 50,
      speed: 9 + Math.random() * 18,
      chars: Array.from({ length: 3 + Math.floor(Math.random() * 5) }, pick),
    });

    const size = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT}px "JetBrains Mono", ui-monospace, monospace`;
      const n = Math.max(4, Math.floor(width / 26));
      const step = width / n;
      cols = Array.from({ length: n }, (_, i) => spawn((i + 0.5) * step, height, true));
    };

    const drawColumn = (c: Column) => {
      c.chars.forEach((ch, j) => {
        // La tête de colonne est la plus lumineuse, la traîne s'éteint.
        ctx.fillStyle = color(Math.max(0.14, 0.92 - j * 0.17));
        ctx.fillText(ch, c.x, c.y + j * LINE);
      });
    };

    const frame = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      cols.forEach(drawColumn);
    };

    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      const { height } = canvas.getBoundingClientRect();
      const boost = hovered ? 1.7 : 1;
      cols.forEach((c, i) => {
        c.y -= c.speed * boost * dt;
        if (Math.random() < 0.015) c.chars[Math.floor(Math.random() * c.chars.length)] = pick();
        if (c.y < -c.chars.length * LINE) cols[i] = spawn(c.x, height, false);
      });
      frame();
    };

    const start = () => {
      if (raf || reduce) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    size();
    frame(); // frame statique immédiate (et unique sous reduced-motion)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0.1 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    const ro = new ResizeObserver(() => { size(); frame(); });
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default CodeRain;
