import { useState, useEffect, useRef, useCallback } from "react";
import { prepareWithSegments, walkLineRanges, prepare, layout } from "@chenglou/pretext";
import type { PreparedTextWithSegments } from "@chenglou/pretext";

/**
 * Binary search for the tightest container width that keeps
 * the same line count as the full maxWidth.
 */
function findOptimalWidth(
  prepared: PreparedTextWithSegments,
  maxWidth: number
): number {
  let lineCountAtMax = 0;
  walkLineRanges(prepared, maxWidth, () => { lineCountAtMax++; });

  if (lineCountAtMax <= 1) return maxWidth;

  let lo = 0;
  let hi = maxWidth;

  while (hi - lo > 1) {
    const mid = (lo + hi) / 2;
    let count = 0;
    walkLineRanges(prepared, mid, () => { count++; });
    if (count <= lineCountAtMax) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  return Math.ceil(hi);
}

/**
 * Returns the optimal (tightest balanced) width for a text string.
 * Recalculates on resize.
 */
export function useBalancedText(
  text: string,
  font: string,
  maxWidth: number
): number | null {
  const [optimalWidth, setOptimalWidth] = useState<number | null>(null);
  const preparedRef = useRef<PreparedTextWithSegments | null>(null);

  useEffect(() => {
    preparedRef.current = prepareWithSegments(text, font);
  }, [text, font]);

  useEffect(() => {
    if (!preparedRef.current || maxWidth <= 0) return;
    const width = findOptimalWidth(preparedRef.current, maxWidth);
    setOptimalWidth(width);
  }, [maxWidth, text, font]);

  return optimalWidth;
}

/**
 * Checks whether a combined text string fits within a given width on one line.
 */
export function useTextFits(
  text: string,
  font: string,
  availableWidth: number,
  lineHeight: number = 24
): boolean {
  const [fits, setFits] = useState(true);

  useEffect(() => {
    if (availableWidth <= 0) return;
    const prepared = prepare(text, font);
    const result = layout(prepared, availableWidth, lineHeight);
    setFits(result.lineCount <= 1);
  }, [text, font, availableWidth, lineHeight]);

  return fits;
}

/**
 * Hook to track an element's width, debounced on resize.
 */
export function useContainerWidth<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  number
] {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  const measure = useCallback(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    measure();
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(measure, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [measure]);

  return [ref, width];
}
