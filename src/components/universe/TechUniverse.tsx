import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { LocateFixed, Minus, Plus, Search, X } from "lucide-react";
import Modal from "@/components/Modal";
import "./universe.css";
import { useT, tx, type Lang } from "@/i18n";
import {
  categories,
  universe,
  type CategoryKey,
  type Tech,
} from "@/data/techUniverse";

/* ── Disposition ─────────────────────────────────────────────────────────────
   Calculée une fois, déterministe : chaque famille est un amas posé sur un
   anneau autour du noyau ; dans l'amas, les technologies suivent une spirale
   de Fibonacci, la plus utilisée au centre. Pas de simulation physique : rien
   ne tourne en continu, la vue est stable d'une visite à l'autre. */

type Node = Tech & {
  x: number;
  y: number;
  r: number;
  d: number;
  /** Rang dans l'amas : le nom n'apparaît qu'à partir d'un certain zoom. */
  tier: "top" | "mid" | "small";
  /** Nom du côté extérieur de l'amas, pour éviter les chevauchements. */
  side: "start" | "end";
};

const SPREAD = 54;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/* Arbre couvrant minimal (Prim) : les lignes « constellation » d'un amas. */
function spanningTree(nodes: Node[]) {
  if (nodes.length < 2) return [] as [Node, Node][];
  const inTree = new Set([0]);
  const edges: [Node, Node][] = [];
  while (inTree.size < nodes.length) {
    let best: [number, number] | null = null;
    let bestD = Infinity;
    for (const i of inTree)
      for (let j = 0; j < nodes.length; j++) {
        if (inTree.has(j)) continue;
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < bestD) {
          bestD = d;
          best = [i, j];
        }
      }
    inTree.add(best[1]);
    edges.push([nodes[best[0]], nodes[best[1]]]);
  }
  return edges;
}

const bounds = (list: { x: number; y: number }[], pad: number) => {
  const xs = list.map((p) => p.x);
  const ys = list.map((p) => p.y);
  return {
    x0: Math.min(...xs) - pad,
    y0: Math.min(...ys) - pad,
    x1: Math.max(...xs) + pad,
    y1: Math.max(...ys) + pad,
  };
};

/* Deux dispositions : un anneau elliptique pour un écran paysage, deux
   colonnes de quatre amas pour un écran portrait (téléphone). */
function layout(kind: "landscape" | "portrait") {
  const clusters = categories.map((category, i) => {
    const [cx, cy] =
      kind === "landscape"
        ? [
            Math.cos(-Math.PI / 2 + (i / categories.length) * Math.PI * 2) *
              640,
            Math.sin(-Math.PI / 2 + (i / categories.length) * Math.PI * 2) *
              400,
          ]
        : [(i % 2 ? 1 : -1) * 225, (Math.floor(i / 2) - 1.5) * 440];
    const angle = Math.atan2(cy, cx);
    const members = universe.techs.filter((t) => t.category === category.key);
    const nodes: Node[] = members.map((tech, k) => {
      const radius = SPREAD * Math.sqrt(k);
      const theta = k * GOLDEN + angle;
      const x = cx + Math.cos(theta) * radius;
      const y = cy + Math.sin(theta) * radius;
      return {
        ...tech,
        x,
        y,
        tier: k === 0 ? "top" : k <= 2 ? "mid" : "small",
        side: k === 0 ? (cx < -1 ? "end" : "start") : x < cx ? "end" : "start",
        r: 4 + Math.sqrt(tech.works.length) * 3.4,
        // Ordre d'apparition : du noyau vers l'extérieur.
        d: Math.round(Math.hypot(x, y) * 0.9 + k * 18),
      };
    });
    const extent = SPREAD * Math.sqrt(Math.max(members.length - 1, 0)) + 22;
    // Le nom de la famille au-dessus (ou au-dessous) de l'amas, centré : il
    // ne déborde jamais sur le côté.
    const labelY = cy <= 0 ? cy - extent - 26 : cy + extent + 38;
    return {
      ...category,
      cx,
      cy,
      labelY,
      nodes,
      tree: spanningTree(nodes),
    };
  });
  const nodes = clusters.flatMap((c) => c.nodes);
  return {
    kind,
    clusters,
    nodes,
    byName: new Map(nodes.map((n) => [n.name, n])),
    all: bounds(
      [...nodes, ...clusters.map((c) => ({ x: c.cx, y: c.labelY }))],
      110,
    ),
  };
}
const LANDSCAPE = layout("landscape");
const PORTRAIT = layout("portrait");
type Layout = typeof LANDSCAPE;

const colorOf = Object.fromEntries(categories.map((c) => [c.key, c.color]));

/* Voisins : technologies utilisées dans un même travail, avec la fréquence. */
const neighbours = new Map<string, Map<string, number>>();
for (const { a, b, weight } of universe.links) {
  if (!neighbours.has(a)) neighbours.set(a, new Map());
  if (!neighbours.has(b)) neighbours.set(b, new Map());
  neighbours.get(a).set(b, weight);
  neighbours.get(b).set(a, weight);
}

type View = { x: number; y: number; k: number };
const K_MIN = 0.22;
const K_MAX = 4;

const words = (lang: Lang, n: number) =>
  lang === "fr"
    ? n > 1
      ? "projets"
      : "projet"
    : n > 1
      ? "projects"
      : "project";

/**
 * « My Tech Universe » : les technologies de tous les projets, en
 * constellation. Ouverte à la demande depuis la section Expertise, en plein
 * écran (Modal, variante `modal-universe`) : Échap ferme, le focus revient au
 * bouton, la page n'a pas bougé. Zoom à la molette / au pincement / aux
 * boutons, déplacement au glisser, flèches pour aller d'étoile en étoile.
 */
export default function TechUniverse({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lang } = useT();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [portrait, setPortrait] = useState(
    () => window.innerWidth < window.innerHeight,
  );
  const L: Layout = portrait ? PORTRAIT : LANDSCAPE;
  const { clusters, nodes, byName } = L;
  const current = useRef(L);
  current.current = L;
  const [focusName, setFocusName] = useState(L.nodes[0]?.name);
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<CategoryKey | null>(null);

  const stage = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const world = useRef<SVGGElement>(null);
  const panel = useRef<HTMLElement>(null);
  const tools = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, SVGGElement>());
  const view = useRef<View>({ x: 0, y: 0, k: 1 });
  const goal = useRef<View | null>(null);
  const raf = useRef(0);
  const size = useRef({ w: 1, h: 1 });

  const reduce = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  /* ── Vue : écrite directement sur le groupe, sans rendu React ── */
  const apply = useCallback(() => {
    const { x, y, k } = view.current;
    world.current?.setAttribute(
      "transform",
      `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${k.toFixed(4)})`,
    );
    // Les libellés gardent leur taille à l'écran ; les plus petits
    // n'apparaissent qu'en approchant.
    svg.current?.style.setProperty("--k", k.toFixed(3));
    svg.current?.classList.toggle("is-near", k > 1.25);
    svg.current?.classList.toggle("is-far", k < 0.7);
  }, []);

  const step = useCallback(() => {
    raf.current = 0;
    const target = goal.current;
    if (!target) return;
    const v = view.current;
    const t = reduce ? 1 : 0.16;
    v.x += (target.x - v.x) * t;
    v.y += (target.y - v.y) * t;
    v.k += (target.k - v.k) * t;
    apply();
    if (
      Math.abs(target.x - v.x) + Math.abs(target.y - v.y) > 0.3 ||
      Math.abs(target.k - v.k) > 0.001
    )
      raf.current = requestAnimationFrame(step);
    else goal.current = null;
  }, [apply, reduce]);

  const animateTo = useCallback(
    (target: View) => {
      goal.current = target;
      if (!raf.current) raf.current = requestAnimationFrame(step);
    },
    [step],
  );

  /** Zone libre de la scène : sous la barre d'outils, à côté du panneau
   *  (à droite sur grand écran, en bas sur téléphone). On y cadre. */
  const area = () => {
    const { w, h } = size.current;
    const top = (tools.current?.offsetHeight ?? 0) + 16;
    const p = panel.current;
    const wide = window.innerWidth >= 900;
    const right = wide && p ? p.offsetWidth + 32 : 0;
    const bottom = !wide && p ? p.offsetHeight + 24 : 0;
    return { x: 0, y: top, w: w - right, h: Math.max(120, h - top - bottom) };
  };

  const fit = useCallback(
    (b?: Layout["all"], instant = false) => {
      b = b ?? current.current.all;
      const room = area();
      const k = Math.max(
        K_MIN,
        Math.min(
          K_MAX,
          Math.min(room.w / (b.x1 - b.x0), room.h / (b.y1 - b.y0)),
        ),
      );
      const target = {
        k,
        x: room.x + room.w / 2 - ((b.x0 + b.x1) / 2) * k,
        y: room.y + room.h / 2 - ((b.y0 + b.y1) / 2) * k,
      };
      if (instant) {
        view.current = target;
        goal.current = null;
        apply();
      } else animateTo(target);
    },
    [animateTo, apply],
  );

  const centerOn = useCallback(
    (n: Node, minK = 1.4) => {
      const room = area();
      const k = Math.max(view.current.k, minK);
      animateTo({
        k,
        x: room.x + room.w / 2 - n.x * k,
        y: room.y + room.h / 2 - n.y * k,
      });
    },
    [animateTo],
  );

  const zoomBy = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      const v = goal.current ?? view.current;
      const k = Math.max(K_MIN, Math.min(K_MAX, v.k * factor));
      const px = cx ?? size.current.w / 2;
      const py = cy ?? size.current.h / 2;
      animateTo({
        k,
        x: px - ((px - v.x) / v.k) * k,
        y: py - ((py - v.y) / v.k) * k,
      });
    },
    [animateTo],
  );

  /* Taille de la scène, et cadrage initial. */
  useEffect(() => {
    if (!open) return;
    const el = stage.current;
    if (!el) return;
    let first = true;
    const observer = new ResizeObserver(([entry]) => {
      size.current = {
        w: entry.contentRect.width,
        h: entry.contentRect.height,
      };
      const tall = entry.contentRect.width < entry.contentRect.height;
      if (tall !== (current.current.kind === "portrait")) {
        // Changement d'orientation : l'autre disposition, recadrée.
        current.current = tall ? PORTRAIT : LANDSCAPE;
        setPortrait(tall);
        first = true;
      }
      if (first) {
        first = false;
        fit(current.current.all, true);
      }
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [open, fit]);

  /* ── Glisser, pincer, molette ── */
  useEffect(() => {
    const el = svg.current;
    if (!open || !el) return;
    const pointers = new Map<number, { x: number; y: number }>();
    let moved = false;
    let pinch: { d: number; k: number; mx: number; my: number } | null = null;
    const local = (e: PointerEvent | WheelEvent) => {
      const box = el.getBoundingClientRect();
      return { x: e.clientX - box.left, y: e.clientY - box.top };
    };
    const onDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, local(e));
      moved = false;
      goal.current = null;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = {
          d: Math.hypot(a.x - b.x, a.y - b.y),
          k: view.current.k,
          mx: (a.x + b.x) / 2,
          my: (a.y + b.y) / 2,
        };
      }
    };
    const onMove = (e: PointerEvent) => {
      const last = pointers.get(e.pointerId);
      if (!last) return;
      const p = local(e);
      pointers.set(e.pointerId, p);
      const v = view.current;
      if (pinch && pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const k = Math.max(
          K_MIN,
          Math.min(
            K_MAX,
            (pinch.k * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.d,
          ),
        );
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        // Le point sous les doigts reste sous les doigts (zoom + déplacement).
        v.x = mx - ((pinch.mx - v.x) / v.k) * k;
        v.y = my - ((pinch.my - v.y) / v.k) * k;
        v.k = k;
        pinch.mx = mx;
        pinch.my = my;
        moved = true;
        apply();
        return;
      }
      const dx = p.x - last.x;
      const dy = p.y - last.y;
      if (!moved && Math.hypot(dx, dy) < 3) {
        pointers.set(e.pointerId, last);
        return;
      }
      if (!moved) el.setPointerCapture(e.pointerId);
      moved = true;
      v.x += dx;
      v.y += dy;
      apply();
    };
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
    };
    // Un glissé ne doit pas sélectionner l'étoile sous le doigt.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = local(e);
      // Pincement trackpad (ctrlKey) plus sensible que la molette.
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018));
      const v = view.current;
      const k = Math.max(K_MIN, Math.min(K_MAX, v.k * factor));
      goal.current = null;
      v.x = p.x - ((p.x - v.x) / v.k) * k;
      v.y = p.y - ((p.y - v.y) / v.k) * k;
      v.k = k;
      apply();
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("wheel", onWheel);
    };
  }, [open, apply]);

  /* ── Sélection, recherche, familles ── */
  const select = useCallback(
    (name: string | null, move = true) => {
      setSelected(name);
      if (!name) return;
      setFocusName(name);
      const n = byName.get(name);
      // Après le rendu de la fiche : sur téléphone, le tiroir change de
      // hauteur et la zone libre avec lui. Zoom plus doux sur petit écran.
      if (n && move)
        requestAnimationFrame(() => centerOn(n, portrait ? 0.9 : 1.4));
    },
    [centerOn, byName, portrait],
  );

  const needle = query.trim().toLocaleLowerCase();
  const matches = useMemo(
    () =>
      needle
        ? nodes.filter((n) => n.name.toLocaleLowerCase().includes(needle))
        : [],
    [needle, nodes],
  );
  const matchSet = useMemo(
    () => new Set(matches.map((n) => n.name)),
    [matches],
  );

  const chooseFamily = (key: CategoryKey | null) => {
    setFamily(key);
    const cluster = clusters.find((c) => c.key === key);
    fit(cluster ? bounds(cluster.nodes, 110) : L.all);
  };

  const active = hovered ?? selected;
  const linked = active ? neighbours.get(active) : undefined;
  const dimmed = (n: Node) => {
    if (active) return n.name !== active && !linked?.has(n.name);
    if (needle) return !matchSet.has(n.name);
    if (family) return n.category !== family;
    return false;
  };

  /* Clavier : flèches d'étoile en étoile (la plus proche dans la direction),
     Entrée pour ouvrir, +/− pour zoomer, 0 pour tout revoir. */
  const onNodeKey = (e: KeyboardEvent, n: Node) => {
    const dirs: Record<string, [number, number]> = {
      ArrowRight: [1, 0],
      ArrowLeft: [-1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (dirs[e.key]) {
      e.preventDefault();
      const [dx, dy] = dirs[e.key];
      let best: Node | null = null;
      let score = Infinity;
      for (const m of nodes) {
        if (m === n) continue;
        const vx = m.x - n.x;
        const vy = m.y - n.y;
        const dist = Math.hypot(vx, vy);
        const cos = (vx * dx + vy * dy) / dist;
        if (cos < 0.4) continue;
        const s = dist * (2.2 - cos);
        if (s < score) {
          score = s;
          best = m;
        }
      }
      if (best) {
        setFocusName(best.name);
        nodeRefs.current.get(best.name)?.focus();
        centerOn(best, view.current.k);
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(n.name);
    }
  };
  const onStageKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    if (e.key === "+" || e.key === "=") zoomBy(1.3);
    else if (e.key === "-") zoomBy(1 / 1.3);
    else if (e.key === "0") fit();
  };

  const tech = selected ? byName.get(selected) : null;
  const pro = tech?.works.filter((w) => w.kind === "pro") ?? [];
  const academic = tech?.works.filter((w) => w.kind === "academic") ?? [];
  const companions = tech
    ? [...(neighbours.get(tech.name)?.entries() ?? [])]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 6)
    : [];

  const fr = lang === "fr";

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="modal-universe"
      title={fr ? "Mon univers tech" : "My tech universe"}
      subtitle={`${nodes.length} technologies · ${universe.works} ${fr ? "projets" : "projects"} · ${categories.length} ${fr ? "familles" : "families"}`}
      closeLabel={fr ? "Fermer l’univers tech" : "Close the tech universe"}
    >
      <div className="universe" onKeyDown={onStageKey}>
        {/* Deux plans d'étoiles qui dérivent à des vitesses différentes. */}
        <div className="universe-stars" aria-hidden="true" />
        <div className="universe-stars is-far" aria-hidden="true" />

        <div className="universe-tools" ref={tools}>
          <label className="universe-search">
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">
              {fr ? "Rechercher une technologie" : "Search a technology"}
            </span>
            <input
              type="search"
              value={query}
              placeholder={
                fr ? "Rechercher : React, Python…" : "Search: React, Python…"
              }
              onChange={(e) => {
                setQuery(e.target.value);
                setFamily(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && matches[0]) {
                  e.preventDefault();
                  select(matches[0].name);
                }
              }}
            />
          </label>
          <div
            className="universe-chips"
            role="group"
            aria-label={fr ? "Familles" : "Families"}
          >
            <button
              type="button"
              aria-pressed={family === null}
              onClick={() => chooseFamily(null)}
            >
              {fr ? "Tout" : "All"}
            </button>
            {clusters.map((c) => (
              <button
                key={c.key}
                type="button"
                aria-pressed={family === c.key}
                onClick={() => chooseFamily(family === c.key ? null : c.key)}
                style={{ "--c": c.color } as CSSProperties}
              >
                <i aria-hidden="true" />
                {tx(c.short, lang)}
              </button>
            ))}
          </div>
          <p className="sr-only" role="status">
            {needle
              ? `${matches.length} ${fr ? "résultat(s)" : "result(s)"}`
              : ""}
          </p>
        </div>

        <div className="universe-stage" ref={stage}>
          <svg
            ref={svg}
            className="universe-map"
            role="group"
            aria-label={
              fr
                ? "Constellation des technologies. Flèches pour se déplacer d’étoile en étoile, Entrée pour ouvrir, + et − pour zoomer, 0 pour tout revoir."
                : "Technology constellation. Arrow keys move from star to star, Enter opens, + and − zoom, 0 shows everything."
            }
          >
            <g ref={world}>
              {/* Le noyau et ses rayons vers chaque famille. */}
              <g className="uni-hub-lines" aria-hidden="true">
                {clusters.map((c, i) => (
                  <line
                    key={c.key}
                    className="uni-line"
                    x1={0}
                    y1={0}
                    x2={c.cx}
                    y2={c.cy}
                    pathLength={1}
                    style={{ "--d": i * 60 } as CSSProperties}
                  />
                ))}
              </g>
              {clusters.map((c) => (
                <g
                  key={c.key}
                  className={`uni-cluster${family && family !== c.key ? " is-dim" : ""}`}
                  style={{ "--c": c.color } as CSSProperties}
                  aria-hidden="true"
                >
                  {c.tree.map(([a, b]) => (
                    <line
                      key={`${a.name}-${b.name}`}
                      className="uni-line uni-tree"
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      pathLength={1}
                      style={{ "--d": Math.max(a.d, b.d) } as CSSProperties}
                    />
                  ))}
                  <text
                    className="uni-family"
                    x={c.cx}
                    y={c.labelY}
                    textAnchor="middle"
                  >
                    {tx(portrait ? c.short : c.label, lang).toLocaleUpperCase()}
                  </text>
                </g>
              ))}

              {/* Liens de l'étoile active : les technologies utilisées avec. */}
              {active && linked && (
                <g className="uni-links" aria-hidden="true">
                  {[...linked.entries()].map(([name, weight]) => {
                    const a = byName.get(active);
                    const b = byName.get(name);
                    return (
                      <line
                        key={name}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        style={
                          {
                            "--w": Math.min(1, 0.35 + weight * 0.22),
                          } as CSSProperties
                        }
                      />
                    );
                  })}
                </g>
              )}

              <circle className="uni-core" r={10} aria-hidden="true" />
              <text className="uni-core-label" y={-20} aria-hidden="true">
                JM
              </text>

              {nodes.map((n) => {
                const count = n.works.length;
                const isActive = n.name === active;
                // Nom forcé quand l'étoile est en jeu ; sinon selon le zoom.
                const label =
                  isActive ||
                  linked?.has(n.name) ||
                  matchSet.has(n.name) ||
                  family === n.category;
                return (
                  <g
                    key={n.name}
                    ref={(el) => {
                      if (el) nodeRefs.current.set(n.name, el);
                      else nodeRefs.current.delete(n.name);
                    }}
                    className={[
                      "uni-node",
                      dimmed(n) && "is-dim",
                      isActive && "is-active",
                      n.name === selected && "is-selected",
                      label ? "has-label" : `is-${n.tier}`,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={
                      {
                        "--c": colorOf[n.category],
                        "--d": n.d,
                      } as CSSProperties
                    }
                    role="button"
                    tabIndex={n.name === focusName ? 0 : -1}
                    aria-label={`${n.name}, ${count} ${words(lang, count)}`}
                    aria-pressed={n.name === selected}
                    onClick={() => select(n.name === selected ? null : n.name)}
                    onKeyDown={(e) => onNodeKey(e, n)}
                    onFocus={() => setFocusName(n.name)}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") setHovered(n.name);
                    }}
                    onPointerLeave={() => setHovered(null)}
                  >
                    {n.name === selected && (
                      <circle
                        className="uni-pulse"
                        cx={n.x}
                        cy={n.y}
                        r={n.r + 6}
                      />
                    )}
                    <circle
                      className="uni-halo"
                      cx={n.x}
                      cy={n.y}
                      r={n.r * 2.2}
                    />
                    <circle className="uni-dot" cx={n.x} cy={n.y} r={n.r} />
                    <text
                      className="uni-label"
                      x={n.side === "start" ? n.x + n.r + 6 : n.x - n.r - 6}
                      y={n.y + 4}
                      textAnchor={n.side}
                      style={
                        {
                          "--fs": 11 + Math.min(count, 10) * 0.6,
                        } as CSSProperties
                      }
                    >
                      {n.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          <div className="universe-zoom">
            <button
              type="button"
              className="icon-button"
              onClick={() => zoomBy(1.3)}
              aria-label={fr ? "Zoomer" : "Zoom in"}
            >
              <Plus size={18} />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => zoomBy(1 / 1.3)}
              aria-label={fr ? "Dézoomer" : "Zoom out"}
            >
              <Minus size={18} />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => {
                setFamily(null);
                fit();
              }}
              aria-label={fr ? "Tout revoir" : "Show everything"}
            >
              <LocateFixed size={18} />
            </button>
          </div>
        </div>

        <aside
          ref={panel}
          className={`universe-panel${tech ? " has-tech" : ""}`}
          aria-live="polite"
        >
          {tech ? (
            <div style={{ "--c": colorOf[tech.category] } as CSSProperties}>
              <div className="universe-panel-head">
                <p className="eyebrow">
                  <i aria-hidden="true" />
                  {tx(
                    categories.find((c) => c.key === tech.category).label,
                    lang,
                  )}
                </p>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => {
                    nodeRefs.current.get(tech.name)?.focus();
                    select(null);
                  }}
                  aria-label={fr ? "Fermer la fiche" : "Close the card"}
                >
                  <X size={18} />
                </button>
              </div>
              <h3>{tech.name}</h3>
              <p className="universe-count">
                <strong>{tech.works.length}</strong>{" "}
                {words(lang, tech.works.length)}
                {pro.length > 0 && academic.length > 0 && (
                  <span>
                    {" "}
                    · {pro.length} {fr ? "pro" : "professional"} ·{" "}
                    {academic.length} {fr ? "formation" : "coursework"}
                  </span>
                )}
              </p>
              {pro.length > 0 && (
                <>
                  <p className="eyebrow universe-group">
                    {fr ? "Projets professionnels" : "Professional work"}
                  </p>
                  <ul className="universe-works">
                    {pro.map((w) => (
                      <li key={w.title}>
                        {w.title}
                        {w.via && <span> · {w.via}</span>}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {academic.length > 0 && (
                <>
                  <p className="eyebrow universe-group">
                    {fr ? "Projets de formation" : "Coursework"}
                  </p>
                  <ul className="universe-works">
                    {academic.map((w) => (
                      <li key={w.title}>{w.title}</li>
                    ))}
                  </ul>
                </>
              )}
              {companions.length > 0 && (
                <>
                  <p className="eyebrow universe-group">
                    {fr ? "Souvent utilisé avec" : "Often used with"}
                  </p>
                  <div className="universe-companions">
                    {companions.map(([name, weight]) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => select(name)}
                      >
                        {name}
                        <span>×{weight}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="universe-overview">
              <p className="eyebrow">{fr ? "Vue d’ensemble" : "Overview"}</p>
              <p className="universe-hint">
                {fr
                  ? "Chaque étoile est une technologie, sa taille le nombre de projets qui l’utilisent. Sélectionnez-en une pour voir où et avec quoi."
                  : "Each star is a technology, sized by the number of projects using it. Select one to see where, and with what."}
              </p>
              <p className="eyebrow universe-group universe-families-title">
                {fr ? "Familles" : "Families"}
              </p>
              <ul className="universe-families">
                {clusters.map((c) => (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={() => chooseFamily(c.key)}
                      style={{ "--c": c.color } as CSSProperties}
                    >
                      <i aria-hidden="true" />
                      {tx(c.label, lang)}
                      <span>{c.nodes.length}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="eyebrow universe-group">
                {fr ? "Les plus utilisées" : "Most used"}
              </p>
              <div className="universe-companions">
                {universe.techs.slice(0, 8).map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => select(t.name)}
                  >
                    {t.name}
                    <span>×{t.works.length}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </Modal>
  );
}
