"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface SlotMachineProps {
  text: string;
  className?: string;
  every?: number;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface SlotState {
  char: string;
  isSpinning: boolean;
  key: number;
}

export function SlotMachine({
  text,
  className = "",
  every = 8000
}: SlotMachineProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [slots, setSlots] = useState<SlotState[]>(
    text.split("").map((char, i) => ({ char, isSpinning: false, key: i }))
  );
  const isAnimatingRef = useRef(false);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const keyCounterRef = useRef(text.length);

  useEffect(() => {
    if (!isInView) return;

    const runAnimation = () => {
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      const letters = text.split("");
      const iterations = 12;
      const intervalTime = 60;

      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];

      letters.forEach((targetLetter, letterIndex) => {
        const letterDelay = letterIndex * 150;

        setTimeout(() => {
          // Start spinning
          setSlots((prev) => {
            const newSlots = [...prev];
            newSlots[letterIndex] = { ...newSlots[letterIndex], isSpinning: true };
            return newSlots;
          });

          let count = 0;

          const letterInterval = setInterval(() => {
            count++;

            if (count <= iterations) {
              const newChar = characters[Math.floor(Math.random() * characters.length)];
              keyCounterRef.current++;
              setSlots((prev) => {
                const newSlots = [...prev];
                newSlots[letterIndex] = {
                  char: newChar,
                  isSpinning: true,
                  key: keyCounterRef.current
                };
                return newSlots;
              });
            } else {
              keyCounterRef.current++;
              setSlots((prev) => {
                const newSlots = [...prev];
                newSlots[letterIndex] = {
                  char: targetLetter,
                  isSpinning: false,
                  key: keyCounterRef.current
                };
                return newSlots;
              });
              clearInterval(letterInterval);

              if (letterIndex === letters.length - 1) {
                setTimeout(() => {
                  isAnimatingRef.current = false;
                }, 100);
              }
            }
          }, intervalTime);

          intervalsRef.current.push(letterInterval);
        }, letterDelay);
      });
    };

    runAnimation();
    const loopInterval = setInterval(runAnimation, every);

    return () => {
      clearInterval(loopInterval);
      intervalsRef.current.forEach(clearInterval);
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
