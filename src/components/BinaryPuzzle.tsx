"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check, X } from "lucide-react";

interface Cell {
  value: 0 | 1 | null;
  locked: boolean;
  animationPhase: number;
}

type Grid = Cell[][];

// Pre-made puzzles with solutions (4x4 - easier)
const PUZZLES = [
  {
    initial: [
      [1, null, null, 0],
      [null, 0, null, null],
      [null, null, 1, null],
      [0, null, null, 1],
    ],
    solution: [
      [1, 1, 0, 0],
      [1, 0, 0, 1],
      [0, 0, 1, 1],
      [0, 1, 1, 0],
    ],
  },
  {
    initial: [
      [null, 1, null, null],
      [0, null, null, 1],
      [null, null, 0, null],
      [null, 0, null, null],
    ],
    solution: [
      [0, 1, 1, 0],
      [0, 0, 1, 1],
      [1, 1, 0, 0],
      [1, 0, 0, 1],
    ],
  },
  {
    initial: [
      [null, null, 1, null],
      [1, null, null, 0],
      [null, 1, null, null],
      [null, null, 0, null],
    ],
    solution: [
      [0, 0, 1, 1],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
    ],
  },
  {
    initial: [
      [null, 0, null, 1],
      [null, null, 1, null],
      [1, null, null, null],
      [null, 1, null, 0],
    ],
    solution: [
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [1, 1, 0, 0],
    ],
  },
];

interface BinaryPuzzleProps {
  onComplete: () => void;
}

export function BinaryPuzzle({ onComplete }: BinaryPuzzleProps) {
  const [grid, setGrid] = useState<Grid>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [showRules, setShowRules] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Initialize puzzle
  useEffect(() => {
    const puzzleIndex = Math.floor(Math.random() * PUZZLES.length);
    const puzzle = PUZZLES[puzzleIndex];

    const initialGrid: Grid = puzzle.initial.map((row) =>
      row.map((value) => ({
        value: value as 0 | 1 | null,
        locked: value !== null,
        animationPhase: 0,
      }))
    );

    setGrid(initialGrid);
  }, []);

  // RAF loop for smooth animations - only runs when needed
  const animate = useCallback((time: number) => {
    if (time - lastTimeRef.current > 16) { // ~60fps
      lastTimeRef.current = time;

      setGrid((prevGrid) => {
        let hasChanges = false;
        const newGrid = prevGrid.map((row) =>
          row.map((cell) => {
            if (cell.animationPhase > 0 && cell.animationPhase < 1) {
              hasChanges = true;
              return { ...cell, animationPhase: Math.min(cell.animationPhase + 0.1, 1) };
            }
            return cell;
          })
        );

        // Stop animation loop if no more changes needed
        if (!hasChanges) {
          setIsAnimating(false);
        }

        return hasChanges ? newGrid : prevGrid;
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Only run RAF loop when animating
  useEffect(() => {
    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isAnimating]);

  // Check for rule violations
  const checkErrors = useCallback((currentGrid: Grid): Set<string> => {
    const newErrors = new Set<string>();
    const size = currentGrid.length;

    // Check rows
    for (let row = 0; row < size; row++) {
      // Check for 3+ consecutive
      for (let col = 0; col < size - 2; col++) {
        const v1 = currentGrid[row][col].value;
        const v2 = currentGrid[row][col + 1].value;
        const v3 = currentGrid[row][col + 2].value;
        if (v1 !== null && v1 === v2 && v2 === v3) {
          newErrors.add(`${row}-${col}`);
          newErrors.add(`${row}-${col + 1}`);
          newErrors.add(`${row}-${col + 2}`);
        }
      }

      // Check count (only when row is full)
      const rowValues = currentGrid[row].map((c) => c.value).filter((v) => v !== null);
      if (rowValues.length === size) {
        const ones = rowValues.filter((v) => v === 1).length;
        if (ones !== size / 2) {
          for (let col = 0; col < size; col++) {
            newErrors.add(`${row}-${col}`);
          }
        }
      }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      // Check for 3+ consecutive
      for (let row = 0; row < size - 2; row++) {
        const v1 = currentGrid[row][col].value;
        const v2 = currentGrid[row + 1][col].value;
        const v3 = currentGrid[row + 2][col].value;
        if (v1 !== null && v1 === v2 && v2 === v3) {
          newErrors.add(`${row}-${col}`);
          newErrors.add(`${row + 1}-${col}`);
          newErrors.add(`${row + 2}-${col}`);
        }
      }

      // Check count (only when column is full)
      const colValues = currentGrid.map((r) => r[col].value).filter((v) => v !== null);
      if (colValues.length === size) {
        const ones = colValues.filter((v) => v === 1).length;
        if (ones !== size / 2) {
          for (let row = 0; row < size; row++) {
            newErrors.add(`${row}-${col}`);
          }
        }
      }
    }

    return newErrors;
  }, []);

  // Check if puzzle is complete (all cells filled)
  const checkComplete = useCallback((currentGrid: Grid): boolean => {
    for (let row = 0; row < currentGrid.length; row++) {
      for (let col = 0; col < currentGrid[row].length; col++) {
        if (currentGrid[row][col].value === null) {
          return false;
        }
      }
    }
    return true;
  }, []);

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].locked || isComplete) return;

    // Start animation loop
    setIsAnimating(true);

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r, ri) =>
        r.map((cell, ci) => {
          if (ri === row && ci === col) {
            // Cycle: null -> 0 -> 1 -> null
            let newValue: 0 | 1 | null;
            if (cell.value === null) newValue = 0;
            else if (cell.value === 0) newValue = 1;
            else newValue = null;

            return { ...cell, value: newValue, animationPhase: 0.1 };
          }
          return cell;
        })
      );

      const newErrors = checkErrors(newGrid);
      setErrors(newErrors);

      if (newErrors.size === 0 && checkComplete(newGrid)) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 1500);
      }

      return newGrid;
    });
  };

  // Reset puzzle
  const handleReset = () => {
    const puzzleIndex = Math.floor(Math.random() * PUZZLES.length);
    const puzzle = PUZZLES[puzzleIndex];

    const initialGrid: Grid = puzzle.initial.map((row) =>
      row.map((value) => ({
        value: value as 0 | 1 | null,
        locked: value !== null,
        animationPhase: 0,
      }))
    );

    setGrid(initialGrid);
    setErrors(new Set());
    setIsComplete(false);
  };

  if (grid.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Unlock Projects</h2>
        <p className="text-muted-foreground">Solve the binary puzzle to continue</p>
      </motion.div>

      {/* Rules toggle */}
      <motion.button
        onClick={() => setShowRules(!showRules)}
        className="text-sm text-muted-foreground hover:text-foreground mb-4 underline underline-offset-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {showRules ? "Hide rules" : "Show rules"}
      </motion.button>

      {/* Rules */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 text-sm text-muted-foreground max-w-sm text-center overflow-hidden"
          >
            <p className="mb-1">Fill the grid with 0s and 1s:</p>
            <ul className="list-disc list-inside text-left inline-block">
              <li>No more than 2 of the same number in a row</li>
              <li>Each row and column must have equal 0s and 1s</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puzzle grid */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid gap-1.5 p-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1.5">
              {row.map((cell, colIndex) => {
                const hasError = errors.has(`${rowIndex}-${colIndex}`);
                const scale = 1 + (cell.animationPhase > 0 ? Math.sin(cell.animationPhase * Math.PI) * 0.1 : 0);

                return (
                  <motion.button
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    disabled={cell.locked || isComplete}
                    className={`
                      w-10 h-10 md:w-12 md:h-12 rounded-lg font-mono text-lg font-bold
                      flex items-center justify-center transition-colors duration-200
                      ${cell.locked
                        ? "bg-muted/80 text-foreground cursor-default"
                        : cell.value !== null
                          ? "bg-primary/20 text-foreground hover:bg-primary/30 cursor-pointer"
                          : "bg-background hover:bg-muted/50 cursor-pointer border border-border/50"
                      }
                      ${hasError ? "!bg-destructive/20 !text-destructive" : ""}
                      ${isComplete ? "!bg-green-500/20 !text-green-600 dark:!text-green-400" : ""}
                    `}
                    style={{ transform: `scale(${scale})` }}
                    whileTap={{ scale: cell.locked ? 1 : 0.95 }}
                  >
                    {cell.value !== null ? cell.value : ""}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Complete overlay */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="flex items-center gap-2 text-green-600 dark:text-green-400"
              >
                <Check className="w-8 h-8" />
                <span className="text-xl font-bold">Solved!</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Reset button */}
      <motion.button
        onClick={handleReset}
        className="mt-6 flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RotateCcw className="w-4 h-4" />
        New puzzle
      </motion.button>

      {/* Error indicator */}
      <AnimatePresence>
        {errors.size > 0 && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 flex items-center gap-2 text-sm text-destructive"
          >
            <X className="w-4 h-4" />
            <span>Rule violation detected</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
