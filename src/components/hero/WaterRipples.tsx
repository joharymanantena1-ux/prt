import { useEffect, useRef } from "react";
import { prefersReducedMotion, useIntroDone } from "./useIntroDone";

/**
 * Gouttes d'eau sur le fond du hero. Une grille de points à peine visible ;
 * un geste y lâche une goutte — à la souris, tous les ~110 px parcourus ; au
 * clic ou au toucher, une goutte plus franche — et son onde circulaire pousse
 * les points vers l'extérieur et en allume quelques-uns à l'accent. Une goutte
 * d'accueil tombe près du titre quand l'écran d'accueil s'en va.
 *
 * Canvas 2D, ~1 500 fillRect groupés par opacité. La grille s'estompe vers
 * les bords par un poids calculé une fois par point (quatre niveaux) : un
 * `mask-image` CSS sur ce canvas redessiné à chaque frame divisait le débit
 * par deux. Sans goutte vivante, la grille est dessinée une fois et la boucle
 * s'arrête. Mouvement réduit : grille fixe.
 */

type Drop = { x: number; y: number; t0: number; force: number };

const LIFE = 2200; // ms
const SPEED = 0.3; // px / ms
const BAND = 44; // demi-épaisseur de l'onde (px)

export default function WaterRipples() {
  const ref = useRef<HTMLCanvasElement>(null);
  const introDone = useIntroDone();

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    const reduce = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let dpr = 1;
    let gap = 28;
    let dots: Float32Array = new Float32Array(0);
    let out: Float32Array = new Float32Array(0); // x, y, taille, niveau (<0 : allumé)
    let ink = "#efefec";
    let accent = "#d0f764";
    const drops: Drop[] = [];
    let raf = 0;
    let last = { x: -1e4, y: -1e4, t: 0 };

    const setup = () => {
      const box = hero.getBoundingClientRect();
      w = box.width;
      h = box.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gap = w < 768 ? 24 : 28;
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      // x, y, niveau d'opacité (1–4) ; les points trop près du bord sautent.
      const list: number[] = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const x = c * gap + gap / 2;
          const y = r * gap + gap / 2;
          const ex = (x - w * 0.4) / (w * 0.62);
          const ey = (y - h * 0.46) / (h * 0.66);
          const fade =
            1 - Math.min(1, Math.max(0, (Math.hypot(ex, ey) - 0.35) / 0.6));
          const level = Math.ceil(fade * 4);
          if (level > 0) list.push(x, y, level);
        }
      dots = new Float32Array(list);
      out = new Float32Array(dots.length + dots.length / 3);
      const style = getComputedStyle(hero);
      ink = style.color;
      accent = `hsl(${style.getPropertyValue("--primary").trim()})`;
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      let o = 0;
      for (let k = 0; k < dots.length; k += 3) {
        let x = dots[k];
        let y = dots[k + 1];
        let wave = 0;
        for (const d of drops) {
          const age = now - d.t0;
          const dx = x - d.x;
          const dy = y - d.y;
          const dist = Math.hypot(dx, dy) || 1;
          const u = (dist - age * SPEED) / BAND;
          if (u <= -1 || u >= 1) continue;
          // Une bosse par onde, qui s'amortit avec l'âge de la goutte.
          const amp =
            d.force * Math.exp(-age / 900) * Math.cos((u * Math.PI) / 2);
          wave += amp;
          x += (dx / dist) * amp * 9;
          y += (dy / dist) * amp * 9;
        }
        out[o++] = x;
        out[o++] = y;
        out[o++] = 1.4 + Math.min(wave, 1.2) * 1.6;
        out[o++] = wave > 0.22 ? -dots[k + 2] : dots[k + 2];
      }
      // Une passe par niveau d'opacité, puis les points allumés à l'accent.
      ctx.fillStyle = ink;
      for (let level = 1; level <= 4; level++) {
        ctx.globalAlpha = 0.14 * (level / 4);
        for (let i = 0; i < o; i += 4) {
          if (out[i + 3] !== level) continue;
          const s = out[i + 2];
          ctx.fillRect(out[i] - s / 2, out[i + 1] - s / 2, s, s);
        }
      }
      ctx.fillStyle = accent;
      for (let i = 0; i < o; i += 4) {
        if (out[i + 3] >= 0) continue;
        ctx.globalAlpha = 0.55 * (-out[i + 3] / 4);
        const s = out[i + 2];
        ctx.fillRect(out[i] - s / 2, out[i + 1] - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = 0;
      while (drops.length && now - drops[0].t0 > LIFE) drops.shift();
      draw(now);
      if (drops.length) raf = requestAnimationFrame(frame);
    };
    const drop = (x: number, y: number, force: number) => {
      if (reduce) return;
      drops.push({ x, y, t0: performance.now(), force });
      if (drops.length > 7) drops.shift();
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const local = (e: PointerEvent) => {
      const box = hero.getBoundingClientRect();
      return { x: e.clientX - box.left, y: e.clientY - box.top };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // au toucher, le geste défile
      const p = local(e);
      const now = performance.now();
      if (Math.hypot(p.x - last.x, p.y - last.y) < 110 || now - last.t < 160)
        return;
      last = { ...p, t: now };
      drop(p.x, p.y, 0.55);
    };
    let lastType = "";
    const onDown = (e: PointerEvent) => {
      lastType = e.pointerType;
      if (e.pointerType !== "mouse") return; // au toucher : `click` ci-dessous
      const p = local(e);
      drop(p.x, p.y, 1);
    };
    // Au toucher, `pointerdown` part aussi au début d'un défilement : la goutte
    // n'attend que le vrai tap (le navigateur n'émet `click` que pour lui).
    const onTap = (e: MouseEvent) => {
      // Safari peut émettre `click` sans type de pointeur : on se fie au
      // dernier `pointerdown`.
      if (lastType === "mouse") return;
      const box = hero.getBoundingClientRect();
      drop(e.clientX - box.left, e.clientY - box.top, 1);
    };

    setup();
    draw(performance.now());
    if (introDone && !reduce) {
      // La goutte d'accueil, sous le titre.
      const title = hero.querySelector(".hero-title")?.getBoundingClientRect();
      const box = hero.getBoundingClientRect();
      if (title) {
        window.setTimeout(
          () =>
            drop(
              title.left - box.left + title.width * 0.35,
              title.top - box.top + title.height * 0.5,
              1,
            ),
          250,
        );
      }
    }
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerdown", onDown);
    hero.addEventListener("click", onTap);
    const resize = new ResizeObserver(() => {
      setup();
      draw(performance.now());
    });
    resize.observe(hero);
    // Le thème change les couleurs : relire l'encre et l'accent.
    const theme = new MutationObserver(() => {
      setup();
      draw(performance.now());
    });
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerdown", onDown);
      hero.removeEventListener("click", onTap);
      resize.disconnect();
      theme.disconnect();
    };
  }, [introDone]);

  return <canvas ref={ref} className="hero-ripples" aria-hidden="true" />;
}
