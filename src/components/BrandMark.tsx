import type { CSSProperties } from "react";

/**
 * Marque monochrome : le masque porte la forme, `currentColor` la couleur.
 * `decorative` quand le nom de la marque est déjà écrit juste à côté ; sinon le
 * nom reste dans le DOM (lu par les lecteurs d'écran, et affiché en repli si le
 * navigateur ne sait pas masquer — voir le @supports dans index.css).
 */
export default function BrandMark({
  src,
  name,
  className = "",
  decorative = false,
}: {
  src: string;
  name: string;
  className?: string;
  decorative?: boolean;
}) {
  const style = {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
  } as CSSProperties;
  return (
    <span
      className={`brand-mark ${className}`.trim()}
      style={style}
      aria-hidden={decorative || undefined}
    >
      {!decorative && <span className="brand-mark-name">{name}</span>}
    </span>
  );
}
