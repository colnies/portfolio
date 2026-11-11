import { WaveBackground } from "@/components/WaveBackground";
import { AsciiDunes } from "@/components/dunes/AsciiDunes";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { SlotMachine } from "@/components/SlotMachine";
import { WorkedWith } from "@/components/WorkedWith";
import { site, socialLinks } from "@/data/site";

export default function App() {
  return (
    <div className="min-h-svh bg-background">
      <WaveBackground />

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
    <section className="relative z-10 flex min-h-svh flex-col pt-24 md:pt-32">
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

      {/* Sits beneath the wave band at the foot of the first viewport */}
      <div className="mt-auto pb-10 pt-20">
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
      {/* Full-bleed ASCII beach, with the credits on solid ground below it */}
      <div className="relative h-[clamp(300px,28vw,420px)] overflow-clip">
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
