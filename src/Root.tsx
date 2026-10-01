import { StrictMode } from "react";
import { MotionConfig } from "framer-motion";
import App from "./App";

/** Shared by the browser entry and the build-time prerender. */
export function Root() {
  return (
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </StrictMode>
  );
}
