export interface Project {
  title: string;
  /** One lowercase line shown beside the title */
  blurb: string;
  /** Bullets shown when the row is expanded; may be empty */
  details: string[];
  tags: string[];
  link: string;
}

export const projects: Project[] = [
  {
    title: "Surf Tracker",
    blurb: "a clip of every wave you caught",
    details: [
      "click on yourself once in a screen recording of a Surfline cam rewind, and SAM 3 tracks you through the session",
      "flags rides by a speed threshold and cuts each one into its own clip with ffmpeg",
    ],
    tags: ["Python", "PyTorch", "SAM 3", "ffmpeg"],
    link: "https://github.com/colnies/surf-tracker",
  },
  {
    title: "Hark",
    blurb: "big ears for your logs",
    details: [
      "reads Cloud Logging every five minutes, groups lines into templates with Drain3 and masks emails, tokens and IPs before anything is stored",
      "a model judges each new template once, so cost follows new patterns instead of log volume",
      "alerts Slack only for a new pattern or a steady one going quiet, plus a morning digest",
    ],
    tags: ["Python", "FastAPI", "Google Cloud", "Claude"],
    link: "https://hark-gcp.netlify.app/",
  },
  {
    title: "Alexa & Colin's Wedding",
    blurb: "travel guide and RSVP for a destination wedding",
    details: [
      "a static site with pages for getting there, where to stay and what to do, all fed from one content file",
      "an illustrated SVG map of the area, traced from OpenStreetMap, with numbered pins for the places it recommends",
    ],
    tags: ["Astro", "Tailwind", "Netlify Forms"],
    link: "https://acnieswedding.netlify.app/",
  },
  {
    title: "Drift",
    blurb: "know when your AI agents start behaving differently",
    details: [
      "a Python SDK traces each agent run with a decorator or context manager: task type, context, tool calls and tokens",
      "the backend checks new runs against a baseline with chi-squared and z-score tests, flagging goal, context, reasoning and collaboration drift",
      "a React dashboard shows agents, traces and drift trends, with alerts to Slack, email or a webhook",
    ],
    tags: ["Python", "FastAPI", "PostgreSQL", "React"],
    link: "https://drift-indol-two.vercel.app/",
  },
  {
    title: "Sleep Detective",
    blurb: "which habits go with better sleep",
    details: [
      "joins Fitbit sleep scores with a daily habit log: caffeine timing, exercise, magnesium, screen time",
      "writes a text report and six charts, and ships as Windows and macOS executables built by GitHub Actions",
    ],
    tags: ["Python"],
    link: "https://github.com/colnies/sleep-detective",
  },
  {
    title: "Skybreak Events",
    blurb: "curated nightlife across six East Coast cities",
    details: [
      "an events storefront with a page for each city and a detail page for every event",
      "shows ticket options and prices up front, then hands off to checkout",
    ],
    tags: ["Next.js", "TypeScript", "Tailwind"],
    link: "https://skybreakevents.com",
  },
  {
    title: "LendSwift",
    blurb: "personal loan startup",
    details: [
      "a multi-step application funnel: pre-qualification, personal and employment details, bank verification, ID upload and loan signing",
      "a customer dashboard for viewing the payment schedule, making payments, setting up autopay and managing bank accounts",
    ],
    tags: ["Next.js", "Styled Components"],
    link: "https://lendswift.com",
  },
  {
    title: "Louie the Corgi",
    blurb: "a rescue corgi's home page for senior dog adoption",
    details: [
      "tells Louie's story, then points visitors toward adopting, fostering or supporting a shelter",
      "previews his merch and links out to his social accounts",
    ],
    tags: ["HTML", "TypeScript", "CSS"],
    link: "https://colnies.github.io/louie-the-corgi/index.html",
  },
];
