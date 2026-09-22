export interface Project {
  title: string;
  tags: string[];
  link: string;
}

export const projects: Project[] = [
  {
    title: "Drift",
    tags: ["Python", "FastAPI", "PostgreSQL", "React"],
    link: "https://drift-indol-two.vercel.app/",
  },
  {
    title: "Sleep Detective",
    tags: ["Python"],
    link: "https://github.com/colnies/sleep-detective",
  },
  {
    title: "Skybreak Events",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    link: "https://skybreakevents.com",
  },
  {
    title: "LendSwift",
    tags: ["Next.js", "Styled Components"],
    link: "https://lendswift.com",
  },
  {
    title: "Louie the Corgi",
    tags: ["HTML", "TypeScript", "CSS"],
    link: "https://colnies.github.io/louie-the-corgi/index.html",
  },
  {
    title: "Lindy Promotions",
    tags: ["Next.js", "TypeScript", "Tailwind", "Firebase"],
    link: "https://lindypromo.com",
  },
];
