import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/**
 * Fenêtre modale native (<dialog>), même base que le menu mobile :
 * Échap et clic sur le fond ferment, le focus reste piégé puis revient à
 * l'élément qui a ouvert, et l'arrière-plan ne défile plus.
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open) {
      opener.current = document.activeElement;
      if (!element.open) element.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
    if (element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby={titleId}
      // Le clic n'atteint <dialog> que sur le fond : le contenu est dans .modal-panel.
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      onClose={() => {
        onClose();
        (opener.current as HTMLElement | null)?.focus?.({
          preventScroll: true,
        });
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const items = dialog.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])',
        );
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <div className="modal-panel">
        <header className="modal-head">
          <div>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p className="eyebrow">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="icon-button modal-close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            <X size={22} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </dialog>
  );
}
