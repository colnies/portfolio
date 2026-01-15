"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BinaryPuzzle } from "./BinaryPuzzle";

const PUZZLE_COMPLETE_KEY = "portfolio-puzzle-complete";

const projects = [
  {
    id: 1,
    title: "Lindy Promotions",
    description: "Next.js • TypeScript • Tailwind • Firebase",
    longDescription: "Event promotion platform with real-time updates and seamless user experiences.",
    image: "/lindy-promo.png",
    link: "https://lindypromo.com",
  },
  {
    id: 2,
    title: "LendSwift",
    description: "Next.js • Styled Components",
    longDescription: "Modern lending platform with intuitive interfaces and streamlined processes.",
    image: "/lendswift.png",
    link: "https://lendswift.com",
  },
  {
    id: 3,
    title: "Union Square Financial",
    description: "Next.js • Tailwind • Contentful • PostgreSQL",
    longDescription: "Financial services website with dynamic content management and robust data handling.",
    image: "/unionsquare.png",
    link: "https://unionsquarefinancial.com",
  },
  {
    id: 4,
    title: "Joonbug",
    description: "Next.js • TypeScript • Tailwind",
    longDescription: "Nightlife and events platform connecting people with unforgettable experiences.",
    image: "/joonbug.png",
    link: "https://joonbug.com",
  },
  {
    id: 5,
    title: "Louie the Corgi",
    description: "HTML • TypeScript • CSS",
    longDescription: "A delightful personal project showcasing creative web development.",
    image: "/louie.png",
    link: "https://colnies.github.io/louie-the-corgi/index.html",
  },
  {
    id: 6,
    title: "In-house Admin Dashboard",
    description: "Next.js • TypeScript • Material-UI",
    longDescription: "Comprehensive admin interface for managing events and user data.",
    image: "/getout-admin.png",
    link: "https://dashboard.joonbug.com",
  },
];

export function FeaturedProjects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check localStorage on mount
  useEffect(() => {
    const completed = localStorage.getItem(PUZZLE_COMPLETE_KEY);
    setIsUnlocked(completed === "true");
  }, []);

  // Handle puzzle completion
  const handlePuzzleComplete = useCallback(() => {
    localStorage.setItem(PUZZLE_COMPLETE_KEY, "true");
    setIsUnlocked(true);
  }, []);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return projects.length - 1;
      if (next >= projects.length) return 0;
      return next;
    });
  }, []);

  // Autoplay
  useEffect(() => {
    if (isPaused || isHovered) return;

    const interval = setInterval(() => {
      paginate(1);
    }, 6500);

    return () => clearInterval(interval);
  }, [paginate, isPaused, isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginate]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 50;
    const velocityThreshold = 500;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      paginate(1);
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      paginate(-1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    }),
  };

  const currentProject = projects[activeIndex];

  // Show loading state while checking localStorage
  if (isUnlocked === null) {
    return (
      <section id="projects" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Show puzzle if not unlocked
  if (!isUnlocked) {
    return (
      <section id="projects" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <BinaryPuzzle onComplete={handlePuzzleComplete} />
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xl font-bold text-left text-muted-foreground mb-8"
        >
          Featured Projects
        </motion.h2>

        {/* Main carousel container */}
        <div
          ref={containerRef}
          className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.4 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              {/* Project image */}
              <div className="relative w-full h-full">
                <Image
                  src={currentProject.image}
                  alt={currentProject.title}
                  fill
                  className="object-cover object-top"
                  priority={activeIndex === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                />

                {/* Gradient overlay for text legibility - only on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Info panel - only on hover */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: isHovered ? 0 : 20,
                    opacity: isHovered ? 1 : 0
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
                >
                  <div className="max-w-2xl">
                    {/* Project number */}
                    <motion.span
                      key={`num-${activeIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="inline-block text-xs font-medium tracking-widest text-white/60 mb-3"
                    >
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(projects.length).padStart(2, "0")}
                    </motion.span>

                    {/* Title */}
                    <motion.h3
                      key={`title-${activeIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.5 }}
                      className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-3 tracking-tight"
                    >
                      {currentProject.title}
                    </motion.h3>

                    {/* Tech stack */}
                    <motion.p
                      key={`desc-${activeIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-sm text-white/80 font-medium mb-6"
                    >
                      {currentProject.description}
                    </motion.p>

                    {/* CTA Button with frosted glass */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Link
                        href={currentProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg hover:shadow-white/10"
                      >
                        View Project
                        <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows - frosted glass style, hidden until hover */}
          <motion.div
            className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none px-4 md:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => {
                setIsPaused(true);
                paginate(-1);
                setTimeout(() => setIsPaused(false), 10000);
              }}
              className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setIsPaused(true);
                paginate(1);
                setTimeout(() => setIsPaused(false), 10000);
              }}
              className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className="relative p-1"
              aria-label={`Go to ${project.title}`}
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                animate={{
                  scale: index === activeIndex ? 1 : 0.8,
                  backgroundColor:
                    index === activeIndex
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--muted-foreground) / 0.4)",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
              {index === activeIndex && (
                <motion.div
                  layoutId="activeDotRing"
                  className="absolute inset-0 flex items-center justify-center"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <div className="w-6 h-6 rounded-full border-2 border-foreground/40" />
                </motion.div>
              )}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
