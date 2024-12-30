"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const isDark = theme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`
                relative h-7 w-14 rounded-full p-1
                transition-all duration-700
                ${isDark ? 'bg-slate-700' : 'bg-slate-300'}
            `}
            aria-label="Toggle theme"
        >
            <div
                className={`
                    flex h-5 w-5 items-center justify-center rounded-full 
                    bg-white shadow-md
                    transition-transform duration-700
                    ${isDark ? 'translate-x-7' : 'translate-x-0'}
                `}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    <Sun 
                        className={`
                            absolute h-3 w-3 text-yellow-500
                            transition-all duration-700
                            ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                        `}
                    />
                    <Moon 
                        className={`
                            absolute h-3 w-3 text-slate-800
                            transition-all duration-700
                            ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                        `}
                    />
                </div>
            </div>
        </button>
    )
}