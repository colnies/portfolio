import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import GitHubCalendar from "react-github-calendar";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WaveBackground } from "@/components/WaveBackground";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { SlotMachine } from "@/components/SlotMachine";
import { WorkedWith } from "@/components/WorkedWith";
import { EASE_OUT, fadeInUp, staggerChildren } from "@/lib/motion";
import { site, socialLinks } from "@/data/site";

const CALENDAR_COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

export default function App() {
  return (
    <div className="min-h-svh bg-background">
      <WaveBackground />

      <main>
        <Hero />
        <FeaturedProjects />
        <Contact />
      </main>
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

function Hero() {
  const isClient = useIsClient();

  return (
    <section className="relative flex min-h-svh flex-col px-6 pt-24 md:px-4 md:pt-32">
      <motion.div
        className="relative z-10 mx-auto max-w-3xl space-y-6"
        variants={staggerChildren()}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeInUp}
          className="bg-gradient-to-r from-teal-800 via-foreground to-sky-800 bg-[length:200%_auto] bg-clip-text text-4xl font-bold tracking-tight text-transparent motion-safe:animate-flow md:text-5xl"
        >
          {site.name}
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-xl uppercase text-foreground md:text-2xl"
        >
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
        </motion.p>

        <motion.p
          variants={fadeInUp}
          className="max-w-md font-basier text-lg text-muted-foreground"
        >
          Currently pursuing my Master’s in{" "}
          <span className="text-foreground">Technology Management</span> at{" "}
          <span className="text-foreground">Rutgers University</span>
        </motion.p>

        <motion.p
          variants={fadeInUp}
          className="max-w-lg font-basier text-lg text-muted-foreground"
        >
          I live in the{" "}
          <span className="text-foreground">
            sweet spot between design and engineering
          </span>
          , creating products that look clean and{" "}
          <span className="text-foreground">feel special</span>.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex gap-4">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <Button key={label} variant="outline" size="icon" asChild>
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            </Button>
          ))}
        </motion.div>

        <motion.div variants={fadeInUp}>
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
        </motion.div>
      </motion.div>

      {/* Sits beneath the wave band at the foot of the first viewport */}
      <motion.div
        className="relative z-10 mx-auto mt-auto w-full max-w-3xl pb-10 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.42, ease: EASE_OUT }}
      >
        <WorkedWith />
      </motion.div>
    </section>
  );
}

function Contact() {
  return (
    <section className="px-6 pb-24 pt-12 md:px-4">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-3xl font-bold tracking-tight">
          Let’s Work Together
        </h2>
        <p className="mb-8 max-w-md font-basier text-muted-foreground">
          I’m always interested in hearing about new projects and opportunities.
        </p>
        <Button asChild>
          <a href={`mailto:${site.email}`}>
            Get In Touch <Mail className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 md:px-4">
      <div className="mx-auto flex max-w-3xl items-center justify-between text-sm text-muted-foreground">
        {/* Year is baked in at build time and may be stale until the next deploy */}
        <span suppressHydrationWarning>
          © {new Date().getFullYear()} {site.name}
        </span>
        <div className="flex items-center gap-5">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              className="hit-area rounded-sm transition-colors duration-200 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
