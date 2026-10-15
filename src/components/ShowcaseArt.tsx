import { useId, type CSSProperties, type ReactNode } from "react";
import { brandMarks } from "@/data/brandMarks";

/**
 * Illustrations des études de cas. Un même plateau pour les trois projets :
 * une fenêtre desktop simple (même taille, même place) et, devant son bord
 * droit, le second plan propre à chaque projet — le téléphone pour BB et
 * Konecta, le bulletin généré pour Levitation.
 *
 * - BB : page blanche, logo centré qui respire et qu'un reflet traverse.
 * - Levitation et Konecta : les compositions d'origine (tableau de notes,
 *   bulletin, notification SMS ; carte d'itinéraire, heure d'arrivée, app
 *   chauffeur), dessinées pour une boîte 640×440 et posées telles quelles
 *   dans les écrans, à l'échelle (`Fit`). Sur la carte Konecta, une navette
 *   parcourt l'itinéraire et allume chaque arrêt à son passage.
 *
 * Plans pour la parallaxe d'entrée (index.css) : le halo au fond
 * (`layer-back`), la fenêtre (`layer-mid`), le second plan (`layer-front`).
 */

/* Identifiant sûr pour url(#…) : useId() de React 18 contient des « : ». */
const useSvgId = () => useId().replace(/:/g, "");

type Box = { x: number; y: number; w: number; h: number };

/* ── Appareils ─────────────────────────────────────────────────────────── */

/* Zone visible du dessin : viewBox 0 20 640 352. Les appareils y occupent
   environ les trois quarts de la largeur et laissent de l'air autour — un
   cadre qui envahissait le panneau (le MacBook) a été écarté. */

/* Fenêtre desktop : barre de titre (trois points, barre d'adresse) et écran
   16:10 au-dessous. Même taille et même place pour les trois projets. */
const WIN = { x: 76, y: 52, w: 400, bar: 20 } as const;
const DESK: Box = { x: WIN.x, y: WIN.y + WIN.bar, w: WIN.w, h: 250 };

/* Rectangle dont seuls les coins du bas sont arrondis : l'écran, sous la
   barre de titre. */
const bottomRounded = ({ x, y, w, h }: Box, r: number) =>
  `M${x} ${y} h${w} v${h - r} a${r} ${r} 0 0 1 -${r} ${r} h-${w - 2 * r} a${r} ${r} 0 0 1 -${r} -${r} Z`;

function Desktop({ id, children }: { id: string; children: ReactNode }) {
  const { x, y, w, bar } = WIN;
  return (
    <>
      <clipPath id={`${id}-desk`}>
        <path d={bottomRounded(DESK, 9)} />
      </clipPath>
      <rect
        className="win"
        x={x}
        y={y}
        width={w}
        height={bar + DESK.h}
        rx="10"
      />
      {[12, 22, 32].map((dx) => (
        <circle
          key={dx}
          className="win-dot"
          cx={x + dx}
          cy={y + bar / 2}
          r="2.8"
        />
      ))}
      <rect
        className="win-url"
        x={x + w / 2 - 60}
        y={y + 5}
        width="120"
        height="10"
        rx="5"
      />
      <g clipPath={`url(#${id}-desk)`}>{children}</g>
    </>
  );
}

/* Le second plan se pose devant le bord droit de la fenêtre et descend un
   peu sous elle : c'est ce décalage qui donne la profondeur. */
const FRONT = { right: 564, bottom: 338 } as const;

/* Téléphone. Îlot dynamique et barre d'accueil teintés selon l'écran
   (`tone`), reflet sur la vitre. */
const PHONE: Box = {
  x: FRONT.right - 108,
  y: FRONT.bottom - 220,
  w: 108,
  h: 220,
};
const phoneScreen: Box = {
  x: PHONE.x + 5,
  y: PHONE.y + 5,
  w: PHONE.w - 10,
  h: PHONE.h - 10,
};

function Glare({ id, s }: { id: string; s: Box }) {
  return (
    <path
      d={`M${s.x} ${s.y} h${s.w * 0.62} L${s.x} ${s.y + s.h * 0.78} Z`}
      fill={`url(#${id}-glare)`}
    />
  );
}

function Phone({
  id,
  tone,
  children,
}: {
  id: string;
  tone: "light" | "dark";
  children: ReactNode;
}) {
  const { x, y, w, h } = PHONE;
  const s = phoneScreen;
  const cx = x + w / 2;
  return (
    <>
      {/* Boutons latéraux */}
      <rect
        className="key"
        x={x - 1.5}
        y={y + 48}
        width="2.2"
        height="14"
        rx="1"
      />
      <rect
        className="key"
        x={x - 1.5}
        y={y + 68}
        width="2.2"
        height="26"
        rx="1"
      />
      <rect
        className="key"
        x={x + w - 0.7}
        y={y + 60}
        width="2.2"
        height="32"
        rx="1"
      />
      <clipPath id={`${id}-mob`}>
        <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="15" />
      </clipPath>
      <rect className="frame" x={x} y={y} width={w} height={h} rx="20" />
      <g clipPath={`url(#${id}-mob)`}>
        {children}
        <Glare id={id} s={s} />
      </g>
      <rect
        className="island"
        x={cx - 13}
        y={s.y + 5}
        width="26"
        height="7.5"
        rx="3.75"
      />
      <rect
        className={`ui-${tone}`}
        x={cx - 17}
        y={y + h - 11}
        width="34"
        height="2.4"
        rx="1.2"
      />
    </>
  );
}

/* Dégradés partagés : reflet de la vitre du téléphone, halo d'accent derrière
   les appareils (sa couleur vient du thème, voir `glow-*` en CSS). */
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-glare`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.08" />
        {/* Nul dès la diagonale : pas d'arête visible au bord du reflet. */}
        <stop offset="0.48" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}-glow`}>
        <stop className="glow-a" offset="0" />
        <stop className="glow-b" offset="1" />
      </radialGradient>
    </defs>
  );
}

function Stage({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg viewBox="0 20 640 352" className="showcase-svg" aria-hidden="true">
      <Defs id={id} />
      <g className="layer layer-back">
        <ellipse
          cx="320"
          cy="196"
          rx="300"
          ry="170"
          fill={`url(#${id}-glow)`}
        />
      </g>
      {children}
    </svg>
  );
}

/* ── BeautyBay : page blanche, logo au centre, un reflet qui le traverse ── */

/**
 * Le logo BB, dessiné directement : les masques de src/assets/logos ont leurs
 * pixels opaques noirs, donc l'`<image>` est déjà le logo encre sur la page
 * blanche — sans `<mask>` SVG, qui re-rasterise son groupe à chaque frame
 * animée (~17 fps sous CPU ×4, contre ~54 sans). Le reflet est une bande
 * blanche clippée à la boîte du logo : blanc sur la page blanche il est
 * invisible, il n'éclaire que l'encre du logo — sans `mix-blend-mode`, qui
 * forçait à recomposer tout le dessin à chaque frame.
 */
function BBLogo({
  id,
  cx,
  cy,
  w,
  sheen,
}: {
  id: string;
  cx: number;
  cy: number;
  w: number;
  sheen: string;
}) {
  const h = w / 3;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return (
    <g className="logo-breathe">
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <image
          href={brandMarks["BeautyBay – Web & Mobile"]}
          x={x}
          y={y}
          width={w}
          height={h}
        />
        <rect
          className="bb-sheen"
          x={x}
          y={y}
          width={w * 0.45}
          height={h}
          fill={sheen}
        />
      </g>
    </g>
  );
}

function BeautyArt() {
  const id = useSvgId();
  const d = DESK;
  const m = phoneScreen;
  const sheen = `url(#${id}-sheen)`;
  return (
    <Stage id={id}>
      <defs>
        <linearGradient id={`${id}-sheen`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="layer layer-mid">
        <Desktop id={id}>
          <rect className="bb-page" x={d.x} y={d.y} width={d.w} height={d.h} />
          <BBLogo
            id={`${id}-bb-d`}
            cx={d.x + d.w / 2}
            cy={d.y + d.h / 2}
            w={135}
            sheen={sheen}
          />
        </Desktop>
      </g>
      <g className="layer layer-front">
        <Phone id={id} tone="light">
          <rect className="bb-page" x={m.x} y={m.y} width={m.w} height={m.h} />
          <BBLogo
            id={`${id}-bb-m`}
            cx={m.x + m.w / 2}
            cy={m.y + m.h / 2}
            w={80}
            sheen={sheen}
          />
        </Phone>
      </g>
    </Stage>
  );
}

/* ── Compositions d'origine, posées dans les écrans ─────────────────────── */

/**
 * Pose un dessin de la composition d'origine (boîte 640×440) dans un écran :
 * `from` est la zone du dessin à montrer, mise à l'échelle uniforme pour tenir
 * dans `to` et centrée. Le fond de l'écran est peint à part, plein cadre.
 */
function Fit({
  from,
  to,
  children,
}: {
  from: Box;
  to: Box;
  children: ReactNode;
}) {
  const k = Math.min(to.w / from.w, to.h / from.h);
  const x = to.x + (to.w - from.w * k) / 2 - from.x * k;
  const y = to.y + (to.h - from.h * k) / 2 - from.y * k;
  return <g transform={`translate(${x} ${y}) scale(${k})`}>{children}</g>;
}

/* Zone d'un dessin d'origine aux proportions de l'écran desktop (16:10) :
   même largeur que la fenêtre d'origine, hauteur recadrée à partir de `top`. */
const deskArea = (x: number, top: number, w: number): Box => ({
  x,
  y: top,
  w,
  h: (w * DESK.h) / DESK.w,
});

/**
 * Le vrai logo du client, incrusté là où il vit dans le produit (l'en-tête de
 * l'app chauffeur). Les masques de src/assets/logos portent la forme dans leur
 * canal alpha : `mask-type: alpha` la découpe dans un aplat coloré. Statique —
 * un `<mask>` animé coûte cher, voir BBLogo.
 */
function Logo({
  id,
  href,
  x,
  y,
  w,
  className = "tx-strong",
}: {
  id: string;
  href: string;
  x: number;
  y: number;
  w: number;
  className?: string;
}) {
  const h = w / 3; // boîte commune 3:1 des masques
  return (
    <>
      <mask
        id={id}
        maskUnits="userSpaceOnUse"
        x={x}
        y={y}
        width={w}
        height={h}
        style={{ maskType: "alpha" }}
      >
        <image href={href} x={x} y={y} width={w} height={h} />
      </mask>
      <rect
        className={className}
        x={x}
        y={y}
        width={w}
        height={h}
        mask={`url(#${id})`}
      />
    </>
  );
}

const Bar = ({
  x,
  y,
  w,
  h = 6,
  className = "tx",
  style,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  className?: string;
  style?: CSSProperties;
}) => (
  <rect
    className={className}
    x={x}
    y={y}
    width={w}
    height={h}
    rx={h / 2}
    style={style}
  />
);

/* Fond d'un écran sombre : la teinte du panneau, voilée comme les fenêtres
   des compositions d'origine. */
const Ground = ({ s, base = "ink" }: { s: Box; base?: string }) => (
  <>
    <rect className={base} x={s.x} y={s.y} width={s.w} height={s.h} />
    <rect className="s1" x={s.x} y={s.y} width={s.w} height={s.h} />
  </>
);

/* ── Levitation : tableau de notes, bulletin généré, notification SMS ── */

/* Le flux clé de la plateforme, en un cycle de 9 s : les notes se saisissent
   rangée par rangée, le bulletin se remplit puis se valide, et le workflow
   n8n envoie le SMS ; tout tient ~3 s puis s'efface ensemble, et le cycle
   reprend. Chaque étape a son instant d'entrée (fraction du cycle) et sa
   façon d'entrer. Comme toutes sortent au même moment, chacune a ses propres
   keyframes, générées ici : de simples délais par élément décaleraient les
   sorties d'une boucle à l'autre. Une horloge commune en propriété CSS animée
   (`@property`) a été essayée : elle recalcule les styles à chaque frame et
   faisait tomber le panneau à ~33 fps sous CPU ×4. */
type StepKind = "grow" | "rise" | "pop";
const LV_STEPS: Record<string, [at: number, kind: StepKind]> = {
  "row-0": [0.03, "grow"],
  "row-1": [0.08, "grow"],
  "row-2": [0.13, "grow"],
  "row-3": [0.18, "grow"],
  "val-0": [0.26, "grow"],
  "val-1": [0.295, "grow"],
  "val-2": [0.33, "grow"],
  "val-3": [0.365, "grow"],
  "val-4": [0.4, "grow"],
  check: [0.46, "pop"],
  sms: [0.55, "rise"],
};
const LV_OUT = 0.86; // tout commence à s'effacer ici
const STEP_FROM: Record<StepKind, string> = {
  grow: "scaleX(0)", // une valeur qui se saisit, depuis la gauche
  rise: "translateY(6px)",
  pop: "scale(0.4)", // la validation
};
const pct = (f: number) => `${+(f * 100).toFixed(2)}%`;
const LV_KEYFRAMES = Object.entries(LV_STEPS)
  .map(
    ([key, [start, kind]]) =>
      `@keyframes lv-${key}{0%,${pct(start)}{opacity:0;transform:${STEP_FROM[kind]}}` +
      `${pct(start + 0.07)},${pct(LV_OUT)}{opacity:1;transform:none}` +
      `${pct(LV_OUT + 0.06)},100%{opacity:0;transform:none}}`,
  )
  .join("");
const lv = (key: keyof typeof LV_STEPS) =>
  ({ animationName: `lv-${key}` }) as CSSProperties;

/* Le tableau de bord de l'établissement (fenêtre d'origine 24,36 → 492,380).
   Quatre élèves au lieu de cinq : l'écran 16:10 est plus bas que la fenêtre. */
function EduDashboard() {
  const rows = [198, 230, 262, 294];
  return (
    <>
      <rect className="s2" x="36" y="48" width="72" height="320" rx="10" />
      <circle className="ac" cx="54" cy="68" r="7" />
      {[100, 124, 148, 172, 196].map((y, i) => (
        <Bar
          key={y}
          x={48}
          y={y}
          w={i === 1 ? 50 : 40}
          h={7}
          className={i === 1 ? "ac" : "tx2"}
        />
      ))}
      <rect className="s2 st" x="124" y="50" width="134" height="28" rx="14" />
      <Bar x={140} y={61} w={74} h={6} />
      <path className="st" d="M232 60 l6 6 l6 -6" fill="none" />
      <Bar x={124} y={100} w={150} h={11} className="tx-strong" />
      <Bar x={124} y={120} w={96} h={6} className="tx2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          className={i === 4 ? "hi" : "ac"}
          x={382 + i * 18}
          y={150 - [26, 38, 30, 46, 54][i]}
          width="12"
          height={[26, 38, 30, 46, 54][i]}
          rx="3"
        />
      ))}
      <line className="st" x1="124" y1="170" x2="478" y2="170" />
      <Bar x={160} y={178} w={60} h={5} className="tx2" />
      {[300, 348, 396].map((x) => (
        <Bar key={x} x={x} y={178} w={30} h={5} className="tx2" />
      ))}
      {rows.map((y, r) => (
        <g key={y}>
          <circle className="s2 st" cx="140" cy={y + 12} r="9" />
          <Bar x={160} y={y + 9} w={[88, 72, 96, 64][r]} h={7} />
          {[300, 348, 396].map((x) => (
            <rect
              key={x}
              className="s2"
              x={x}
              y={y + 4}
              width="38"
              height="17"
              rx="8.5"
            />
          ))}
          {/* Les notes de l'élève, saisies de gauche à droite. */}
          <g className="lv-step lv-grow" style={lv(`row-${r}`)}>
            {[300, 348, 396].map((x, c) => (
              <Bar
                key={x}
                x={x + 9}
                y={y + 10}
                w={[20, 14, 18, 16][(r + c) % 4]}
                h={5}
              />
            ))}
          </g>
          <rect
            className={r === 2 ? "hi" : "ac-soft"}
            x="444"
            y={y + 4}
            width="34"
            height="17"
            rx="8.5"
          />
          <line className="st" x1="124" y1={y + 28} x2="478" y2={y + 28} />
        </g>
      ))}
    </>
  );
}

/* Le bulletin généré (carte d'origine 404,160 → 604,412). */
function ReportCard() {
  return (
    <>
      <rect
        className="chip st"
        x="404"
        y="160"
        width="200"
        height="252"
        rx="16"
      />
      <Bar x={424} y={184} w={92} h={9} className="tx-strong" />
      <Bar x={424} y={200} w={58} h={5} className="tx2" />
      <g className="lv-step" style={lv("check")}>
        <circle className="hi" cx="578" cy="190" r="12" />
        <path className="ink-st" d="M572 190 l4 4 l8 -9" fill="none" />
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <Bar
            x={424}
            y={226 + i * 22}
            w={[78, 64, 86, 70, 58][i]}
            h={6}
            className="tx2"
          />
          <Bar
            x={560}
            y={226 + i * 22}
            w={22}
            h={6}
            className="tx lv-step lv-grow"
            style={lv(`val-${i}`)}
          />
        </g>
      ))}
      <rect className="ac" x="424" y="344" width="160" height="48" rx="12" />
      <Bar x={440} y={356} w={60} h={6} className="ink" />
      <Bar x={440} y={372} w={36} h={10} className="ink" />
    </>
  );
}

/* L'automatisation n8n (bandeau d'origine 300,8 → 596,62). */
function SmsToast() {
  return (
    <g className="lv-step" style={lv("sms")}>
      <rect
        className="chip ac-st"
        x="300"
        y="8"
        width="296"
        height="54"
        rx="27"
      />
      <circle className="hi" cx="327" cy="35" r="14" />
      <path className="ink-st" d="M320 35 l5 5 l9 -10" fill="none" />
      <text className="a-sans a-strong" x="352" y="32">
        Bulletin envoyé par SMS
      </text>
      <text className="a-mono a-faint" x="352" y="49">
        workflow n8n · il y a 2 min
      </text>
    </g>
  );
}

/* Le bulletin prend la place du téléphone de BB et Konecta (même bord droit,
   même pied) ; la notification SMS s'accroche en haut à droite de la
   fenêtre. Échelles choisies pour garder le même encombrement. */
const CARD_SCALE = 0.62;
const TOAST_SCALE = 0.7;
const place = (k: number, x: number, y: number, ox: number, oy: number) =>
  `translate(${x - ox * k} ${y - oy * k}) scale(${k})`;

function EduArt() {
  const id = useSvgId();
  const d = DESK;
  return (
    <Stage id={id}>
      <style>{LV_KEYFRAMES}</style>
      <g className="layer layer-mid">
        <Desktop id={id}>
          <Ground s={d} />
          <Fit from={deskArea(24, 40, 468)} to={d}>
            <EduDashboard />
          </Fit>
        </Desktop>
      </g>
      <g className="layer layer-front">
        <g
          transform={place(
            CARD_SCALE,
            FRONT.right - 200 * CARD_SCALE,
            FRONT.bottom - 252 * CARD_SCALE,
            404,
            160,
          )}
        >
          <ReportCard />
        </g>
        <g
          transform={place(
            TOAST_SCALE,
            FRONT.right - 296 * TOAST_SCALE,
            WIN.y - 16,
            300,
            8,
          )}
        >
          <SmsToast />
        </g>
      </g>
    </Stage>
  );
}

/* ── Konecta : carte d'itinéraire, heure d'arrivée, app chauffeur ── */

type Pt = [number, number];

/* L'itinéraire optimisé de la carte d'origine, et ses arrêts. */
const ROUTE: Pt[] = [
  [60, 350],
  [164, 350],
  [164, 240],
  [324, 240],
  [324, 100],
  [440, 100],
];
const routeD = `M${ROUTE.map((p) => p.join(" ")).join(" L")}`;

/* Fraction (0–1) de l'itinéraire parcourue en arrivant au point `p` : cale
   l'allumage de chaque arrêt sur le passage de la navette (vitesse
   constante). */
function fractionAt([px, py]: Pt): number {
  const seg = ROUTE.slice(1).map((b, i) =>
    Math.hypot(b[0] - ROUTE[i][0], b[1] - ROUTE[i][1]),
  );
  const total = seg.reduce((a, b) => a + b, 0);
  let done = 0;
  for (let i = 0; i < seg.length; i++) {
    const [a, b] = [ROUTE[i], ROUTE[i + 1]];
    const onX = Math.min(a[0], b[0]) <= px && px <= Math.max(a[0], b[0]);
    const onY = Math.min(a[1], b[1]) <= py && py <= Math.max(a[1], b[1]);
    if (onX && onY) return (done + Math.hypot(px - a[0], py - a[1])) / total;
    done += seg[i];
  }
  return 1;
}

/* La navette roule à vitesse constante : ses keyframes sont les sommets de
   l'itinéraire, chacun à sa fraction du trajet. Trajet sur 80 % du cycle de
   7 s, puis elle s'efface au terminus et réapparaît au départ. C'est un point
   déplacé en `translate` : animer le pointillé d'un tracé (première version)
   repeignait toute la carte à chaque frame. Les arrêts s'allument au même
   rythme (`kn-stop`, index.css). */
const KN_TRAVEL = 0.8;
const KN_BUS_KEYFRAMES = (() => {
  const [x0, y0] = ROUTE[0];
  const to = ([x, y]: Pt) => `transform:translate(${x - x0}px,${y - y0}px)`;
  const end = ROUTE[ROUTE.length - 1];
  const vertices = ROUTE.slice(1, -1)
    .map((p) => `${pct(fractionAt(p) * KN_TRAVEL)}{${to(p)}}`)
    .join("");
  return (
    `@keyframes kn-bus{0%{${to(ROUTE[0])};opacity:0}6%{opacity:1}${vertices}` +
    `${pct(KN_TRAVEL)}{${to(end)};opacity:1}92%,100%{${to(end)};opacity:0}}`
  );
})();

/* La carte et le tracé optimisé (fenêtre d'origine 24,40 → 484,384). */
function RouteMap() {
  return (
    <>
      {[84, 164, 244, 324, 404].map((x) => (
        <line key={x} className="st street" x1={x} y1="40" x2={x} y2="384" />
      ))}
      {[100, 170, 240, 310].map((y) => (
        <line key={y} className="st street" x1="24" y1={y} x2="484" y2={y} />
      ))}
      <path className="st street" d="M24 350 L300 40" />
      {[
        [92, 108, 64, 54],
        [252, 178, 64, 54],
        [332, 248, 64, 54],
        [172, 318, 64, 54],
        [412, 178, 64, 54],
      ].map(([x, y, w, h]) => (
        <rect
          key={`${x}-${y}`}
          className="s2"
          x={x}
          y={y}
          width={w}
          height={h}
          rx="6"
        />
      ))}
      <rect className="ac-soft" x="332" y="108" width="64" height="54" rx="6" />
      {/* Se trace au défilement (`route`, index.css). */}
      <path className="route" d={routeD} fill="none" pathLength={1} />
      {(
        [
          [164, 240, 7],
          [324, 170, 7],
          [440, 100, 9],
        ] as const
      ).map(([cx, cy, r]) => (
        <circle
          key={`${cx}-${cy}`}
          className="stop kn-stop"
          cx={cx}
          cy={cy}
          r={r}
          style={{ "--at": fractionAt([cx, cy]) } as CSSProperties}
        />
      ))}
      <circle className="stop stop-start" cx="60" cy="350" r="8" />
      <rect className="hi" x="232" y="231" width="26" height="18" rx="6" />
      <path className="ink-st" d="M240 240 h10 m-4 -4 l4 4 l-4 4" fill="none" />
      {/* La navette, posée au départ (état sans animation). */}
      <g className="kn-bus">
        <circle
          className="kn-bus-ring"
          cx={ROUTE[0][0]}
          cy={ROUTE[0][1]}
          r="7.5"
        />
        <circle
          className="kn-bus-dot"
          cx={ROUTE[0][0]}
          cy={ROUTE[0][1]}
          r="4"
        />
      </g>
      {/* L'heure d'arrivée en temps réel. */}
      <rect
        className="chip st"
        x="210"
        y="182"
        width="164"
        height="38"
        rx="19"
      />
      <circle className="hi" cx="232" cy="201" r="6" />
      <text className="a-sans a-strong" x="246" y="205">
        Navette 07 · 12 min
      </text>
    </>
  );
}

/* L'application chauffeur (écran d'origine 472,94 → 608,404), logo réel
   dans l'en-tête. */
function DriverApp({ id }: { id: string }) {
  return (
    <>
      <Logo
        id={`${id}-logo`}
        href={brandMarks["Transport Interne Konecta"]}
        x={482}
        y={116}
        w={66}
      />
      <Bar x={484} y={142} w={100} h={8} className="tx-strong" />
      <rect className="s2" x="484" y="160" width="112" height="84" rx="12" />
      <path
        className="route route-mini"
        d="M496 230 L530 230 L530 196 L582 196 L582 172"
        fill="none"
      />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle
            className={i === 0 ? "hi" : "st"}
            cx="492"
            cy={268 + i * 30}
            r="6"
          />
          <Bar x={506} y={265 + i * 30} w={[74, 58, 66][i]} h={6} />
        </g>
      ))}
      <rect className="hi" x="484" y="358" width="112" height="34" rx="17" />
      <Bar x={512} y={372} w={56} h={6} className="ink" />
    </>
  );
}

function KonectaArt() {
  const id = useSvgId();
  const d = DESK;
  const m = phoneScreen;
  return (
    <Stage id={id}>
      <style>{KN_BUS_KEYFRAMES}</style>
      <g className="layer layer-mid">
        <Desktop id={id}>
          <Ground s={d} />
          <Fit from={deskArea(24, 81, 460)} to={d}>
            <RouteMap />
          </Fit>
        </Desktop>
      </g>
      <g className="layer layer-front">
        <Phone id={id} tone="dark">
          <Ground s={m} base="phone" />
          <Fit from={{ x: 472, y: 94, w: 136, h: 310 }} to={m}>
            <DriverApp id={id} />
          </Fit>
        </Phone>
      </g>
    </Stage>
  );
}

export default function ShowcaseArt({ kind }: { kind: string }) {
  if (kind === "beauty") return <BeautyArt />;
  if (kind === "edu") return <EduArt />;
  return <KonectaArt />;
}
