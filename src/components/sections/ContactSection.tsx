import { useState, type FormEvent } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useT } from "@/i18n";
import Reveal from "@/components/motion/Reveal";
const EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL ?? "andrianmanantena@gmail.com";
const PHONE_RAW = import.meta.env.VITE_CONTACT_PHONE ?? "+261 38 46 090 25";

/* La variable d'env arrive parfois sans espaces (+261384609025) : on regroupe
   les chiffres pour l'affichage, le lien tel: garde la forme brute. */
const PHONE_TEL = PHONE_RAW.replace(/[^\d+]/g, "");
const groups = PHONE_TEL.match(/^\+261(\d{2})(\d{2})(\d{3})(\d{2})$/);
const PHONE = groups ? `+261 ${groups.slice(1).join(" ")}` : PHONE_RAW;

export default function ContactSection() {
  const { t, lang } = useT();
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("consent") !== "on") return;
    setState("loading");
    try {
      const response = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(
            ["name", "email", "subject", "message", "company"].map((key) => [
              key,
              data.get(key),
            ]),
          ),
        ),
      });
      const result = await response.json();
      if (!response.ok || result?.result !== "success")
        throw new Error("Message failed");
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }
  return (
    <section
      id="contact"
      className="contact-section shell section-space"
      aria-labelledby="contact-title"
    >
      <Reveal>
        <p className="eyebrow section-kicker">
          05 /{" "}
          {lang === "fr"
            ? "La suite commence ici"
            : "The next chapter starts here"}
        </p>
        <a className="contact-invitation" href={`mailto:${EMAIL}`}>
          <h2 id="contact-title">
            {lang === "fr" ? (
              <>
                Et si on
                <br />
                <span>construisait</span>
                <br />
                la suite ?
              </>
            ) : (
              <>
                Let’s build
                <br />
                <span>what comes</span>
                <br />
                next.
              </>
            )}
          </h2>
          <ArrowUpRight
            className="contact-arrow"
            strokeWidth={1}
            aria-hidden="true"
          />
        </a>
        <div className="contact-bottom">
          <div>
            <p className="contact-description">
              {lang === "fr"
                ? "Une équipe à rejoindre, un produit à faire évoluer ou une idée à concrétiser. Parlons-en."
                : "A team to join, a product to evolve or an idea to bring to life. Let’s talk."}
            </p>
            <a href={`mailto:${EMAIL}`} className="contact-email">
              {EMAIL}
              <ArrowUpRight size={20} />
            </a>
          </div>
          <div className="contact-socials">
            <a
              href="https://github.com/joharymanantena1-ux"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <ArrowUpRight size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/johary-andrianjafinoro-73b29b3a3"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
              <ArrowUpRight size={16} />
            </a>
            <a href={`tel:${PHONE_TEL}`}>
              {PHONE}
              <ArrowUpRight size={16} />
            </a>
            <span className="eyebrow">Antananarivo · Madagascar</span>
          </div>
        </div>
      </Reveal>
      <details className="contact-form-details">
        <summary>
          {lang === "fr"
            ? "Vous préférez un formulaire ?"
            : "Prefer a contact form?"}
        </summary>
        <form onSubmit={submit} className="contact-form">
          <div className="form-grid">
            <label>
              {t("contact.name")}
              <input
                name="name"
                autoComplete="name"
                required
                maxLength={120}
                placeholder={t("contact.namePh")}
              />
            </label>
            <label>
              {t("contact.email")}
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder={t("contact.emailPh")}
              />
            </label>
          </div>
          <label>
            {t("contact.subject")}
            <input
              name="subject"
              required
              maxLength={200}
              placeholder={t("contact.subjectPh")}
            />
          </label>
          <label>
            {t("contact.message")}
            <textarea
              name="message"
              required
              rows={4}
              maxLength={10000}
              placeholder={t("contact.messagePh")}
            />
          </label>
          <div className="honeypot" aria-hidden="true">
            <label>
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className="consent-checkbox">
            <input name="consent" type="checkbox" required />
            {t("contact.consent")}
          </label>
          <div className="form-submit">
            <button
              className="button-primary"
              disabled={state === "loading" || state === "success"}
            >
              {state === "loading" ? t("contact.sending") : t("contact.send")}
              <ArrowRight size={18} />
            </button>
            <p role={state === "error" ? "alert" : "status"}>
              {state === "success"
                ? t("contact.successMsg")
                : state === "error"
                  ? t("contact.errorMsg")
                  : ""}
            </p>
          </div>
        </form>
      </details>
    </section>
  );
}
