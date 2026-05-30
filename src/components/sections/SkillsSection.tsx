import { motion, useReducedMotion } from "framer-motion";
import { Monitor, Server, Database, Terminal, Target, Layers, Users, Zap, Rocket, RefreshCw, MessageSquare, CheckCircle2 } from "lucide-react";

interface Skill {
  name: string;
  devicon: string | null;
  fallback?: string;
}

interface Category {
  title: string;
  color: "primary" | "accent";
  Icon: React.ComponentType<{ className?: string }>;
  skills: Skill[];
}

const categories: Category[] = [
  {
    title: "Frontend",
    color: "primary",
    Icon: Monitor,
    skills: [
      { name: "React / Next.js", devicon: "devicon-react-original" },
      { name: "TypeScript",      devicon: "devicon-typescript-plain" },
      { name: "JavaScript",      devicon: "devicon-javascript-plain" },
      { name: "Angular",         devicon: "devicon-angularjs-plain" },
      { name: "Vue.js",          devicon: "devicon-vuejs-plain" },
      { name: "Tailwind CSS",    devicon: "devicon-tailwindcss-plain" },
      { name: "Bootstrap",       devicon: "devicon-bootstrap-plain" },
      { name: "React Native",    devicon: "devicon-react-original" },
      { name: "Flutter",         devicon: "devicon-flutter-plain" },
    ],
  },
  {
    title: "Backend",
    color: "accent",
    Icon: Server,
    skills: [
      { name: "PHP / Laravel",   devicon: "devicon-laravel-plain" },
      { name: "Symfony",         devicon: "devicon-symfony-original" },
      { name: "CodeIgniter",     devicon: "devicon-codeigniter-plain" },
      { name: "Django",          devicon: "devicon-django-plain" },
      { name: "Java / Spring",   devicon: "devicon-spring-plain" },
      { name: "Node.js",         devicon: "devicon-nodejs-plain" },
      { name: "Python",          devicon: "devicon-python-plain" },
      { name: "C",               devicon: "devicon-c-plain" },
      { name: "C# / ASP.NET",    devicon: "devicon-csharp-plain" },
      { name: "C++",             devicon: "devicon-cplusplus-plain" },
    ],
  },
  {
    title: "Bases de données",
    color: "primary",
    Icon: Database,
    skills: [
      { name: "MySQL",           devicon: "devicon-mysql-plain" },
      { name: "PostgreSQL",      devicon: "devicon-postgresql-plain" },
      { name: "Oracle",          devicon: "devicon-oracle-original" },
      { name: "Firebase",        devicon: "devicon-firebase-plain" },
      { name: "PostGIS",         devicon: null, fallback: "GIS" },
    ],
  },
  {
    title: "DevOps & Outils",
    color: "accent",
    Icon: Terminal,
    skills: [
      { name: "Git / GitHub",    devicon: "devicon-git-plain" },
      { name: "Docker",          devicon: "devicon-docker-plain" },
      { name: "Linux",           devicon: "devicon-linux-plain" },
      { name: "API REST",        devicon: null, fallback: "REST" },
      { name: "n8n",             devicon: null, fallback: "n8n" },
    ],
  },
];

const softSkills = [
  { label: "Analyse des besoins", Icon: Target },
  { label: "Architecture logicielle", Icon: Layers },
  { label: "Travail en équipe", Icon: Users },
  { label: "Résolution de problèmes", Icon: Zap },
  { label: "Autonomie", Icon: Rocket },
  { label: "Adaptabilité", Icon: RefreshCw },
  { label: "Communication", Icon: MessageSquare },
  { label: "Rigueur", Icon: CheckCircle2 },
];

const TechChip = ({ skill }: { skill: Skill }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border/40 hover:border-border hover:bg-secondary transition-colors duration-200 group cursor-default">
    {skill.devicon ? (
      <i className={`${skill.devicon} colored text-xl flex-shrink-0 w-5 text-center`} aria-hidden="true" />
    ) : (
      <span
        aria-hidden="true"
        className="w-6 h-5 flex items-center justify-center text-[10px] font-bold text-muted-foreground bg-muted rounded flex-shrink-0"
      >
        {skill.fallback?.slice(0, 4)}
      </span>
    )}
    <span className="text-sm font-medium leading-none">{skill.name}</span>
  </div>
);

const CategoryCard = ({ category, index }: { category: Category; index: number }) => {
  const reduce = useReducedMotion();
  const isPrimary = category.color === "primary";
  const { Icon } = category;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.5, delay: index * 0.08 }}
      className="card-floating p-5 lg:p-6 flex flex-col gap-4"
    >
      {/* Card header */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isPrimary ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
        }`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-display font-bold leading-none mb-1">{category.title}</h3>
          <div className={`h-0.5 w-6 rounded-full ${isPrimary ? "bg-primary" : "bg-accent"}`} />
        </div>
        <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {category.skills.length}
        </span>
      </div>

      {/* Skills chips grid */}
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <TechChip key={skill.name} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const reduce = useReducedMotion();
  return (
    <section className="section-container">
      <div className="section-content">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.55 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3">
            Compétences
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Un stack moderne et polyvalent, enrichi continuellement.
          </p>
        </motion.div>

        {/* Tech categories grid */}
        <div className="grid sm:grid-cols-2 gap-4 lg:gap-5 mb-10 md:mb-12">
          {categories.map((category, index) => (
            <CategoryCard key={category.title} category={category} index={index} />
          ))}
        </div>

        {/* Soft skills */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.25 }}
        >
          <div className="text-center mb-5">
            <h3 className="text-lg font-display font-semibold">Soft Skills</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {softSkills.map(({ label, Icon }, index) => (
              <motion.div
                key={label}
                initial={reduce ? false : { opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={reduce ? { duration: 0 } : { duration: 0.28, delay: 0.3 + index * 0.04 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border/50 text-sm font-medium cursor-default hover:bg-secondary hover:border-primary/40 transition-colors duration-200"
              >
                <Icon className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                {label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
