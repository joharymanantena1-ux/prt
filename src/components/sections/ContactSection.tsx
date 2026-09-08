import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Copy, Check, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionHeading from "@/components/SectionHeading";
import { useT } from "@/i18n";

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? "andrianmanantena@gmail.com";
const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE ?? "+261 38 46 090 25";
const CONTACT_ENDPOINT = "/.netlify/functions/contact";

type FormState = "idle" | "loading" | "success" | "error";

const EASE = [0.22, 1, 0.36, 1] as const;

export const ContactSection = () => {
  const reduce = useReducedMotion();
  const { t, lang } = useT();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [honeypot, setHoneypot] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setFormState("loading");

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, company: honeypot }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.result !== "success") {
        throw new Error(data?.reason || `HTTP ${res.status}`);
      }

      setFormState("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setConsent(false);
    } catch {
      setFormState("error");
      setTimeout(() => setFormState("idle"), 6000);
    }
  };

  const isDisabled = formState === "loading" || formState === "success";

  return (
    <section className="section-container relative overflow-hidden py-24 sm:py-32 bg-secondary/15 dark:bg-card/15">
      <div className="section-content max-w-6xl mx-auto">
        
        {/* Section Heading */}
        <SectionHeading
          label={t("contact.label")}
          title={lang === "fr" ? "Démarrons un projet ensemble." : "Let's build something exceptional."}
          description={t("contact.desc")}
          className="mb-14 sm:mb-18"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ── Left Column: Direct Action & Availability ───────────────── */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Magnetic Email Display Card */}
            <div className="p-7 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-3">
                {lang === "fr" ? "Contact Direct" : "Direct Contact"}
              </span>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-display font-semibold text-xl sm:text-2xl text-foreground hover:text-primary transition-colors block mb-4 break-all"
              >
                {CONTACT_EMAIL}
              </a>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyEmail}
                  className="rounded-lg gap-2 text-xs font-mono cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">{t("contact.emailCopied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t("contact.copyEmail")}</span>
                    </>
                  )}
                </Button>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground"
                >
                  <span>{lang === "fr" ? "Ouvrir client mail" : "Open email client"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Recruiter Value Indicators */}
            <div className="p-7 rounded-2xl border border-border/80 bg-card/50 backdrop-blur-md flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1.5 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-semibold text-sm text-foreground">
                    {lang === "fr" ? "Disponibilité immédiate" : "Immediate Availability"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {lang === "fr"
                      ? "Ouvert aux missions freelance et opportunités CDI (remote ou hybride)."
                      : "Open for freelance projects and full-time software engineering roles."}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-semibold text-sm text-foreground">
                    Antananarivo, Madagascar (UTC+3)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {lang === "fr"
                      ? "Collaboration fluide avec l'Europe (décalage horaire minime: +1h / +2h)."
                      : "Smooth overlap with European & global teams (UTC+3 timezone)."}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-semibold text-sm text-foreground">
                    {CONTACT_PHONE}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {lang === "fr" ? "Réponse garantie sous 24h ouvrées." : "Guaranteed response within 24h."}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/joharymanantena1-ux"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-primary/50 text-xs font-mono font-medium text-center text-foreground transition-all duration-200"
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/johary-andrianjafinoro-73b29b3a3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-primary/50 text-xs font-mono font-medium text-center text-foreground transition-all duration-200"
              >
                LinkedIn ↗
              </a>
            </div>
          </motion.div>

          {/* ── Right Column: High-End Contact Form ─────────────────────── */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="lg:col-span-7 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md p-7 sm:p-9 shadow-sm"
          >
            <h3 className="font-display font-semibold text-xl sm:text-2xl text-foreground mb-6">
              {lang === "fr" ? "Envoyer un message direct" : "Send a Direct Message"}
            </h3>

            <AnimatePresence mode="wait">
              {formState === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center justify-center text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-2xl text-foreground">
                    {t("contact.successTitle")}
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {t("contact.successMsg")}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Honeypot field for bot protection */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="sr-only"
                    aria-hidden="true"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-name" className="font-mono text-xs text-muted-foreground">
                        {t("contact.name")} *
                      </label>
                      <Input
                        id="contact-name"
                        required
                        disabled={isDisabled}
                        placeholder={t("contact.namePh")}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-xl border-border/80 bg-background/50 focus-visible:ring-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-email" className="font-mono text-xs text-muted-foreground">
                        {t("contact.email")} *
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        required
                        disabled={isDisabled}
                        placeholder={t("contact.emailPh")}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-xl border-border/80 bg-background/50 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-subject" className="font-mono text-xs text-muted-foreground">
                      {t("contact.subject")} *
                    </label>
                    <Input
                      id="contact-subject"
                      required
                      disabled={isDisabled}
                      placeholder={t("contact.subjectPh")}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="rounded-xl border-border/80 bg-background/50 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-message" className="font-mono text-xs text-muted-foreground">
                      {t("contact.message")} *
                    </label>
                    <Textarea
                      id="contact-message"
                      rows={5}
                      required
                      disabled={isDisabled}
                      placeholder={t("contact.messagePh")}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="rounded-xl border-border/80 bg-background/50 resize-none focus-visible:ring-primary"
                    />
                  </div>

                  {/* Consent checkbox */}
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      id="consent-check"
                      type="checkbox"
                      required
                      disabled={isDisabled}
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="consent-check" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                      {t("contact.consent")}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isDisabled || !consent}
                      className="w-full sm:w-auto px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 transition-all duration-200 cursor-pointer"
                    >
                      <span>{formState === "loading" ? t("contact.sending") : t("contact.send")}</span>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {formState === "error" && (
                    <div className="flex items-center gap-2 text-destructive text-xs mt-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{t("contact.errorMsg")}</span>
                    </div>
                  )}
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
