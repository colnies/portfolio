import { useSyncExternalStore } from "react";
import GitHubCalendar from "react-github-calendar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WaveBackground } from "@/components/WaveBackground";
import { AsciiDunes } from "@/components/dunes/AsciiDunes";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { SlotMachine } from "@/components/SlotMachine";
import { WorkedWith } from "@/components/WorkedWith";
import { site, socialLinks } from "@/data/site";

const CALENDAR_COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

const LINK =
  "rounded-sm underline decoration-muted-foreground/40 underline-offset-4 transition-colors duration-200 ease-out hover:decoration-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

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

const noopSubscribe = () => () => {};

/** False during prerender and hydration, true once running in the browser. */
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
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
              className={`hit-area ${LINK}`}
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
  const isClient = useIsClient();

  return (
    <section className="relative z-10 flex min-h-svh flex-col pt-24 md:pt-32">
      <h1 className="mb-8 text-5xl font-bold tracking-tight text-foreground md:mb-10 md:text-7xl">
        {site.name}
      </h1>

      <div className="space-y-6">
        <p className="text-xl uppercase text-foreground md:text-2xl">
          Software Engineer
          <br />
          Focused on Frontend & UX
          <br />
          Building at{" "}
          <a
            href={site.employer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <SlotMachine text={site.employer.name} every={8000} />
          </a>
        </p>

        <div className="max-w-lg space-y-4 font-basier text-lg text-muted-foreground">
          <p>
            Currently pursuing my Master’s in{" "}
            <span className="text-foreground">Technology Management</span> at{" "}
            <span className="text-foreground">Rutgers University</span>
          </p>
          <p>
            I live in the{" "}
            <span className="text-foreground">
              sweet spot between design and engineering
            </span>
            , creating products that look clean and{" "}
            <span className="text-foreground">feel special</span>.
          </p>
        </div>

        <SocialLinks />

        {/* Measures text with the DOM, so it can't be prerendered */}
        {isClient && (
          <ErrorBoundary>
            <GitHubCalendar
              username={site.githubUsername}
              blockSize={9}
              blockMargin={4}
              fontSize={16}
              colorScheme="dark"
              theme={{ dark: CALENDAR_COLORS }}
              throwOnError
            />
          </ErrorBoundary>
        )}
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
    <section aria-label="Contact" className="pb-24 pt-12">
      <p className="mb-6 max-w-md font-basier text-lg text-muted-foreground">
        I’m always interested in hearing about new projects and opportunities.
      </p>
      <a
        href={`mailto:${site.email}`}
        className={`text-2xl text-foreground md:text-3xl ${LINK}`}
      >
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
