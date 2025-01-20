"use client"
import React, { useEffect, useRef, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, ExternalLink, Layout, Lightbulb, Palette } from "lucide-react";
import Link from 'next/link';
import { Metadata } from 'next';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';

// Custom hook for scroll animations
const useScrollAnimation = () => {
    const ref = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );
  
      if (ref.current) {
        observer.observe(ref.current);
      }
  
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, []);
  
    return ref;
};
  
// AnimatedSection component
const AnimatedSection = ({ children, className = '' }: { children: ReactNode, className?: string }) => {
    const ref = useScrollAnimation();
    return (
      <div 
        ref={ref} 
        className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}
      >
        {children}
      </div>
    );
};


const projects = [
    {
        id: 1,
        title: "Joonbug",
        description: "A dynamic events promotion platform showcasing nightlife and entertainment across multiple cities. Built with Typescript & Tailwind, featuring interactive events listings, ticket purchasing integration, and responsive design.",
        image: "/joonbug.png",
        link: "https://joonbug.com"
    },
    {
        id: 2,
        title: "LendSwift",
        description: "A lending platform that modernizes the loan application process. Developed using Next.js & Styled Components, with a focus on secure user authentication and seamless data handling.",
        image: "/lendswift.png",
        link: "https://lendswift.com"
    },
    {
        id: 3,
        title: "Union Square Financial",
        description: "A personal lending platform built with Next.js and Tailwind CSS, integrated with Contentful CMS and PostgreSQL database.",
        image: "/unionsquare.png",
        link: "https://unionsquarefinancial.com"
    },
    {
        id: 4,
        title: "Crave Ticket Resellers",
        description: "A dynamic website for event ticket resellers built with Next.js and Tailwind CSS.",
        image: "/resellers.png",
        link: "https://lauranye25.cravetickets.com"
    }

];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background transition-colors duration-700">
            {/* Theme Toggle in corner */}
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            {/* Hero Section */}
            <section className="h-screen flex flex-col justify-center items-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
                    <div className="z-10 text-center space-y-6 px-4">
                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-800 via-primary to-sky-800 animate-flow bg-[length:200%_auto]">
                            Colin Nies
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground ">
                            Frontend Developer & Product Designer
                        </p>
                        <div className="text-lg text-muted-foreground max-w-xl">
                            <p>Currently pursuing my Master's in Product Design,</p>
                            <p>crafting user-centered digital experiences</p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <Link href="https://github.com/colnies" target="_blank" rel="noopener noreferrer" aria-label="View GitHub profile">
                                <Button variant="outline" size="icon" aria-label="Github Button">
                                    <Github className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="https://linkedin.com/in/colin-nies" target="_blank" rel="noopener noreferrer" aria-label="View LinkedIn profile">
                                <Button variant="outline" size="icon" aria-label="LinkedIn Button">
                                    <Linkedin className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="mailto:contact@colinnies.dev" target="_blank" rel="noopener noreferrer" aria-label="Email Link">
                                <Button variant="outline" size="icon" aria-label="Email Button">
                                    <Mail className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                        <Link href="#projects">
                            <Button className="mt-8 bg-gradient-to-r from-teal-800 via-primary to-sky-800 animate-flow bg-[length:200%_auto]">View My Work</Button>
                        </Link>
                    </div>
            </section>

            {/* Skills Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <AnimatedSection>
                        <h2 className="text-3xl font-bold text-center mb-12">What I Do</h2>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Layout className="h-6 w-6 text-primary" />,
                                title: "Frontend Development",
                                description: "Building responsive, intuitive web applications with React, Next.js, and modern design systems."
                            },
                            {
                                icon: <Palette className="h-6 w-6 text-primary" />,
                                title: "Product Design",
                                description: "Creating user-centered designs with a focus on usability, accessibility, and delightful interactions."
                            },
                            {
                                icon: <Lightbulb className="h-6 w-6 text-primary" />,
                                title: "UX Research",
                                description: "Conducting user research and translating insights into meaningful product improvements."
                            }
                        ].map((skill, index) => (
                            <AnimatedSection key={index} className="delay-[100ms]">
                                <Card className="bg-card hover:shadow-lg transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                                            {skill.icon}
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2">{skill.title}</h3>
                                        <p className="text-muted-foreground">
                                            {skill.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section id="projects" className="py-20 px-4 bg-muted/50">
                <div className="max-w-6xl mx-auto">
                    <AnimatedSection>
                        <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
                        {projects.map((project, index) => (
                            <AnimatedSection key={project.id}>
                                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                                    <CardContent className="p-0 flex flex-col h-full">
                                        <Image 
                                            src={project.image} 
                                            alt={project.title}
                                            width={400}
                                            height={200}
                                            className="w-full h-48 object-cover shrink-0"
                                            loading={index === 0 ? "eager" : "lazy"}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                                            <p className="text-muted-foreground flex-grow">
                                                {project.description}
                                            </p>
                                            <div className="mt-4">
                                                <Link href={project.link} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="outline" size="sm">
                                                        View Project <ExternalLink className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-4">
                <AnimatedSection className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
                    <p className="text-muted-foreground mb-8">
                        I'm always interested in hearing about new projects and opportunities.
                    </p>
                    <Link href="mailto:contact@colinnies.dev" target="_blank" rel="noopener noreferrer">
                        <Button>
                            Get In Touch <Mail className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </AnimatedSection>
            </section>
        </div>
    );
}