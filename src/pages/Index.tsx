import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
const ContactSection = lazy(
  () => import("@/components/sections/ContactSection"),
);

export default function Index() {
  return (
    <>
      <Navigation />
      <main id="main">
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <Suspense
          fallback={
            <section
              id="contact"
              className="shell section-space"
              aria-busy="true"
            >
              Contact…
            </section>
          }
        >
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
