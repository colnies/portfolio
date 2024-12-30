import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, ExternalLink, Layout, Lightbulb, Palette } from "lucide-react";
import Link from 'next/link';
import { Metadata } from 'next';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Colin Nies - Frontend Developer & Product Designer',
    description: 'Portfolio of Colin Nies - Frontend Developer and Product Designer specializing in user-centered digital experiences',
    openGraph: {
        title: 'Colin Nies - Frontend Developer & Product Designer',
        description: 'Portfolio of Colin Nies - Frontend Developer and Product Designer specializing in user-centered digital experiences',
        url: 'https://yourwebsite.com',
        siteName: 'Colin Nies Portfolio',
        images: [
            {
                url: '/main-logo.png',
                width: 1200,
                height: 630,
            }
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Colin Nies - Frontend Developer & Product Designer',
        description: 'Portfolio of Colin Nies - Frontend Developer and Product Designer specializing in user-centered digital experiences',
        images: ['https://yourwebsite.com/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: '/Favicon-32x32.svg',
    },
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-800 via-white to-sky-800 animate-flow bg-[length:200%_auto]">
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
                        <Link href="mailto:colin.nies6@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email Link">
                            <Button variant="outline" size="icon" aria-label="Email Button">
                                <Mail className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                    <Link href="#projects">
                        <Button className="mt-8">View My Work</Button>
                    </Link>
                </div>
            </section>

            {/* Skills Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">What I Do</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-card hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                                    <Layout className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Frontend Development</h3>
                                <p className="text-muted-foreground">
                                    Building responsive, intuitive web applications with React, Next.js, and modern design systems.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                                    <Palette className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Product Design</h3>
                                <p className="text-muted-foreground">
                                    Creating user-centered designs with a focus on usability, accessibility, and delightful interactions.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                                    <Lightbulb className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">UX Research</h3>
                                <p className="text-muted-foreground">
                                    Conducting user research and translating insights into meaningful product improvements.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section id="projects" className="py-20 px-4 bg-muted/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
                        {projects.map((project, index) => (
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
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
                    <p className="text-muted-foreground mb-8">
                        I'm always interested in hearing about new projects and opportunities.
                    </p>
                    <Link href="mailto:colin.nies6@gmail.com" target="_blank" rel="noopener noreferrer">
                        <Button>
                            Get In Touch <Mail className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}