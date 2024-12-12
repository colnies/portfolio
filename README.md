# Colin Nies Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Responsive design that works on all devices
- Dark/light theme support
- Smooth scrolling navigation
- Project showcase section
- Contact information and social links
- Built with modern tech stack:
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Lucide icons

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/colnies/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   └── [shadcn components]
│   └── theme-toggle.tsx
├── public/
│   └── [images and assets]
├── styles/
│   └── globals.css
└── [config files]
```

## Customization

1. Update the metadata in `page.tsx` with your information
2. Replace project images in the `public` directory
3. Modify the `projects` array in `page.tsx` with your own projects
4. Update social links and contact information

## License

MIT License - feel free to use this project as a template for your own portfolio!