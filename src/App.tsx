import { cubicBezier, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { WaveBackground } from "@/components/gentle-wave";
import GitHubCalendar from "react-github-calendar";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { SlotMachine } from "@/components/SlotMachine";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: cubicBezier(0.17, 0.67, 0.83, 0.67),
    },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function App() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-700">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <WaveBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
      {/* Hero Section */}
      <motion.section
        className="min-h-screen mb-12 md:mb-0 flex flex-col pl-2 md:pl-0 max-w-3xl mx-auto relative pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="z-10 text-left space-y-6 px-4"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-800 via-primary to-sky-800 animate-flow bg-[length:200%_auto]">
            Colin Nies
          </h1>
          <p className="text-xl md:text-2xl text-foreground uppercase">
            Web Developer
            <br />
            Focused on Experience Design
            <br />
            Building at{" "}
            <a href="https://ukg.com" target="_blank" rel="noopener noreferrer">
              <SlotMachine text="UKG" every={8000} />
            </a>
          </p>
          <div className="text-lg text-muted-foreground max-w-md font-basier">
            <p>
              Currently pursuing my Master's in{" "}<br/>
              <span className="text-foreground">Engineering Management</span> {" & "} 
              <span className="text-foreground">Product Design</span><br/> at{" "}
              <span className="text-foreground">Rutgers University</span>
            </p>
          </div>
          <div className="text-lg text-muted-foreground max-w-md font-basier">
            <p>
              Building fast apps where every small interaction is crafted to
              make your users smile while keeping the design simple and
              purposeful.
            </p>
          </div>
          <div className="text-lg text-muted-foreground max-w-lg font-basier">
            <p>
              I live in the{" "}
              <span className="text-foreground">
                sweet spot between design and engineering
              </span>
              , creating products that look clean and{" "}
              <span className="text-foreground">feel special</span>.
            </p>
          </div>
          <div className="flex gap-4 justify-start">
            <a
              href="https://github.com/colnies"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </a>
            <a
              href="https://linkedin.com/in/colin-nies"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
            </a>
            <a href="mailto:contact@colinnies.dev">
              <Button variant="outline" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </a>
          </div>
          <div>
            <a href="#projects">
              <Button className="mt-2 bg-gradient-to-r from-teal-800 via-primary to-sky-800 animate-flow bg-[length:200%_auto]">
                View My Work
              </Button>
            </a>
          </div>
          <GitHubCalendar
            username="colnies"
            blockSize={9}
            blockMargin={4}
            theme={{
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            fontSize={16}
          />
        </motion.div>
      </motion.section>

      {/* Featured Projects Section */}
      <FeaturedProjects />

      {/* Contact Section */}
      <section className="py-20 px-4">
        <motion.div
          className="pl-2 md:pl-0 max-w-3xl mx-auto"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6">
            Let's Work Together
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mb-8 font-basier"
          >
            I'm always interested in hearing about new projects and
            opportunities.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <a href="mailto:contact@colinnies.dev">
              <Button className="hover:bg-gradient-to-r hover:from-teal-800 hover:via-primary hover:to-sky-800 hover:animate-flow hover:bg-[length:200%_auto]">
                Get In Touch <Mail className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
