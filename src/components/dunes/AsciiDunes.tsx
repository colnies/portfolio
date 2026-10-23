import { useEffect, useRef } from "react";
import { buildScene, type Material } from "./scene";

const FONT_SIZE = 12;
const LINE_HEIGHT = 14;
const FPS = 6; // ASCII only needs a few frames a second; more just flickers
const FONT = `${FONT_SIZE}px "DejaVu Sans Mono", ui-monospace, Menlo, Consolas, monospace`;

const COLORS: Record<Material, string> = {
  cloud: "hsl(210 40% 90%)",
  grass: "hsl(140 30% 52%)",
  sand: "#FAE8B4",
  wet: "hsl(300 12% 62%)",
  wrack: "hsl(25 25% 50%)",
};

/**
 * Fills its parent with a procedurally drawn ASCII beach. The grid is
 * bottom-aligned so the sand always meets the bottom edge and any spare
 * height becomes sky.
 */
export function AsciiDunes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let charWidth = 0;
    let ready = false; // the monospace font is loaded and measured
    let disposed = false;
    let time = 0;
    let frame = 0;
    let last = 0;
    let lastDraw = 0;

    const gridLeft = () => (width - cols * charWidth) / 2;
    const gridTop = () => height - rows * LINE_HEIGHT;

    const render = () => {
      if (!ready || !cols || !rows) return;

      ctx.clearRect(0, 0, width, height);
      ctx.font = FONT;
      ctx.textBaseline = "top";

      const cells = buildScene(cols, rows, time);
      const left = gridLeft();
      const top = gridTop() + (LINE_HEIGHT - FONT_SIZE) / 2;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (!cell) continue;
        const col = i % cols;
        const row = (i - col) / cols;

        ctx.globalAlpha = cell.alpha;
        ctx.fillStyle = COLORS[cell.material];
        ctx.fillText(cell.ch, left + col * charWidth, top + row * LINE_HEIGHT);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Resizing the backing store resets context state, so measure after
      ctx.font = FONT;
      charWidth = ctx.measureText("M").width;
      cols = Math.floor(width / charWidth);
      rows = Math.floor(height / LINE_HEIGHT);
      render();
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      // Clamp so returning to the tab doesn't fast-forward the clouds
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      time += dt;

      if (now - lastDraw < 1000 / FPS) return;
      lastDraw = now;
      render();
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

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);

    // Drawing with the fallback font would measure the wrong cell width
    const fontsReady: Promise<unknown> = document.fonts
      ? document.fonts.load(FONT)
      : Promise.resolve();
    fontsReady
      .catch(() => undefined)
      .then(() => {
        if (disposed) return;
        ready = true;
        resize();
      });

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 block h-full w-full"
    />
  );
}
