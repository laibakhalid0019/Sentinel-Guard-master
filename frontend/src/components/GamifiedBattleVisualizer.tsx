"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

interface Bullet {
    id: number;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    speed: number;
    team: "red" | "blue";
    color: string;
}

export default function GamifiedBattleVisualizer({ isRunning }: { isRunning: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [redHealth, setRedHealth] = useState(100);
    const [blueHealth, setBlueHealth] = useState(100);

    useEffect(() => {
        if (!isRunning) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 800;
        canvas.height = 400;

        let bullets: Bullet[] = [];
        let particles: Particle[] = [];
        let animationFrameId: number;
        let lastFireTimeRed = 0;
        let lastFireTimeBlue = 0;

        const createExplosion = (x: number, y: number, color: string) => {
            for (let i = 0; i < 15; i++) {
                particles.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 1.0,
                    color: color
                });
            }
        };

        const loop = (timestamp: number) => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Bases
            // Red Base
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#ef4444";
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(20, 150, 60, 100);
            ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
            ctx.fillRect(10, 140, 80, 120);

            // Blue Base
            ctx.shadowColor = "#3b82f6";
            ctx.fillStyle = "#3b82f6";
            ctx.fillRect(canvas.width - 80, 150, 60, 100);
            ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
            ctx.fillRect(canvas.width - 90, 140, 80, 120);
            ctx.shadowBlur = 0;

            // Fire Bullets
            if (timestamp - lastFireTimeRed > 200 + Math.random() * 300) {
                bullets.push({
                    id: Math.random(),
                    x: 80,
                    y: 160 + Math.random() * 80,
                    targetX: canvas.width - 80,
                    targetY: 160 + Math.random() * 80,
                    speed: 4 + Math.random() * 2,
                    team: "red",
                    color: "#ff0000"
                });
                lastFireTimeRed = timestamp;
            }

            if (timestamp - lastFireTimeBlue > 200 + Math.random() * 300) {
                bullets.push({
                    id: Math.random(),
                    x: canvas.width - 80,
                    y: 160 + Math.random() * 80,
                    targetX: 80,
                    targetY: 160 + Math.random() * 80,
                    speed: 4 + Math.random() * 2,
                    team: "blue",
                    color: "#0088ff"
                });
                lastFireTimeBlue = timestamp;
            }

            // Update & Draw Bullets
            for (let i = bullets.length - 1; i >= 0; i--) {
                const b = bullets[i];
                const dx = b.targetX - b.x;
                const dy = b.targetY - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < b.speed) {
                    // Hit target
                    createExplosion(b.x, b.y, b.color);
                    bullets.splice(i, 1);
                    if (b.team === "red") setBlueHealth(h => Math.max(0, h - 2));
                    else setRedHealth(h => Math.max(0, h - 2));
                    continue;
                }

                const angle = Math.atan2(dy, dx);
                b.x += Math.cos(angle) * b.speed;
                b.y += Math.sin(angle) * b.speed;

                // Collision with other bullets
                for (let j = bullets.length - 1; j >= 0; j--) {
                    if (i === j) continue;
                    const other = bullets[j];
                    if (b.team !== other.team) {
                        const distB = Math.sqrt((b.x - other.x) ** 2 + (b.y - other.y) ** 2);
                        if (distB < 10) {
                            createExplosion(b.x, b.y, "#ffffff"); // White explosion for mid-air collision
                            bullets.splice(Math.max(i, j), 1);
                            bullets.splice(Math.min(i, j), 1);
                            i -= 2; // Adjust index
                            break;
                        }
                    }
                }

                // Draw Bullet
                ctx.beginPath();
                ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = b.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = b.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Update & Draw Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.05;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isRunning]);

    return (
        <div className="relative w-full h-[400px] bg-black/80 rounded-xl border border-white/10 overflow-hidden">
            {/* Health Bars */}
            <div className="absolute top-4 left-4 w-48 z-10">
                <div className="flex justify-between text-xs text-red-400 font-bold mb-1">
                    <span>RED TEAM</span>
                    <span>{redHealth}%</span>
                </div>
                <div className="h-2 bg-red-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${redHealth}%` }} />
                </div>
            </div>

            <div className="absolute top-4 right-4 w-48 z-10">
                <div className="flex justify-between text-xs text-blue-400 font-bold mb-1">
                    <span>BLUE TEAM</span>
                    <span>{blueHealth}%</span>
                </div>
                <div className="h-2 bg-blue-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${blueHealth}%` }} />
                </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {!isRunning && (
                    <div className="text-white/20 font-bold text-4xl tracking-widest uppercase">
                        Battle Arena
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}
