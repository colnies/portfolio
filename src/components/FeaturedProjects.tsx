import { motion } from "framer-motion";
import {
  useBalancedText,
  useTextFits,
  useContainerWidth,
} from "@/hooks/useBalancedText";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { projects, type Project } from "@/data/projects";
import { companies } from "@/data/companies";

// Matches the rendered size of the project title (text-lg, font-medium)
const TITLE_FONT = "500 18px 'DejaVu Sans Mono', monospace";

interface ProjectRowProps extends Project {
  containerWidth: number;
}

function ProjectRow({ title, tags, link, containerWidth }: ProjectRowProps) {
  const tagString = tags.join(" · ");
  const fitsOnOneLine = useTextFits(
    `${title}    ${tagString}`,
    TITLE_FONT,
    containerWidth
  );
  const balancedWidth = useBalancedText(title, TITLE_FONT, containerWidth);

  return (
    <motion.div variants={fadeInUp}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-baseline justify-between border-b border-border py-5 transition-all duration-300 hover:border-muted-foreground/30 hover:pl-3"
        style={
          fitsOnOneLine ? undefined : { flexDirection: "column", gap: "6px" }
        }
      >
        <span
          className="flex items-center gap-2 text-lg font-medium text-foreground/80 transition-colors duration-300 group-hover:text-foreground"
          style={
            balancedWidth && balancedWidth < containerWidth
              ? { maxWidth: balancedWidth }
              : undefined
          }
        >
          {title}
          <span className="-translate-x-2 text-sm text-muted-foreground/40 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            →
          </span>
        </span>
        <span className="whitespace-nowrap text-xs text-muted-foreground/60 transition-colors duration-300 group-hover:text-muted-foreground">
          {tagString}
        </span>
      </a>
    </motion.div>
  );
}

function WorkedWith() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-20"
    >
      <h3 className="mb-8 text-base font-medium uppercase tracking-widest text-muted-foreground">
        Worked With
      </h3>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
        {companies.map((company) => (
          <span
            key={company}
            className="whitespace-nowrap text-sm text-muted-foreground/60 transition-colors duration-300 hover:text-foreground"
          >
            {company}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function FeaturedProjects() {
  const [containerRef, containerWidth] = useContainerWidth<HTMLDivElement>();

  return (
    <section id="projects" className="px-6 py-20 md:px-4">
      <div className="mx-auto max-w-3xl" ref={containerRef}>
        <WorkedWith />

        <motion.div
          variants={staggerChildren(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map((project) => (
            <ProjectRow
              key={project.title}
              {...project}
              containerWidth={containerWidth}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
