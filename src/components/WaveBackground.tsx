import { motion } from "framer-motion";
import { useState } from "react";

interface WaveParticle {
  id: number;
  initialX: number;
  initialY: number;
  size: number;
  delay: number;
  splashOffset: number;
  drift: number;
}

interface SurfaceParticle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  baseOpacity: number;
}

const PARTICLE_SPACING = 20;
const MOBILE_BREAKPOINT = 768;

function createParticles() {
  // Fewer particles on small screens keeps the animation smooth
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const waveCount = isMobile ? 50 : 100;
  const surfaceCount = isMobile ? 150 : 350;
  const totalWidth = waveCount * PARTICLE_SPACING;

  const wave: WaveParticle[] = Array.from({ length: waveCount }, (_, i) => ({
    id: i,
    initialX: i * PARTICLE_SPACING,
    initialY: Math.random() * -200,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 0.3,
    splashOffset: Math.random() * 30 - 15,
    drift: Math.random() * 10 - 5,
  }));

  const surface: SurfaceParticle[] = Array.from(
    { length: surfaceCount },
    (_, i) => ({
      id: i,
      x: Math.random() * totalWidth,
      size: 0.8 + Math.random() * 2,
      delay: Math.random() * 2,
      duration: 2 + Math.random(),
      baseOpacity: 0.1 + Math.random() * 0.2,
    })
  );

  return { wave, surface };
}

export function WaveBackground() {
  const [{ wave, surface }] = useState(createParticles);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="relative h-screen w-screen">
        {surface.map((p) => (
          <motion.div
            key={`surface-${p.id}`}
            className="rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: "currentColor",
              x: p.x,
              top: "80%",
            }}
            animate={{
              opacity: [p.baseOpacity, p.baseOpacity * 1.5, p.baseOpacity],
              y: [-2, 2, -2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

        {wave.map((p) => (
          <motion.div
            key={`wave-${p.id}`}
            className="absolute rounded-full text-muted-foreground"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: "currentColor",
              x: p.initialX,
              top: "60%",
              opacity: 0.1,
            }}
            animate={{
              y: [
                p.initialY,
                p.initialY + 10 + p.splashOffset,
                10 + p.splashOffset,
                50 + p.splashOffset,
                100 + p.splashOffset,
                200 + p.splashOffset,
              ],
              x: [
                p.initialX,
                p.initialX,
                p.initialX,
                p.initialX + p.drift,
                p.initialX + p.splashOffset * 0.3,
                p.initialX + p.splashOffset,
              ],
              opacity: [0, 0.5, 0.5, 0.5, 0.6, 0.4, 0],
              scale: [1, 1, 1, 1, 1.2, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.15, 0.4, 0.5, 0.7, 0.85, 1],
              delay: p.delay * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
