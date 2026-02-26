# Colin Nies Portfolio

A modern, interactive portfolio website built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Interactive Binary Puzzle** — A 4x4 binary puzzle gate that unlocks the project showcase
- **Slot Machine Text Effect** — Animated character-cycling text transitions
- **Featured Projects Carousel** — Auto-playing, keyboard-navigable image carousel with drag/swipe support
- **Animated Wave Background** — Particle-based wave effect, performance-optimized for mobile
- **Dark/Light Theme** — System-aware theme toggle with localStorage persistence
- **GitHub Activity Calendar** — Live contribution graph integration
- **Responsive Design** — Mobile-first layout across all components

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (build tool & dev server)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [Lucide Icons](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/colnies/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build    # TypeScript check + Vite build
npm run preview  # Preview the production build locally
```

## Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── BinaryPuzzle.tsx # Interactive puzzle unlock
│   │   ├── SlotMachine.tsx  # Animated text effect
│   │   ├── FeaturedProjects.tsx # Project carousel
│   │   ├── gentle-wave.tsx  # Particle wave background
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles + Tailwind
├── public/
│   ├── fonts/               # Custom fonts
│   ├── images/              # Project screenshots
│   └── ...                  # SVG assets, robots.txt, sitemap.xml
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## License

MIT License — feel free to use this project as a template for your own portfolio!
