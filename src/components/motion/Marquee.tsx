import { useReducedMotion } from "framer-motion";

/**
 * Infinite horizontal ticker. Renders the items twice and translates -50% in a
 * seamless CSS loop, so the strip scrolls forever without JS per-frame work.
 *
 * Perf/UX:
 *  - Pure CSS `transform: translateX` animation (GPU) — see `marquee` keyframe.
 *  - Edges faded with a mask so items appear/disappear softly.
 *  - Under `prefers-reduced-motion` the animation is paused (static row).
 *
 * Usage:  <Marquee items={["React", "Node.js", …]} />
 */
export const Marquee = ({
  items,
  speed = 30,
  className = "",
}: {
  items: string[];
  speed?: number; // seconds for one full loop
  className?: string;
}) => {
  const reduce = useReducedMotion();
  const row = [...items, ...items]; // duplicated for the seamless -50% loop

  return (
    <div
      aria-hidden="true"
      className={`group relative overflow-hidden ${className}`}
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
        maskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div
        className="flex w-max items-center gap-10"
        style={
          reduce
            ? undefined
            : { animation: `marquee ${speed}s linear infinite` }
        }
      >
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground/70 whitespace-nowrap">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-brand/50" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
