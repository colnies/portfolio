import { motion } from "framer-motion";
import GitHubCalendar from "react-github-calendar";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WaveBackground } from "@/components/WaveBackground";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { SlotMachine } from "@/components/SlotMachine";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { site, socialLinks } from "@/data/site";

const CALENDAR_COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

export default function App() {
  return (
    <div className="min-h-screen bg-background">
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

function Hero() {
  return (
    <section className="relative px-6 pb-16 pt-24 md:px-4 md:pb-24 md:pt-32">
      <motion.div
        className="relative z-10 mx-auto max-w-3xl space-y-6"
        variants={staggerChildren()}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-4xl font-bold tracking-tight md:text-5xl"
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
            className="underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
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
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon" aria-label={label}>
                <Icon className="h-5 w-5" />
              </Button>
            </a>
          ))}
        </motion.div>

        <motion.div variants={fadeInUp}>
          <a href="#projects">
            <Button className="mt-2">View My Work</Button>
          </a>
        </motion.div>

        <motion.div variants={fadeInUp}>
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
        </motion.div>
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
        <a href={`mailto:${site.email}`}>
          <Button>
            Get In Touch <Mail className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 md:px-4">
      <div className="mx-auto flex max-w-3xl items-center justify-between text-sm text-muted-foreground">
        <span>
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
              className="transition-colors duration-200 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
