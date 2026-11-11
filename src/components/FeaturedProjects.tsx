import { projects, type Project } from "@/data/projects";
import { Row } from "@/components/Row";

/** "https://www.example.com/index.html" becomes "example.com" */
function displayUrl(link: string) {
  return link
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/(index\.html)?$/, "");
}

/** Swaps in non-breaking hyphens, so a line never ends on "z-" with "score" below */
function keepHyphenated(text: string) {
  return text.replace(/(\w)-(?=\w)/g, "$1\u2011");
}

/** A native disclosure, so rows open without JavaScript and find-in-page works */
function ProjectRow({ title, blurb, details, tags, link }: Project) {
  return (
    <details className="group border-b border-border">
      <summary className="group/row flex cursor-pointer list-none items-baseline gap-x-[1ch] rounded-sm py-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="text-muted-foreground">
          –
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-bold text-foreground">{title}</span>{" "}
          <span className="text-muted-foreground transition-colors duration-200 ease-out group-hover/row:text-foreground">
            {blurb}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="text-muted-foreground group-open:text-accent"
        >
          <span className="group-open:hidden">[+]</span>
          <span className="hidden group-open:inline">[−]</span>
        </span>
      </summary>

      <div className="space-y-3 pb-5 pl-[2ch] sm:pr-[4ch]">
        {details.length > 0 && (
          <ul className="max-w-[72ch] space-y-1">
            {details.map((detail) => (
              <li key={detail} className="flex gap-x-[1ch]">
                <span aria-hidden="true" className="text-muted-foreground">
                  ·
                </span>
                <span>{keepHyphenated(detail)}</span>
              </li>
            ))}
          </ul>
        )}
        {/* Non-breaking spaces keep a two-word tag on one line, a separator
            from starting a wrapped line, and the arrow below from wrapping alone */}
        <p className="lowercase text-muted-foreground">
          {tags.map((tag) => tag.replace(/ /g, "\u00a0")).join("\u00a0· ")}
        </p>
        <p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="hit-area link"
          >
            {displayUrl(link)}
            <span aria-hidden="true">{"\u00a0"}↗</span>
          </a>
        </p>
      </div>
    </details>
  );
}

export function FeaturedProjects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="pb-24 pt-14"
    >
      <Row label="Projects" id="projects-heading">
        <div className="border-t border-border">
          {projects.map((project) => (
            <ProjectRow key={project.title} {...project} />
          ))}
        </div>
      </Row>
    </section>
  );
}
