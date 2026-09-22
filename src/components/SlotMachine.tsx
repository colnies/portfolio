import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface SlotMachineProps {
  text: string;
  className?: string;
  /** How often the spin replays, in milliseconds */
  every?: number;
}

interface Slot {
  char: string;
  isSpinning: boolean;
  /** Changes on every character swap so AnimatePresence re-animates */
  key: number;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SPINS_PER_LETTER = 12;
const SPIN_INTERVAL_MS = 60;
const LETTER_STAGGER_MS = 150;

const randomLetter = () =>
  ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

export function SlotMachine({
  text,
  className = "",
  every = 8000,
}: SlotMachineProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [slots, setSlots] = useState<Slot[]>(() =>
    text.split("").map((char, i) => ({ char, isSpinning: false, key: i }))
  );
  const isAnimatingRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const keyCounterRef = useRef(text.length);

  useEffect(() => {
    if (!isInView) return;

    const setSlot = (index: number, char: string, isSpinning: boolean) => {
      keyCounterRef.current += 1;
      const key = keyCounterRef.current;
      setSlots((prev) =>
        prev.map((slot, i) => (i === index ? { char, isSpinning, key } : slot))
      );
    };

    const clearTimers = () => {
      timersRef.current.forEach(clearInterval);
      timersRef.current = [];
    };

    const spin = () => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      clearTimers();

      const letters = text.split("");
      letters.forEach((target, index) => {
        const start = setTimeout(() => {
          let count = 0;
          const tick = setInterval(() => {
            count += 1;
            if (count <= SPINS_PER_LETTER) {
              setSlot(index, randomLetter(), true);
              return;
            }
            setSlot(index, target, false);
            clearInterval(tick);
            if (index === letters.length - 1) {
              setTimeout(() => {
                isAnimatingRef.current = false;
              }, 100);
            }
          }, SPIN_INTERVAL_MS);
          timersRef.current.push(tick);
        }, index * LETTER_STAGGER_MS);
        timersRef.current.push(start);
      });
    };

    spin();
    const loop = setInterval(spin, every);

    return () => {
      clearInterval(loop);
      clearTimers();
    };
  }, [isInView, every, text]);

  return (
    <span ref={ref} className={className}>
      {slots.map((slot, index) => (
        <AnimatePresence mode="popLayout" initial={false} key={index}>
          <motion.span
            key={slot.key}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{
              duration: slot.isSpinning ? 0.04 : 0.25,
              ease: slot.isSpinning ? "linear" : [0.34, 1.56, 0.64, 1],
            }}
            style={{
              display: "inline-block",
              minWidth: slot.char === " " ? "0.25em" : undefined,
            }}
          >
            {slot.char}
          </motion.span>
        </AnimatePresence>
      ))}
    </span>
  );
}
