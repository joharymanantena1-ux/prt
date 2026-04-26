import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Mail, Globe, Code2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import developerPortrait from "@/assets/developer-portrait.png";

interface HeroSectionProps {
  onNavigate: (index: number) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 28 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const socials = [
    { icon: Github, href: "https://github.com/joharymanantena1-ux", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/johary-andrianjafinoro-73b29b3a3", label: "LinkedIn" },
    { icon: Mail, href: "mailto:andrianmanantena@gmail.com", label: "Email" },
    { icon: Globe, href: "https://levitation.mg", label: "Levitation" },
  ];

  return (
    <section className="section-container relative overflow-hidden min-h-screen flex items-center">
      {/* Subtle background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -right-1/4 w-[700px] h-[700px] rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute -bottom-1/3 -left-1/4 w-[600px] h-[600px] rounded-full bg-accent/6 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-8 lg:py-0">

        {/* ── Text content ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center lg:text-left order-2 lg:order-1 space-y-6"
        >
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Disponible pour freelance
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Bonjour, je suis
              <br />
              <span className="text-gradient">Johary Manantena</span>
            </h1>
            <p className="mt-3 text-xl sm:text-2xl text-muted-foreground font-medium">
              Développeur Full-Stack
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-base text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            Je conçois et développe des applications web modernes — de l'architecture
            backend jusqu'à l'interface utilisateur finale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 shadow-sm"
              onClick={() => onNavigate(4)}
            >
              Voir mes projets
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-semibold px-7"
              onClick={() => onNavigate(5)}
            >
              Me contacter
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-7 gap-2"
              asChild
            >
              <a
                href="https://drive.google.com/file/d/1qRizpZePkW1lJWCC8AgexFfZxVR_LjRY/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4" />
                Mon CV
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex gap-2.5 justify-center lg:justify-start"
          >
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-secondary/60 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 border border-border/50"
                aria-label={label}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Portrait ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative order-1 lg:order-2 flex justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative">
            {/* Ambient glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-3xl" />
            </div>

            {/* Portrait with subtle 3D tilt */}
            <motion.div
              style={{ rotateX: springRotateX, rotateY: springRotateY, perspective: 1000 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-[300px] md:h-[400px]">
                {/* Thin gradient border */}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/60 via-accent/30 to-primary/10" />
                <div className="relative h-full rounded-[calc(1.5rem-1px)] overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-10 pointer-events-none" />
                  <img
                    src={developerPortrait}
                    alt="Johary Manantena - Développeur Full-Stack"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </motion.div>

            {/* Floating stat — left */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="absolute -left-4 sm:-left-10 top-1/4 bg-card/95 border border-border/60 rounded-2xl px-3 sm:px-4 py-2.5 shadow-elevated backdrop-blur-sm z-20"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Expérience</p>
                  <p className="text-sm font-bold leading-none">3+ ans</p>
                </div>
              </div>
            </motion.div>

            {/* Floating stat — right */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.05, duration: 0.5 }}
              className="absolute -right-4 sm:-right-10 bottom-1/4 bg-card/95 border border-border/60 rounded-2xl px-3 sm:px-4 py-2.5 shadow-elevated backdrop-blur-sm z-20"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Projets</p>
                  <p className="text-sm font-bold leading-none">17+</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.button
          type="button"
          onClick={() => onNavigate(1)}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
        >
          <span className="text-[10px] font-medium tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
            Scroll
          </span>
          <ArrowDown className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
