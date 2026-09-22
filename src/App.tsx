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
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />

      <Hero />
      <FeaturedProjects />
      <Contact />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <motion.section
      className="relative mb-12 min-h-screen px-6 pt-20 md:mb-0 md:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="relative z-10 mx-auto max-w-3xl space-y-6 text-left"
        variants={staggerChildren()}
        initial="hidden"
        animate="visible"
      >
        <h1 className="gradient-flow bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          {site.name}
        </h1>

        <p className="text-xl uppercase text-foreground md:text-2xl">
          Software Engineer
          <br />
          Focused on Experience Design
          <br />
          Building at{" "}
          <a
            href={site.employer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline"
          >
            <SlotMachine text={site.employer.name} every={8000} />
          </a>
        </p>

        <p className="max-w-md font-basier text-lg text-muted-foreground">
          Currently pursuing my Master's in{" "}
          <span className="text-foreground">Technology Management</span> at{" "}
          <span className="text-foreground">Rutgers University</span>
        </p>

        <p className="max-w-lg font-basier text-lg text-muted-foreground">
          I live in the{" "}
          <span className="text-foreground">
            sweet spot between design and engineering
          </span>
          , creating products that look clean and{" "}
          <span className="text-foreground">feel special</span>.
        </p>

        <div className="flex gap-4">
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
        </div>

        <div>
          <a href="#projects">
            <Button className="gradient-flow mt-2">View My Work</Button>
          </a>
        </div>

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
    </motion.section>
  );
}

function Contact() {
  return (
    <section className="px-6 py-20 md:px-4">
      <motion.div
        className="mx-auto max-w-3xl"
        variants={staggerChildren()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 variants={fadeInUp} className="mb-6 text-3xl font-bold">
          Let's Work Together
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-8 font-basier text-muted-foreground"
        >
          I'm always interested in hearing about new projects and opportunities.
        </motion.p>
        <motion.div variants={fadeInUp}>
          <a href={`mailto:${site.email}`}>
            <Button className="hover:gradient-flow">
              Get In Touch <Mail className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </motion.div>
      </motion.div>
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
              className="transition-colors hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
