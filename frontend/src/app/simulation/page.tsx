"use client";

import { useState } from "react";
import { Play, Shield, Terminal, AlertTriangle } from "lucide-react";
import GamifiedBattleVisualizer from "@/components/GamifiedBattleVisualizer";
import { apiService } from "@/services/api";

export default function SimulationPage() {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const runSimulation = async () => {
        setIsRunning(true);
        setLogs(prev => [...prev, "> Initializing Sandbox Environment..."]);

        try {
            await apiService.startSimulation();
            setLogs(prev => [...prev, "> Request sent to backend agent..."]);
            setLogs(prev => [...prev, "> Simulation script executed."]);
            setLogs(prev => [...prev, "> Monitor the dashboard for real-time alerts."]);
        } catch (error) {
            setLogs(prev => [...prev, `> Error: ${error}`]);
            setIsRunning(false);
        }

        // Auto-reset state after a while for demo purposes, 
        // though in reality we'd wait for a "finished" event
        setTimeout(() => {
            setIsRunning(false);
        }, 10000); // Increased to 10s to enjoy the battle
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between backdrop-blur-sm bg-black/20 p-4 rounded-2xl border border-white/5">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tighter">
                        ATTACK <span className="text-cyber-primary">SIMULATION</span>
                    </h2>
                    <p className="text-gray-400 text-sm tracking-widest uppercase mt-1">Safe Ransomware Testing Environment</p>
                </div>
            </div>

            {/* Battle Visualizer */}
            <div className="w-full">
                <GamifiedBattleVisualizer isRunning={isRunning} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-card border border-border">
                        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-cyber-primary" />
                            Control Panel
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            This tool simulates a ransomware attack in a safe, sandboxed environment.
                            It creates dummy files and attempts to encrypt them to test SentinelGuard's response.
                        </p>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mb-6 flex gap-3 items-start">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                            <div className="text-sm text-yellow-200/80">
                                <strong>Safety Notice:</strong> This simulation uses a harmless XOR encryption on dummy files only.
                                No real user files will be affected.
                            </div>
                        </div>

                        <button
                            onClick={runSimulation}
                            disabled={isRunning}
                            className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${isRunning
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse'
                                }`}
                        >
                            {isRunning ? (
                                <>Running Simulation...</>
                            ) : (
                                <><Play className="w-5 h-5" /> Start Simulation</>
                            )}
                        </button>

                        <p className="text-xs text-center mt-4 text-muted-foreground">
                            *Requires Python backend to be running
                        </p>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-black border border-border font-mono text-sm h-[400px] overflow-hidden flex flex-col relative">
                    <div className="absolute top-0 left-0 right-0 p-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Simulation Log</span>
                    </div>
                    <div className="mt-8 space-y-2 overflow-y-auto custom-scrollbar flex-1 p-2">
                        <div className="text-green-500/50">System Ready...</div>
                        {logs.map((log, i) => (
                            <div key={i} className={log.includes("[!]") ? "text-red-400" : log.includes("[✓]") ? "text-green-400" : "text-gray-300"}>
                                {log}
                            </div>
                        ))}
                        {isRunning && <div className="animate-pulse text-cyber-primary">_</div>}
                    </div>
                </div>
            </div>
        </div >
    );
}
