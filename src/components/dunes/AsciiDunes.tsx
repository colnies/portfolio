import { useEffect, useRef, type ReactNode } from "react";
import { buildScene, type Hole, type Material } from "./scene";

const FONT_SIZE = 12;
const LINE_HEIGHT = 14;
const FPS = 6; // ASCII only needs a few frames a second; more just flickers
const INK_INSET = 3; // px of line box above and below the overlaid text's glyphs
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
 * bottom-aligned so the sand always meets the page edge and any spare
 * height becomes sky. Children are laid over the scene, and any of them
 * marked `data-dune-clear` get the characters behind them knocked out.
 */
export function AsciiDunes({ children }: { children?: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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
    let holes: Hole[] = [];

    const gridLeft = () => (width - cols * charWidth) / 2;
    const gridTop = () => height - rows * LINE_HEIGHT;

    const measureHoles = () => {
      const overlay = overlayRef.current;
      if (!overlay || !charWidth) return;
      const base = canvas.getBoundingClientRect();
      const left = base.left + gridLeft();
      const top = base.top + gridTop();

      holes = Array.from(
        overlay.querySelectorAll<HTMLElement>("[data-dune-clear]")
      ).map((el) => {
        const r = el.getBoundingClientRect();
        // The line box is taller than the glyphs, so trim to the ink and
        // snap to the nearest row edges; a single line clears one row
        const r0 = Math.round((r.top + INK_INSET - top) / LINE_HEIGHT);
        const r1 = Math.round((r.bottom - INK_INSET - top) / LINE_HEIGHT) - 1;
        return {
          c0: Math.floor((r.left - left) / charWidth),
          c1: Math.ceil((r.right - left) / charWidth) - 1,
          r0,
          r1: Math.max(r0, r1),
        };
      });
    };

    const render = () => {
      if (!ready || !cols || !rows) return;

      ctx.clearRect(0, 0, width, height);
      ctx.font = FONT;
      ctx.textBaseline = "top";

      const cells = buildScene(cols, rows, time, holes);
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
      measureHoles();
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
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />
      <div ref={overlayRef} className="absolute inset-0">
        {children}
      </div>
    </>
  );
}
