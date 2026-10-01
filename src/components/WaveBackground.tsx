import { useEffect, useRef } from "react";

interface Layer {
  baseline: number; // fraction of canvas height
  spacing: number;
  radius: number;
  alpha: number;
  speed: number; // px/s of the primary swell
  // Primary swell travels right, a shorter chop travels left against it
  k1: number;
  amp1: number;
  omega1: number;
  k2: number;
  amp2: number;
  omega2: number;
  phase: number;
  spray: boolean;
}

interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  radius: number;
}

const MOBILE_BREAKPOINT = 768;
const TAU = Math.PI * 2;
const INTRO_SECONDS = 1.6;
// Gerstner steepness: dots bunch up at crests and spread in troughs.
// Combined value must stay below 1 or the surface loops over itself.
const STEEPNESS_SWELL = 0.55;
const STEEPNESS_CHOP = 0.2;
const SPRAY_RATE = 4; // spawn chance per crest dot per second
const MAX_DROPLETS = 160;
const GRAVITY = 70;

function createLayers(isMobile: boolean): Layer[] {
  const count = isMobile ? 4 : 5;

  return Array.from({ length: count }, (_, i) => {
    const depth = i / (count - 1); // 0 = far, 1 = near
    const wavelength = 260 + depth * 260;
    const speed = 22 + depth * 26;
    const k1 = TAU / wavelength;
    const k2 = k1 * 2.3;

    return {
      baseline: 0.56 + depth * 0.2,
      spacing: (isMobile ? 14 : 11) + depth * 4,
      radius: 0.6 + depth * 0.8,
      alpha: 0.25 + depth * 0.55,
      speed,
      k1,
      amp1: 5 + depth * 15,
      omega1: k1 * speed,
      k2,
      amp2: 1.5 + depth * 4,
      omega2: -k2 * speed * 0.45,
      phase: Math.random() * TAU,
      spray: depth > 0.6,
    };
  });
}

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const color = `hsl(${getComputedStyle(document.documentElement)
      .getPropertyValue("--muted-foreground")
      .trim()})`;

    let width = 0;
    let height = 0;
    let isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    let layers = createLayers(isMobile);
    const droplets: Droplet[] = [];
    let time = 0;
    let intro = reduceMotion ? 1 : 0;
    let frame = 0;
    let last = 0;

    const render = (dt: number) => {
      time += dt;
      if (intro < 1) intro = Math.min(1, intro + dt / INTRO_SECONDS);
      const fade = intro * intro * (3 - 2 * intro);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      for (const layer of layers) {
        const baseY = layer.baseline * height;
        // Dots get displaced sideways, so draw past both edges
        const reach = STEEPNESS_SWELL / layer.k1 + layer.spacing;
        let i = 0;

        for (let x0 = -reach; x0 < width + reach; x0 += layer.spacing, i++) {
          const theta1 = layer.k1 * x0 - layer.omega1 * time + layer.phase;
          const theta2 =
            layer.k2 * x0 - layer.omega2 * time + layer.phase * 1.7;
          // Slow amplitude envelope so the swell arrives in sets
          const envelope =
            0.7 + 0.3 * Math.sin(x0 * 0.0021 + time * 0.08 + layer.phase);
          const cos1 = Math.cos(theta1);

          const x =
            x0 -
            (STEEPNESS_SWELL / layer.k1) * Math.sin(theta1) -
            (STEEPNESS_CHOP / layer.k2) * Math.sin(theta2);
          const y =
            baseY -
            layer.amp1 * envelope * cos1 -
            layer.amp2 * Math.cos(theta2);

          const crest = Math.pow(Math.max(0, cos1), 6) * envelope;
          const twinkle = 0.8 + 0.2 * Math.sin(time * 1.6 + i * 2.399);

          ctx.globalAlpha = layer.alpha * (0.5 + 0.5 * crest) * twinkle * fade;
          ctx.beginPath();
          ctx.arc(x, y, layer.radius * (1 + 0.4 * crest), 0, TAU);
          ctx.fill();

          if (
            layer.spray &&
            cos1 > 0.985 &&
            droplets.length < MAX_DROPLETS &&
            Math.random() < SPRAY_RATE * envelope * dt
          ) {
            droplets.push({
              x,
              y,
              vx: layer.speed * (0.4 + Math.random() * 0.8),
              vy: -(20 + Math.random() * 40),
              age: 0,
              life: 0.8 + Math.random(),
              radius: 0.4 + Math.random() * 0.8,
            });
          }
        }
      }

      for (let d = droplets.length - 1; d >= 0; d--) {
        const p = droplets[d];
        p.age += dt;
        if (p.age >= p.life) {
          droplets[d] = droplets[droplets.length - 1];
          droplets.pop();
          continue;
        }

        p.vy += GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const remaining = 1 - p.age / p.life;
        ctx.globalAlpha = 0.5 * remaining * remaining * fade;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, TAU);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      // Clamp so returning to the tab doesn't fast-forward the sea
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      render(dt);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || reduceMotion) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const resizeObserver = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nextIsMobile = width < MOBILE_BREAKPOINT;
      if (nextIsMobile !== isMobile) {
        isMobile = nextIsMobile;
        layers = createLayers(isMobile);
      }

      if (reduceMotion) render(0);
    });

    // Pause once the hero has scrolled out of view
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} aria-hidden className="block h-screen w-full" />
    </div>
  );
}
