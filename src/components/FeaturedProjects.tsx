import {
  useBalancedText,
  useTextFits,
  useContainerWidth,
} from "@/hooks/useBalancedText";
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
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-baseline justify-between border-b border-border py-5 transition-colors duration-200 ease-out hover:border-muted-foreground/30 focus-visible:border-foreground focus-visible:outline-none"
      style={
        fitsOnOneLine ? undefined : { flexDirection: "column", gap: "6px" }
      }
    >
      <span
        className="flex items-center gap-2 text-lg font-medium text-foreground/80 transition-[color,transform] duration-200 ease-out group-hover:translate-x-2 group-hover:text-foreground group-focus-visible:translate-x-2 group-focus-visible:text-foreground"
        style={
          balancedWidth && balancedWidth < containerWidth
            ? { maxWidth: balancedWidth }
            : undefined
        }
      >
        {title}
        <span
          aria-hidden="true"
          className="text-sm text-muted-foreground/40 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          →
        </span>
      </span>
      <span className="whitespace-nowrap text-xs text-muted-foreground/60 transition-colors duration-200 ease-out group-hover:text-muted-foreground group-focus-visible:text-muted-foreground">
        {tagString}
      </span>
    </a>
  );
}

function WorkedWith() {
  return (
    <div className="mb-20">
      <h3 className="mb-8 text-base font-medium uppercase tracking-widest text-muted-foreground">
        Worked With
      </h3>
      <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
        {companies.map((company) => (
          <li
            key={company}
            className="whitespace-nowrap text-sm text-muted-foreground/60"
          >
            {company}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FeaturedProjects() {
  const [containerRef, containerWidth] = useContainerWidth<HTMLDivElement>();

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="px-6 pb-24 pt-8 md:px-4"
    >
      <div className="mx-auto max-w-3xl" ref={containerRef}>
        <h2 id="projects-heading" className="sr-only">
          Projects
        </h2>
        <WorkedWith />
        <div>
          {projects.map((project) => (
            <ProjectRow
              key={project.title}
              {...project}
              containerWidth={containerWidth}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
