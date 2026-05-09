"use client";

import { useState, useEffect, useRef } from "react";
import { Shield, Activity, AlertTriangle, FileWarning, Lock, Zap, BarChart3 } from "lucide-react";
import { apiService } from "@/services/api";
import AttackDefenseVisualizer from "@/components/AttackDefenseVisualizer";

interface LiveEvent {
    id: string;
    timestamp: string;
    type: "file_created" | "file_modified" | "threat_detected" | "process_killed" | "file_quarantined";
    file_path: string;
    severity: "low" | "medium" | "high" | "critical";
    details: string;
}

export default function LiveSimulationPage() {
    const [events, setEvents] = useState<LiveEvent[]>([]);
    const [metrics, setMetrics] = useState({
        filesMonitored: 0,
        threatsDetected: 0,
        filesQuarantined: 0,
        processesKilled: 0,
    });
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const eventsEndRef = useRef<HTMLDivElement>(null);

    // Poll for updates every 500ms
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                // Fetch recent events
                const eventsData = await apiService.getEvents();
                const transformedEvents: LiveEvent[] = eventsData.slice(0, 50).map((e: any) => ({
                    id: e.id.toString(),
                    timestamp: e.timestamp,
                    type: e.is_suspicious ? "threat_detected" : "file_modified",
                    file_path: e.file_path,
                    severity: e.is_suspicious ? "high" : "low",
                    details: e.event_type,
                }));
                setEvents(transformedEvents);

                // Update metrics
                const alertsData = await apiService.getAlerts();
                const quarantineData = await apiService.getQuarantinedFiles();
                setMetrics({
                    filesMonitored: eventsData.length,
                    threatsDetected: eventsData.filter((e: any) => e.is_suspicious).length,
                    filesQuarantined: quarantineData.length,
                    processesKilled: alertsData.filter((a: any) => a.severity === "critical").length,
                });
            } catch (error) {
                console.error("Failed to fetch live data:", error);
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Removed auto-scroll - it was annoying for users exploring the page

    const startSimulation = async () => {
        try {
            setIsSimulationRunning(true);
            await apiService.startSimulation();
        } catch (error) {
            console.error("Failed to start simulation:", error);
            setIsSimulationRunning(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical": return "text-red-500 bg-red-500/10 border-red-500/30";
            case "high": return "text-orange-500 bg-orange-500/10 border-orange-500/30";
            case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
            default: return "text-blue-500 bg-blue-500/10 border-blue-500/30";
        }
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case "threat_detected": return <AlertTriangle className="w-5 h-5" />;
            case "process_killed": return <Zap className="w-5 h-5" />;
            case "file_quarantined": return <Lock className="w-5 h-5" />;
            default: return <FileWarning className="w-5 h-5" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8">
            {/* Header */}
            <div className="mb-8 backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                            LIVE SIMULATION
                        </h1>
                        <p className="text-gray-400 text-sm tracking-widest uppercase mt-2">Real-Time Threat Detection & Defense</p>
                    </div>
                    <button
                        onClick={startSimulation}
                        disabled={isSimulationRunning}
                        className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${isSimulationRunning
                            ? "bg-green-500/20 text-green-400 border border-green-500/50 animate-pulse"
                            : "bg-cyber-primary text-black hover:bg-cyber-primary/90"
                            }`}
                    >
                        <Activity className={`w-5 h-5 ${isSimulationRunning ? "animate-spin" : ""}`} />
                        {isSimulationRunning ? "SIMULATION RUNNING" : "START SIMULATION"}
                    </button>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <MetricCard
                    icon={<BarChart3 className="w-8 h-8" />}
                    label="Files Monitored"
                    value={metrics.filesMonitored}
                    color="blue"
                />
                <MetricCard
                    icon={<AlertTriangle className="w-8 h-8" />}
                    label="Threats Detected"
                    value={metrics.threatsDetected}
                    color="red"
                    animate={metrics.threatsDetected > 0}
                />
                <MetricCard
                    icon={<Lock className="w-8 h-8" />}
                    label="Files Quarantined"
                    value={metrics.filesQuarantined}
                    color="orange"
                />
                <MetricCard
                    icon={<Zap className="w-8 h-8" />}
                    label="Processes Killed"
                    value={metrics.processesKilled}
                    color="purple"
                />
            </div>

            {/* Attack vs Defense Battle Visualizer */}
            <AttackDefenseVisualizer />

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
                {/* Event Timeline - Takes 2 columns */}
                <div className="col-span-2 backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-white/5">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-cyan-400" />
                        Event Timeline
                    </h2>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {events.map((event, index) => (
                            <div
                                key={event.id}
                                className={`p-4 rounded-lg border transition-all duration-300 ${getSeverityColor(event.severity)} hover:scale-[1.02] animate-slide-in`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${event.type === "threat_detected" ? "animate-pulse" : ""}`}>
                                        {getEventIcon(event.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold uppercase text-sm tracking-wider">
                                                {event.type.replace(/_/g, " ")}
                                            </span>
                                            <span className="text-xs opacity-60">
                                                {new Date(event.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm font-mono opacity-80 truncate">{event.file_path}</p>
                                        <p className="text-xs opacity-60 mt-1">{event.details}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={eventsEndRef} />
                        {events.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>No events yet. Start a simulation to see live activity.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* System Status Panel */}
                <div className="backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-white/5">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-green-400" />
                        System Status
                    </h2>
                    <div className="space-y-4">
                        <StatusIndicator label="Agent Status" status="online" />
                        <StatusIndicator label="ML Model" status="online" />
                        <StatusIndicator label="File Monitor" status={isSimulationRunning ? "active" : "standby"} />
                        <StatusIndicator label="Defense System" status="armed" />
                    </div>

                    <div className="mt-8 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30">
                        <h3 className="text-sm font-bold text-cyan-400 mb-2">DEFENSE PROTOCOLS</h3>
                        <ul className="space-y-2 text-xs text-gray-300">
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                Real-time monitoring active
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                ML threat detection enabled
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                Auto-quarantine armed
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                Process termination ready
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div >
    );
}

function MetricCard({
    icon,
    label,
    value,
    color,
    animate = false
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: "blue" | "red" | "orange" | "purple";
    animate?: boolean;
}) {
    const colorClasses = {
        blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-400",
        red: "from-red-500/20 to-pink-500/20 border-red-500/50 text-red-400",
        orange: "from-orange-500/20 to-yellow-500/20 border-orange-500/50 text-orange-400",
        purple: "from-purple-500/20 to-pink-500/20 border-purple-500/50 text-purple-400",
    };

    return (
        <div className={`backdrop-blur-sm bg-gradient-to-br ${colorClasses[color]} p-6 rounded-xl border ${animate ? "animate-pulse" : ""}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="opacity-80">{icon}</div>
                <span className="text-4xl font-bold">{value}</span>
            </div>
            <p className="text-sm font-medium uppercase tracking-wider opacity-80">{label}</p>
        </div>
    );
}

function StatusIndicator({ label, status }: { label: string; status: string }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "online": return "bg-green-500";
            case "active": return "bg-blue-500 animate-pulse";
            case "armed": return "bg-yellow-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <span className="text-sm text-gray-300">{label}</span>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
                <span className="text-xs font-bold uppercase text-gray-400">{status}</span>
            </div>
        </div>
    );
}
