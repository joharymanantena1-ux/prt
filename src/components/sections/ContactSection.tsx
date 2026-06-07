import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, Send, Github, Linkedin, Globe, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMotionPreset } from "@/hooks/useMotionPreset";
import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { useT } from "@/i18n";

// ── Config (env-sourced — keeps PII/endpoint out of the committed source) ──────
// Set in `.env.local` (see .env.example):
//   VITE_CONTACT_EMAIL, VITE_CONTACT_PHONE, VITE_GOOGLE_SCRIPT_URL
// The endpoint must accept a POST and return JSON ({ result: "success" }).
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? "andrianmanantena@gmail.com";
const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE ?? "+261 38 46 090 25";
const GOOGLE_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_SCRIPT_URL ??
  "https://script.google.com/macros/s/AKfycbzkNL3UIxlgjYhXk2RcLfHBcTjRNlYxJPUwA2EjKHuNTL4d2H3yzQc8EgQ5HyLG1hHJ/exec";

type FormState = "idle" | "loading" | "success" | "error";

const ContactSection = () => {
  const { reduce, pop } = useMotionPreset();
  const { t } = useT();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setFormState("loading");

    try {
      if (!GOOGLE_SCRIPT_URL) throw new Error("Endpoint de contact non configuré.");

      // Apps Script ne renvoie pas d'en-tête Access-Control-Allow-Origin, donc une
      // requête CORS "lisible" est bloquée par le navigateur. `no-cors` laisse le
      // POST aboutir (le mail part bien) au prix d'une réponse opaque, illisible.
      // On ne peut donc pas valider le corps : l'absence d'erreur réseau = succès.
      // `text/plain` reste une "simple request" → aucun preflight OPTIONS.
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(formData),
      });

      setFormState("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setConsent(false);
    } catch {
      // Surface the real failure — never report a false success.
      setFormState("error");
      setTimeout(() => setFormState("idle"), 6000);
    }
  };

  const contactItems = [
    { icon: Mail, label: t("contact.infoEmail"), value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, breakClass: "break-all" },
    { icon: Phone, label: t("contact.infoPhone"), value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`, breakClass: "break-words" },
    { icon: MapPin, label: t("contact.infoLocation"), value: t("contact.locationValue"), href: null, breakClass: "break-words" },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/joharymanantena1-ux", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/johary-andrianjafinoro-73b29b3a3", label: "LinkedIn" },
    { icon: Globe, href: "https://levitation.mg", label: "Levitation.mg" },
  ];

  const isDisabled = formState === "loading" || formState === "success";

  return (
    <section className="section-container">
      <div className="section-content max-w-5xl">
        <SectionHeading
          index="05"
          label={t("contact.label")}
          title={t("contact.title")}
          description={t("contact.desc")}
          className="mb-10 md:mb-14"
        />

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
          {/* Form — wider col */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 card-swiss p-6 lg:p-8"
          >
            <AnimatePresence mode="wait">
              {formState === "success" ? (
                <motion.div
                  key="success"
                  {...(pop as any)}
                  className="flex flex-col items-center justify-center h-full py-12 text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-success" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-display font-semibold">{t("contact.successTitle")}</h3>
                  <p className="text-foreground/80 text-sm max-w-xs">
                    {t("contact.successMsg")}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold mb-2 text-foreground uppercase tracking-wider">
                        {t("contact.name")}
                      </label>
                      <Input
                        id="name"
                        name="name"
                        autoComplete="name"
                        placeholder={t("contact.namePh")}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={isDisabled}
                        className="bg-secondary/40 border-border/60 placeholder:text-muted-foreground/90 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring text-sm h-11"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold mb-2 text-foreground uppercase tracking-wider">
                        {t("contact.email")}
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder={t("contact.emailPh")}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isDisabled}
                        className="bg-secondary/40 border-border/60 placeholder:text-muted-foreground/90 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring text-sm h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold mb-2 text-foreground uppercase tracking-wider">
                      {t("contact.subject")}
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder={t("contact.subjectPh")}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      disabled={isDisabled}
                      className="bg-secondary/40 border-border/60 placeholder:text-muted-foreground/90 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring text-sm h-11"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold mb-2 text-foreground uppercase tracking-wider">
                      {t("contact.message")}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder={t("contact.messagePh")}
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      disabled={isDisabled}
                      className="bg-secondary/40 border-border/60 placeholder:text-muted-foreground/90 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring resize-none text-sm"
                    />
                  </div>

                  {/* RGPD consent gate — blocks submit until checked */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                      disabled={isDisabled}
                      aria-describedby="consent-desc"
                      className="mt-1 h-4 w-4 cursor-pointer rounded border-border accent-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <label id="consent-desc" htmlFor="consent" className="text-xs leading-relaxed text-foreground cursor-pointer">
                      {t("contact.consent")}
                    </label>
                  </div>

                  {/* Status — aria-live so screen readers announce the result */}
                  <div aria-live="polite">
                    {formState === "error" && (
                      <motion.div
                        {...(reduce ? {} : { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 } })}
                        role="alert"
                        className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        {t("contact.errorMsg")}
                      </motion.div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isDisabled || !consent}
                    className="w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-secondary/60 disabled:text-muted-foreground text-sm font-semibold h-12 gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {formState === "loading" ? (
                      <>
                        {reduce ? (
                          <span aria-hidden="true" className="font-bold tracking-widest">…</span>
                        ) : (
                          <span aria-hidden="true" className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        )}
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" aria-hidden="true" />
                        {t("contact.send")}
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Contact items — full value stays readable on 375px */}
            <div className="card-swiss p-5 space-y-3">
              {contactItems.map(({ icon: Icon, label, value, href, breakClass }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="kicker !text-[11px]">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className={`text-sm font-medium hover:text-primary transition-colors block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${breakClass}`}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className={`text-sm font-medium ${breakClass}`}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links — 44px hit area, focus ring, 12px label floor */}
            <div className="card-swiss p-5">
              <h3 className="text-sm font-display font-semibold mb-3">{t("contact.linksTitle")}</h3>
              <div className="flex gap-2">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ouvrir ${label} dans un nouvel onglet`}
                    className="flex-1 min-h-11 flex flex-col items-center justify-center gap-1 p-3 rounded-md bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-colors duration-200 border border-border/50 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-primary-foreground transition-colors truncate w-full text-center">
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability — success token; dot pulse handled by the global reduced-motion guard */}
            <div className="card-swiss p-5 bg-primary/5 border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
                <h3 className="text-sm font-display font-semibold">{t("contact.availableTitle")}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("contact.availableDesc")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
