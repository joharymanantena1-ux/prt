import { useId } from "react";
import { brandMarks } from "@/data/brandMarks";

/**
 * Illustrations des études de cas : des interfaces abstraites, pas des captures.
 * Elles évoquent le métier de chaque projet (vitrine produit + mobile, tableau
 * de notes + bulletin, carte d'itinéraire + app chauffeur) sans rien montrer de
 * confidentiel ni laisser croire à une capture d'écran réelle.
 *
 * Chaque composition est découpée en trois plans (`layer-back`, `layer-mid`,
 * `layer-front`) : le CSS les fait monter à des vitesses différentes quand le
 * panneau entre à l'écran, d'où l'effet de profondeur. Les couleurs viennent des
 * variables `--art-*` du panneau — le dessin ne connaît aucune teinte en dur.
 */

/* Identifiant sûr pour url(#…) : useId() de React 18 contient des « : ». */
const useSvgId = () => useId().replace(/:/g, "");

/**
 * Le vrai logo du client, incrusté là où il vit dans le produit (en-tête de la
 * boutique, de l'app). Les masques de src/assets/logos portent la forme dans
 * leur canal alpha : `mask-type: alpha` la découpe dans un aplat coloré.
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
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  className?: string;
}) => (
  <rect className={className} x={x} y={y} width={w} height={h} rx={h / 2} />
);

/* Silhouettes de cosmétiques : flacon, pot, tube, poudrier. */
function Product({ kind, cx, cy }: { kind: number; cx: number; cy: number }) {
  if (kind === 0)
    return (
      <g className="product">
        <rect x={cx - 11} y={cy - 16} width={22} height={34} rx={6} />
        <rect x={cx - 6} y={cy - 25} width={12} height={10} rx={2} />
      </g>
    );
  if (kind === 1)
    return (
      <g className="product">
        <rect x={cx - 19} y={cy - 6} width={38} height={22} rx={7} />
        <rect x={cx - 17} y={cy - 14} width={34} height={9} rx={3} />
      </g>
    );
  if (kind === 2)
    return (
      <g className="product">
        <rect x={cx - 6} y={cy - 24} width={12} height={34} rx={4} />
        <rect x={cx - 8} y={cy + 8} width={16} height={12} rx={2} />
      </g>
    );
  return (
    <g className="product">
      <circle cx={cx} cy={cy} r={17} />
      <circle className="product-cut" cx={cx} cy={cy} r={9} />
    </g>
  );
}

function BeautyArt() {
  const id = useSvgId();
  const logo = brandMarks["BeautyBay – Web & Mobile"];
  const cards = [48, 149, 250, 351];
  return (
    <svg viewBox="0 0 640 440" className="showcase-svg" aria-hidden="true">
      {/* Plan arrière — la boutique web */}
      <g className="layer layer-back">
        <rect
          className="s1 st"
          x="24"
          y="40"
          width="440"
          height="316"
          rx="14"
        />
        <circle className="tx2" cx="46" cy="58" r="4" />
        <circle className="tx2" cx="61" cy="58" r="4" />
        <circle className="tx2" cx="76" cy="58" r="4" />
        <rect className="s2" x="104" y="49" width="190" height="18" rx="9" />
        <line className="st" x1="24" y1="76" x2="464" y2="76" />
        <Logo id={`${id}-logo`} href={logo} x={40} y={86} w={72} />
        {[300, 340, 380].map((x) => (
          <Bar key={x} x={x} y={96} w={30} h={5} className="tx2" />
        ))}
        <circle className="st" cx="436" cy="98" r="7" />
        <rect
          className="ac-soft"
          x="48"
          y="116"
          width="392"
          height="66"
          rx="10"
        />
        <Bar x={66} y={136} w={148} h={10} className="tx-strong" />
        <Bar x={66} y={155} w={92} h={6} className="tx" />
        {cards.map((x, i) => (
          <g key={x}>
            <rect
              className="s1 st"
              x={x}
              y="196"
              width="88"
              height="132"
              rx="10"
            />
            <rect
              className="s2"
              x={x + 8}
              y="204"
              width="72"
              height="62"
              rx="7"
            />
            <Product kind={i} cx={x + 44} cy={236} />
            <Bar x={x + 10} y={276} w={56} />
            <Bar x={x + 10} y={290} w={36} h={5} className="tx2" />
            <Bar x={x + 10} y={306} w={26} h={7} className="tx-strong" />
          </g>
        ))}
      </g>

      {/* Plan médian — l'app mobile, mêmes composants */}
      <g className="layer layer-mid">
        <rect
          className="phone st"
          x="452"
          y="84"
          width="164"
          height="330"
          rx="28"
        />
        <rect className="s1" x="462" y="94" width="144" height="310" rx="20" />
        <rect className="tx2" x="514" y="102" width="40" height="8" rx="4" />
        <rect
          className="ac-soft"
          x="474"
          y="122"
          width="120"
          height="118"
          rx="14"
        />
        <Product kind={0} cx={534} cy={186} />
        <Bar x={474} y={256} w={96} h={8} className="tx-strong" />
        <Bar x={474} y={272} w={62} h={6} className="tx2" />
        <Bar x={474} y={292} w={38} h={9} />
        {[480, 498, 516].map((cx, i) => (
          <circle
            key={cx}
            className={i === 0 ? "hi" : "ac"}
            cx={cx}
            cy={322}
            r={7}
          />
        ))}
        <rect className="hi" x="474" y="348" width="120" height="36" rx="18" />
        <Bar x={502} y={363} w={64} h={6} className="ink" />
      </g>

      {/* Plan avant — l'API partagée entre les deux */}
      <g className="layer layer-front">
        <path
          className="ac-st dashed"
          d="M446 104 C 470 104, 480 110, 492 124"
          fill="none"
        />
        <path
          className="ac-st dashed"
          d="M372 104 C 340 130, 320 160, 300 196"
          fill="none"
        />
        <rect
          className="chip ac-st"
          x="338"
          y="56"
          width="164"
          height="50"
          rx="14"
        />
        <circle className="ac-st" cx="362" cy="81" r="9" fill="none" />
        <circle className="ac" cx="362" cy="81" r="3" />
        <text className="a-mono a-strong" x="380" y="78">
          GraphQL
        </text>
        <text className="a-mono a-faint" x="380" y="94">
          web · mobile
        </text>
      </g>
    </svg>
  );
}

function EduArt() {
  const rows = [198, 230, 262, 294, 326];
  return (
    <svg viewBox="0 0 640 440" className="showcase-svg" aria-hidden="true">
      {/* Plan arrière — le tableau de bord de l'établissement */}
      <g className="layer layer-back">
        <rect
          className="s1 st"
          x="24"
          y="36"
          width="468"
          height="344"
          rx="14"
        />
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
        <rect
          className="s2 st"
          x="124"
          y="50"
          width="134"
          height="28"
          rx="14"
        />
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
            <Bar x={160} y={y + 9} w={[88, 72, 96, 64, 80][r]} h={7} />
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
      </g>

      {/* Plan médian — le bulletin généré */}
      <g className="layer layer-mid">
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
        <circle className="hi" cx="578" cy="190" r="12" />
        <path className="ink-st" d="M572 190 l4 4 l8 -9" fill="none" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <Bar
              x={424}
              y={226 + i * 22}
              w={[78, 64, 86, 70, 58][i]}
              h={6}
              className="tx2"
            />
            <Bar x={560} y={226 + i * 22} w={22} h={6} />
          </g>
        ))}
        <rect className="ac" x="424" y="344" width="160" height="48" rx="12" />
        <Bar x={440} y={356} w={60} h={6} className="ink" />
        <Bar x={440} y={372} w={36} h={10} className="ink" />
      </g>

      {/* Plan avant — l'automatisation (n8n) */}
      <g className="layer layer-front">
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
    </svg>
  );
}

function KonectaArt() {
  const id = useSvgId();
  const logo = brandMarks["Transport Interne Konecta"];
  return (
    <svg viewBox="0 0 640 440" className="showcase-svg" aria-hidden="true">
      <defs>
        <clipPath id={`${id}-map`}>
          <rect x="24" y="40" width="460" height="344" rx="14" />
        </clipPath>
      </defs>

      {/* Plan arrière — la carte et le tracé optimisé */}
      <g className="layer layer-back">
        <rect
          className="s1 st"
          x="24"
          y="40"
          width="460"
          height="344"
          rx="14"
        />
        <g clipPath={`url(#${id}-map)`}>
          {[84, 164, 244, 324, 404].map((x) => (
            <line
              key={x}
              className="st street"
              x1={x}
              y1="40"
              x2={x}
              y2="384"
            />
          ))}
          {[100, 170, 240, 310].map((y) => (
            <line
              key={y}
              className="st street"
              x1="24"
              y1={y}
              x2="484"
              y2={y}
            />
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
          <rect
            className="ac-soft"
            x="332"
            y="108"
            width="64"
            height="54"
            rx="6"
          />
          <path
            className="route"
            d="M60 350 L164 350 L164 240 L324 240 L324 100 L440 100"
            fill="none"
            pathLength={1}
          />
          {[
            [164, 240],
            [324, 170],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              className="stop"
              cx={cx}
              cy={cy}
              r="7"
            />
          ))}
          <circle className="stop stop-start" cx="60" cy="350" r="8" />
          <circle className="stop stop-end" cx="440" cy="100" r="9" />
          <rect className="hi" x="232" y="231" width="26" height="18" rx="6" />
          <path
            className="ink-st"
            d="M240 240 h10 m-4 -4 l4 4 l-4 4"
            fill="none"
          />
        </g>
      </g>

      {/* Plan médian — l'heure d'arrivée en temps réel */}
      <g className="layer layer-mid">
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
      </g>

      {/* Plan avant — l'application chauffeur */}
      <g className="layer layer-front">
        <rect
          className="phone st"
          x="462"
          y="84"
          width="156"
          height="330"
          rx="28"
        />
        <rect className="s1" x="472" y="94" width="136" height="310" rx="20" />
        <rect className="tx2" x="520" y="102" width="40" height="8" rx="4" />
        <Logo id={`${id}-logo`} href={logo} x={482} y={116} w={66} />
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
      </g>
    </svg>
  );
}

export default function ShowcaseArt({ kind }: { kind: string }) {
  if (kind === "beauty") return <BeautyArt />;
  if (kind === "edu") return <EduArt />;
  return <KonectaArt />;
}
