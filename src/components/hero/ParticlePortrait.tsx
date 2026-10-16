import { useEffect, useRef } from "react";
import { prefersReducedMotion, useIntroDone } from "./useIntroDone";

/**
 * Le portrait en particules. Un canvas 2D posé exactement sur la photo (même
 * boîte, même cadrage `object-fit: cover` en haut) : la photo est échantillonnée
 * en points gris, qui s'assemblent depuis une poussière dispersée (~1,5 s),
 * puis la vraie photo revient par-dessus et la boucle s'arrête. Au survol (souris
 * seulement), la photo redevient particules, qui s'écartent du curseur puis se
 * remettent en place ; au départ du curseur, la photo revient.
 *
 * Au toucher, pas de survol : un tap éclabousse les points autour du doigt, un
 * glissé horizontal les balaie comme un pinceau (`touch-action: pan-y` : le
 * défilement vertical reste natif et annule le geste), et le lâcher rend la
 * photo. L'assemblage attend que le portrait soit à moitié à l'écran — sur
 * téléphone il est sous la ligne de flottaison, il se jouait hors de vue.
 *
 * L'état est porté par la figure (`data-fx` : `ghost` = points visibles, photo
 * en filigrane ; `photo` = photo nette) et les fondus vivent dans index.css.
 * Rendu par ImageData (un bloc de pixels par point) : des milliers de fillRect
 * coûteraient trop. Le canvas est à la résolution CSS et affiché `pixelated`
 * (points nets sur écran Retina, quatre fois moins de pixels à pousser), et
 * l'assemblage attend que la page ait fini de charger. Rien ne tourne quand
 * rien ne bouge.
 */

type Particles = {
  n: number;
  tx: Float32Array; // cible (px CSS)
  ty: Float32Array;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  sx: Float32Array; // départ de l'assemblage
  sy: Float32Array;
  delay: Float32Array; // ms
  color: Uint32Array; // ABGR
};

const ASSEMBLE = 1000; // durée d'un point (ms)
const SPREAD = 550; // étalement des départs (ms)
const REPEL = 70; // rayon du curseur (px CSS)

function sample(img: HTMLImageElement, w: number, h: number, step: number) {
  const off = document.createElement("canvas");
  off.width = Math.round(w);
  off.height = Math.round(h);
  const ctx = off.getContext("2d", { willReadFrequently: true });
  // object-fit: cover, object-position: 50% 0%
  const k = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * k;
  ctx.drawImage(img, (w - dw) / 2, 0, dw, img.naturalHeight * k);
  const { data } = ctx.getImageData(0, 0, off.width, off.height);
  const pts: number[] = [];
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      const i = ((y | 0) * off.width + (x | 0)) * 4;
      if (data[i + 3] < 140) continue;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // Un peu relevé : sur la plaque sombre, les gris profonds disparaîtraient.
      const v = Math.min(255, 26 + lum * 0.98) | 0;
      pts.push(x, y, v);
    }
  }
  const n = pts.length / 3;
  const p: Particles = {
    n,
    tx: new Float32Array(n),
    ty: new Float32Array(n),
    x: new Float32Array(n),
    y: new Float32Array(n),
    vx: new Float32Array(n),
    vy: new Float32Array(n),
    sx: new Float32Array(n),
    sy: new Float32Array(n),
    delay: new Float32Array(n),
    color: new Uint32Array(n),
  };
  for (let j = 0; j < n; j++) {
    const tx = pts[j * 3];
    const ty = pts[j * 3 + 1];
    const v = pts[j * 3 + 2];
    p.tx[j] = tx;
    p.ty[j] = ty;
    // Poussière : un nuage autour de la silhouette, plus lâche vers le bas.
    const a = Math.random() * Math.PI * 2;
    const r = (0.25 + Math.random() * 0.55) * Math.max(w, h);
    p.sx[j] = w / 2 + Math.cos(a) * r * 0.7;
    p.sy[j] = h * 0.55 + Math.sin(a) * r * 0.6;
    p.delay[j] = (ty / h) * SPREAD * 0.6 + Math.random() * SPREAD * 0.4;
    p.color[j] = (255 << 24) | (v << 16) | (v << 8) | v;
  }
  return p;
}

const easeOut = (t: number) => 1 - (1 - t) ** 3;

export default function ParticlePortrait() {
  const ref = useRef<HTMLCanvasElement>(null);
  const introDone = useIntroDone();

  useEffect(() => {
    const canvas = ref.current;
    const figure = canvas?.closest<HTMLElement>(".hero-portrait");
    const img = figure?.querySelector("img");
    if (!canvas || !figure || !img || prefersReducedMotion()) return;
    figure.dataset.fx = "ghost"; // photo en filigrane dès le montage
    if (!introDone) return;

    const ctx = canvas.getContext("2d");
    let particles: Particles | null = null;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let image: ImageData | null = null;
    let pixels: Uint32Array | null = null;
    let dot = 2;
    let raf = 0;
    let mode: "assemble" | "settle" | "idle" = "idle";
    let t0 = 0;
    let pointer: { x: number; y: number } | null = null;
    let calm = 0;
    let cancelled = false;

    const draw = () => {
      if (!particles || !pixels || !image) return;
      pixels.fill(0);
      const W = canvas.width;
      const H = canvas.height;
      const { n, x, y, color } = particles;
      for (let j = 0; j < n; j++) {
        const px = (x[j] * dpr) | 0;
        const py = (y[j] * dpr) | 0;
        if (px < 0 || py < 0 || px + dot > W || py + dot > H) continue;
        const c = color[j];
        for (let dy = 0; dy < dot; dy++) {
          const row = (py + dy) * W + px;
          for (let dx = 0; dx < dot; dx++) pixels[row + dx] = c;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    const toPhoto = () => {
      figure.dataset.fx = "photo";
      mode = "idle";
    };

    const frame = (now: number) => {
      raf = 0;
      if (!particles) return;
      const p = particles;
      if (mode === "assemble") {
        let done = true;
        for (let j = 0; j < p.n; j++) {
          const t = Math.min(
            1,
            Math.max(0, (now - t0 - p.delay[j]) / ASSEMBLE),
          );
          if (t < 1) done = false;
          const e = easeOut(t);
          p.x[j] = p.sx[j] + (p.tx[j] - p.sx[j]) * e;
          p.y[j] = p.sy[j] + (p.ty[j] - p.sy[j]) * e;
        }
        draw();
        if (done) {
          // Un temps à l'état « points » (~0,4 s de calme compté par la
          // boucle de repos), puis la photo nette revient.
          mode = "settle";
          calm = -10;
        }
      } else if (mode === "settle") {
        // Ressort vers la cible, poussée du curseur.
        let moving = 0;
        for (let j = 0; j < p.n; j++) {
          let ax = (p.tx[j] - p.x[j]) * 0.075;
          let ay = (p.ty[j] - p.y[j]) * 0.075;
          if (pointer) {
            const dx = p.x[j] - pointer.x;
            const dy = p.y[j] - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < REPEL * REPEL && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = (1 - d / REPEL) * 3.2;
              ax += (dx / d) * f;
              ay += (dy / d) * f;
            }
          }
          p.vx[j] = (p.vx[j] + ax) * 0.8;
          p.vy[j] = (p.vy[j] + ay) * 0.8;
          p.x[j] += p.vx[j];
          p.y[j] += p.vy[j];
          moving = Math.max(moving, Math.abs(p.vx[j]) + Math.abs(p.vy[j]));
        }
        draw();
        calm = moving < 0.08 ? calm + 1 : 0;
        if (!pointer && calm > 12) {
          toPhoto();
          return;
        }
      } else {
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const setup = () => {
      const box = canvas.getBoundingClientRect();
      w = box.width;
      h = box.height;
      if (!w || !h) return false;
      dpr = 1; // résolution CSS, affichée `pixelated`
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // Mobile : portrait plus petit, points plus serrés pour garder le trait.
      const step = w < 300 ? 3 : 4;
      dot = Math.max(1, Math.round((step / 2) * dpr));
      image = ctx.createImageData(canvas.width, canvas.height);
      pixels = new Uint32Array(image.data.buffer);
      particles = sample(img, w, h, step);
      return true;
    };

    const start = () => {
      if (cancelled || !setup()) return;
      mode = "assemble";
      t0 = performance.now();
      run();
    };
    // Après le chargement de la page : l'échantillonnage et les premières
    // frames ne disputent pas le fil principal au rendu initial.
    // Tactile : la figure se lit plus bas, on attend qu'elle soit visible.
    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    let seen: IntersectionObserver | null = null;
    const later = () => {
      if (fine) {
        window.setTimeout(start, 300);
        return;
      }
      seen = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          seen.disconnect();
          window.setTimeout(start, 150);
        },
        { threshold: 0.5 },
      );
      seen.observe(figure);
    };
    const ready = () => {
      if (document.readyState === "complete") later();
      else window.addEventListener("load", later, { once: true });
    };
    if (img.complete && img.naturalWidth) ready();
    else img.addEventListener("load", ready, { once: true });

    // Survol : seulement avec une vraie souris (pas de « survol » au toucher).
    const local = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      return { x: e.clientX - box.left, y: e.clientY - box.top };
    };
    const onEnter = (e: PointerEvent) => {
      if (!particles || mode === "assemble") return;
      pointer = local(e);
      figure.dataset.fx = "ghost";
      mode = "settle";
      calm = 0;
      run();
    };
    const onMove = (e: PointerEvent) => {
      if (!pointer) return;
      pointer = local(e);
      run();
    };
    const onLeave = () => {
      pointer = null;
      calm = 0;
      if (mode === "settle") run();
    };
    if (fine) {
      figure.addEventListener("pointerenter", onEnter);
      figure.addEventListener("pointermove", onMove);
      figure.addEventListener("pointerleave", onLeave);
    }

    // Toucher : éclaboussure au contact, pinceau au glissé, photo au lâcher.
    const SPLASH = 100;
    const onTouchDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || !particles || mode === "assemble")
        return;
      const p = particles;
      const at = local(e);
      for (let j = 0; j < p.n; j++) {
        const dx = p.x[j] - at.x;
        const dy = p.y[j] - at.y;
        const d = Math.hypot(dx, dy);
        if (d >= SPLASH || d < 0.01) continue;
        const f = (1 - d / SPLASH) * 11;
        p.vx[j] += (dx / d) * f;
        p.vy[j] += (dy / d) * f;
      }
      pointer = at;
      figure.dataset.fx = "ghost";
      mode = "settle";
      calm = 0;
      run();
    };
    const onTouchMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || !pointer) return;
      pointer = local(e);
      run();
    };
    const onTouchEnd = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      onLeave();
    };
    figure.addEventListener("pointerdown", onTouchDown);
    figure.addEventListener("pointermove", onTouchMove);
    figure.addEventListener("pointerup", onTouchEnd);
    figure.addEventListener("pointercancel", onTouchEnd);

    // iOS redimensionne à chaque apparition de la barre d'adresse : on ne
    // rééchantillonne que si la boîte du portrait a vraiment changé.
    const onResize = () => {
      if (mode !== "idle" || !particles) return;
      const box = canvas.getBoundingClientRect();
      if (Math.abs(box.width - w) > 1 || Math.abs(box.height - h) > 1) setup();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      img.removeEventListener("load", ready);
      window.removeEventListener("load", later);
      figure.removeEventListener("pointerenter", onEnter);
      figure.removeEventListener("pointermove", onMove);
      figure.removeEventListener("pointerleave", onLeave);
      figure.removeEventListener("pointerdown", onTouchDown);
      figure.removeEventListener("pointermove", onTouchMove);
      figure.removeEventListener("pointerup", onTouchEnd);
      figure.removeEventListener("pointercancel", onTouchEnd);
      seen?.disconnect();
      window.removeEventListener("resize", onResize);
      figure.dataset.fx = "photo";
    };
  }, [introDone]);

  return <canvas ref={ref} className="portrait-particles" aria-hidden="true" />;
}
