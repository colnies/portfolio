import { motion } from "framer-motion";
import {
  useBalancedText,
  useTextFits,
  useContainerWidth,
} from "@/hooks/useBalancedText";

const projects = [
  {
    title: "Drift",
    tags: ["Python", "FastAPI", "PostgreSQL", "React"],
    link: "https://drift-indol-two.vercel.app/",
  },
  {
    title: "Sleep Detective",
    tags: ["Python"],
    link: "https://github.com/colnies/sleep-detective",
  },
  {
    title: "Louie the Corgi",
    tags: ["HTML", "TypeScript", "CSS"],
    link: "https://colnies.github.io/louie-the-corgi/index.html",
  },
  {
    title: "LendSwift",
    tags: ["Next.js", "Styled Components"],
    link: "https://lendswift.com",
  },
  {
    title: "Union Square Financial",
    tags: ["Next.js", "Tailwind", "Contentful", "PostgreSQL"],
    link: "https://unionsquarefinancial.com",
  },
  {
    title: "Joonbug",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    link: "https://joonbug.com",
  },
  {
    title: "Lindy Promotions",
    tags: ["Next.js", "TypeScript", "Tailwind", "Firebase"],
    link: "https://lindypromo.com",
  },
];

const companies = [
  { name: "UKG", logo: "/logos/ukg.png" },
  { name: "Daialog", logo: "/logos/daialog.png" },
  { name: "GigFi", logo: "/logos/gigfi.svg" },
  { name: "LendSwift", logo: "/logos/lendswift.webp" },
  { name: "Union Square Financial", logo: "/logos/union-square.png" },
  { name: "Lindy Promotions", logo: "/logos/lindys.svg" },
  { name: "Joonbug", logo: "/logos/joonbug.svg" },
  { name: "Skynet Media", logo: "/logos/skynet.png" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

function ProjectRow({
  title,
  tags,
  link,
  containerWidth,
}: {
  title: string;
  tags: string[];
  link: string;
  containerWidth: number;
}) {
  const tagString = tags.join(" · ");
  const combinedText = `${title}    ${tagString}`;
  // DejaVu Sans Mono at the rendered sizes
  const nameFont = "500 18px 'DejaVu Sans Mono', monospace";

  const fits = useTextFits(combinedText, nameFont, containerWidth);
  const optimalWidth = useBalancedText(title, nameFont, containerWidth);

  return (
    <motion.div variants={fadeInUp}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-baseline justify-between py-5 border-b border-border transition-all duration-300 hover:pl-3 hover:border-muted-foreground/30"
        style={!fits ? { flexDirection: "column", gap: "6px" } : undefined}
      >
        <span
          className="text-lg font-medium text-foreground/80 transition-colors duration-300 group-hover:text-foreground flex items-center gap-2"
          style={
            optimalWidth && optimalWidth < containerWidth
              ? { maxWidth: optimalWidth }
              : undefined
          }
        >
          {title}
          <span className="text-muted-foreground/40 text-sm opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            →
          </span>
        </span>
        <span className="text-xs text-muted-foreground/60 transition-colors duration-300 group-hover:text-muted-foreground whitespace-nowrap">
          {tagString}
        </span>
      </a>
    </motion.div>
  );
}

export function FeaturedProjects() {
  const [containerRef, containerWidth] = useContainerWidth<HTMLDivElement>();

  return (
    <section id="projects" className="py-20 px-4">
      <div className="pl-2 md:pl-0 max-w-3xl mx-auto" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-base font-medium tracking-widest uppercase text-muted-foreground mb-8">
            Worked With
          </h3>
          <div className="flex flex-wrap items-center gap-8">
            {companies.map((company) => (
              <img
                key={company.name}
                src={company.logo}
                alt={company.name}
                title={company.name}
                className="h-12 w-32 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 dark:opacity-40 dark:hover:opacity-100 dark:mix-blend-screen mix-blend-multiply"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map((project) => (
            <ProjectRow
              key={project.title}
              title={project.title}
              tags={project.tags}
              link={project.link}
              containerWidth={containerWidth}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
