import { cubicBezier, type Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: cubicBezier(0.17, 0.67, 0.83, 0.67) },
  },
};

export const staggerChildren = (stagger = 0.2): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger },
  },
});
