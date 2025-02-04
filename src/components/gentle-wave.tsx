"use client"
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const WaveBackground = () => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const [waveParticles, setWaveParticles] = useState<{
        id: number;
        initialX: number;
        initialY: number;
        size: number;
        delay: number;
        splashOffset: number;
    }[]>([]);

    const [surfaceParticles, setSurfaceParticles] = useState<{
        id: number;
        x: number;
        size: number;
        delay: number;
        baseOpacity: number;
    }[]>([]);
    
    useEffect(() => {
        // Wave particles
        const waveCount = 100;
        const particleSpacing = 20; // Space between wave particles
        const totalWidth = waveCount * particleSpacing; // Total width covered by waves
        const newWaveParticles = [];
        
        for (let i = 0; i < waveCount; i++) {
            newWaveParticles.push({
                id: i,
                initialX: (i * particleSpacing),
                initialY: Math.random() * -200,
                size: 1 + Math.random() * 2,
                delay: Math.random() * 0.3,
                splashOffset: (Math.random() * 30) - 15
            });
        }
        
        // Surface particles
        const surfaceCount = 350;
        const newSurfaceParticles = [];
        
        for (let i = 0; i < surfaceCount; i++) {
            newSurfaceParticles.push({
                id: i,
                x: Math.random() * totalWidth,// Distribute across the same width as wave particles
                size: 0.8 + Math.random() * 2,
                delay: Math.random() * 2,
                baseOpacity: 0.1 + Math.random() * 0.2
            });
        }
        
        setWaveParticles(newWaveParticles);
        setSurfaceParticles(newSurfaceParticles);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="relative w-screen h-screen">
                {/* Surface particles */}
                {surfaceParticles.map((particle) => (
                    <motion.div
                        key={`surface-${particle.id}`}
                        className="rounded-full"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: 'currentColor',
                            x: particle.x,
                            top: '80%', // Same vertical position as wave particles
                        }}
                        animate={{
                            opacity: [
                                particle.baseOpacity,
                                particle.baseOpacity * 1.5,
                                particle.baseOpacity
                            ],
                            y: [
                                -2,
                                2,
                                -2
                            ]
                        }}
                        transition={{
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: particle.delay
                        }}
                    />
                ))}

                {/* Wave particles */}
                {waveParticles.map((particle) => (
                    <motion.div
                        key={`wave-${particle.id}`}
                        className="absolute rounded-full text-muted-foreground"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: 'currentColor',
                            x: particle.initialX,
                            top: '60%',
                            opacity: 0.1
                        }}
                        animate={{
                            y: [
                                particle.initialY,
                                particle.initialY + 10 + particle.splashOffset, // Hold position during fade in
                                10 + particle.splashOffset,
                                50 + particle.splashOffset,
                                100 + particle.splashOffset,
                                200 + particle.splashOffset
                            ],
                            x: [
                                particle.initialX,
                                particle.initialX, // Hold position during fade in
                                particle.initialX,
                                particle.initialX + (Math.random() * 10 - 5), // Immediate random spread
                                particle.initialX + (particle.splashOffset * 0.3),
                                particle.initialX + particle.splashOffset
                            ],
                            opacity: isDark ? [
                                0,
                                0.5,
                                0.5,
                                0.5,
                                0.6,
                                0.4,
                                0
                            ] : [
                                0,
                                0.8,
                                0.8,
                                0.8,
                                0.9,
                                0.7,
                                0
                            ],
                            scale: [
                                1,
                                1,
                                1,
                                1,
                                1.2,
                                0.8,
                                0.5
                            ]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.15, 0.4, 0.5, 0.7, 0.85, 1],
                            delay: particle.delay * 2
                        }}
                    />
                ))}
            </div>
        </div>
    );
};