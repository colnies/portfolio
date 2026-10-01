import { createRoot, hydrateRoot } from "react-dom/client";
import { Root } from "./Root";
import "./index.css";

const container = document.getElementById("root")!;

// Production builds ship prerendered HTML (scripts/prerender.js) to hydrate;
// the dev server serves an empty root.
if (container.firstElementChild) {
  hydrateRoot(container, <Root />);
} else {
  createRoot(container).render(<Root />);
}
