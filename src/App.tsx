import { AsciiDunes } from "@/components/dunes/AsciiDunes";
import { buildSky } from "@/components/dunes/scene";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { SlotMachine } from "@/components/SlotMachine";
import { WorkedWith } from "@/components/WorkedWith";
import { site, socialLinks } from "@/data/site";

export default function App() {
  return (
    <div className="min-h-svh bg-background">
      {/* The sky of the footer's beach, so the page runs from clouds at the
          top down to the sand and surf at the bottom */}
      <div className="relative h-[clamp(140px,14vw,200px)] overflow-clip">
        <AsciiDunes build={buildSky} />
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <main>
          <Hero />
          <FeaturedProjects />
          <Contact />
        </main>
      </div>
      <Footer />
    </div>
  );
}

function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 ${className}`}>
      {socialLinks.map(({ label, href }) => {
        const external = !href.startsWith("mailto:");
        return (
          <li key={label}>
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="hit-area link"
            >
              {label}
              {external && <span aria-hidden="true"> ↗</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function Hero() {
  return (
    <section className="pt-10 md:pt-12">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground md:mb-8 md:text-3xl">
        {site.name}
      </h1>

      <div className="space-y-6">
        <div className="max-w-[80ch] space-y-3 text-balance text-muted-foreground md:space-y-2">
          <p>
            <span className="text-foreground">Full-stack engineer</span> at{" "}
            {/* The letters are inline-blocks, so without this the line can
                break inside the name */}
            <span className="whitespace-nowrap">
              <a
                href={site.employer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <SlotMachine text={site.employer.name} every={8000} />
              </a>
            </span>{" "}
            with a soft spot for <span className="text-foreground">design</span>
            .
          </p>
          <p>
            Currently pursuing my Master’s in{" "}
            <span className="whitespace-nowrap text-foreground">
              Technology Management
            </span>{" "}
            at{" "}
            <span className="whitespace-nowrap text-foreground">
              Rutgers University
            </span>
            .
          </p>
          <p>
            I design and build products that look clean and{" "}
            <span className="text-foreground">feel special</span>.
          </p>
        </div>

        <SocialLinks />
      </div>

      <div className="pb-10 pt-24">
        <WorkedWith />
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section aria-label="Contact" className="pb-24">
      <p className="mb-4 max-w-[80ch] text-balance text-muted-foreground">
        I’m always interested in hearing about new projects and opportunities.
      </p>
      <a href={`mailto:${site.email}`} className="hit-area link">
        {site.email}
      </a>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      {/* One full-bleed ASCII scene: sky and dunes, the beach running down
          to the waterline, then the sea. Credits sit below. */}
      <div className="relative h-[clamp(460px,44vw,660px)] overflow-clip">
        <AsciiDunes />
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm text-muted-foreground md:px-12">
        {/* Year is baked in at build time and may be stale until the next deploy */}
        <span suppressHydrationWarning>
          © {new Date().getFullYear()} {site.name}
        </span>
        <SocialLinks />
      </div>
    </footer>
  );
}
