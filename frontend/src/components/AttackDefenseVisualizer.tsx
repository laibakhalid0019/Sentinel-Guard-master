"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, Skull, Lock, Database, Server, Globe, Terminal, Wifi, AlertTriangle, FileCode, Activity } from "lucide-react";

interface NetworkNode {
    id: string;
    x: number;
    y: number;
    label: string;
    sublabel: string;
    type: "attacker" | "target" | "intermediate" | "defender";
    icon: string;
}

interface AnimatedPacket {
    id: string;
    fromNode: string;
    toNode: string;
    progress: number;
    protocol: string;
    payload: string;
    color: string;
    type: "data" | "exploit" | "control" | "alert";
    speed: number;
}

interface AttackStage {
    stage: number;
    name: string;
    redAction: string;
    redTechnique: string;
    redDetails: string[];
    blueDetection: string;
    blueResponse: string;
    packets: Array<{
        from: string;
        to: string;
        protocol: string;
        payload: string;
        color: string;
        type: "data" | "exploit" | "control" | "alert";
        count: number; // Number of packets to burst
        delay: number; // Delay between bursts
    }>;
}

export default function AttackDefenseVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentStage, setCurrentStage] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);
    const [animatedPackets, setAnimatedPackets] = useState<AnimatedPacket[]>([]);
    const animationFrameRef = useRef<number>(0);

    // Define network topology - More nodes showing complete attack chain
    const nodes: NetworkNode[] = [
        { id: "attacker", x: 80, y: 300, label: "ATTACKER", sublabel: "192.168.1.66", type: "attacker", icon: "💀" },
        { id: "firewall", x: 220, y: 300, label: "FIREWALL", sublabel: "Gateway", type: "intermediate", icon: "🧱" },
        { id: "switch", x: 350, y: 300, label: "CORE SWITCH", sublabel: "VLAN 10", type: "intermediate", icon: "twisted" },
        { id: "webserver", x: 500, y: 150, label: "WEB SERVER", sublabel: "10.0.0.50:80", type: "target", icon: "🌐" },
        { id: "database", x: 650, y: 150, label: "DATABASE", sublabel: "10.0.0.51:3306", type: "target", icon: "💾" },
        { id: "fileserver", x: 500, y: 450, label: "FILE SERVER", sublabel: "10.0.0.52:445", type: "target", icon: "📁" },
        { id: "sentinel", x: 800, y: 300, label: "SENTINEL AI", sublabel: "ML Defense", type: "defender", icon: "🛡️" },
        { id: "quarantine", x: 950, y: 300, label: "QUARANTINE", sublabel: "Isolated Zone", type: "defender", icon: "🔒" },
    ];

    // Detailed attack stages with SQL injection example
    const attackStages: AttackStage[] = [
        {
            stage: 1,
            name: "Network Reconnaissance",
            redAction: "Port Scanning & Service Enumeration",
            redTechnique: "NMAP TCP SYN SCAN",
            redDetails: [
                "nmap -sS -sV -p- 10.0.0.0/24",
                "Discovered: Port 80 (HTTP), 3306 (MySQL), 445 (SMB)",
                "Identified vulnerable web application",
            ],
            blueDetection: "Anomalous Network Scanning Detected",
            blueResponse: "IDS Alert: Suspicious port scan from 192.168.1.66",
            packets: [
                { from: "attacker", to: "firewall", protocol: "TCP SYN", payload: "Scan", color: "#ef4444", type: "control", count: 5, delay: 100 },
                { from: "firewall", to: "switch", protocol: "TCP SYN", payload: "Fwd", color: "#ef4444", type: "control", count: 5, delay: 150 },
                { from: "switch", to: "webserver", protocol: "HTTP?", payload: "Port 80", color: "#f97316", type: "data", count: 3, delay: 200 },
                { from: "switch", to: "database", protocol: "SQL?", payload: "Port 3306", color: "#f97316", type: "data", count: 3, delay: 250 },
                { from: "switch", to: "fileserver", protocol: "SMB?", payload: "Port 445", color: "#f97316", type: "data", count: 3, delay: 300 },
                { from: "sentinel", to: "firewall", protocol: "LOG", payload: "Scan Detected", color: "#3b82f6", type: "alert", count: 2, delay: 800 },
            ],
        },
        {
            stage: 2,
            name: "SQL Injection Exploitation",
            redAction: "Exploiting Web Application Vulnerability",
            redTechnique: "UNION-BASED SQL INJECTION",
            redDetails: [
                "GET /login.php?user=' UNION SELECT null,null,password FROM users--",
                "Successfully bypassed authentication",
                "Extracted database credentials: admin/P@ssw0rd!",
            ],
            blueDetection: "SQL Injection Pattern Detected",
            blueResponse: "WAF: Malicious SQL detected in HTTP request",
            packets: [
                { from: "attacker", to: "firewall", protocol: "HTTP", payload: "GET /login", color: "#dc2626", type: "exploit", count: 1, delay: 0 },
                { from: "firewall", to: "switch", protocol: "HTTP", payload: "SQLi Payload", color: "#dc2626", type: "exploit", count: 1, delay: 100 },
                { from: "switch", to: "webserver", protocol: "HTTP", payload: "' OR 1=1", color: "#dc2626", type: "exploit", count: 1, delay: 200 },
                { from: "webserver", to: "database", protocol: "SQL", payload: "SELECT *", color: "#dc2626", type: "data", count: 4, delay: 500 },
                { from: "database", to: "webserver", protocol: "DATA", payload: "Result Set", color: "#ef4444", type: "data", count: 4, delay: 800 },
                { from: "webserver", to: "switch", protocol: "HTTP", payload: "200 OK", color: "#ef4444", type: "data", count: 1, delay: 1200 },
                { from: "switch", to: "firewall", protocol: "HTTP", payload: "Admin Access", color: "#ef4444", type: "data", count: 1, delay: 1300 },
                { from: "firewall", to: "attacker", protocol: "HTTP", payload: "Success", color: "#ef4444", type: "data", count: 1, delay: 1400 },
            ],
        },
        {
            stage: 3,
            name: "Lateral Movement",
            redAction: "Moving to File Server",
            redTechnique: "SMB EXPLOITATION (EternalBlue)",
            redDetails: [
                "Using discovered credentials for SMB access",
                "Exploiting MS17-010 vulnerability",
                "Deploying ransomware payload to file shares",
            ],
            blueDetection: "Unusual SMB Traffic Pattern",
            blueResponse: "Detecting abnormal file access patterns",
            packets: [
                { from: "attacker", to: "firewall", protocol: "SMB", payload: "Auth", color: "#dc2626", type: "control", count: 2, delay: 0 },
                { from: "firewall", to: "switch", protocol: "SMB", payload: "Negot", color: "#dc2626", type: "control", count: 2, delay: 100 },
                { from: "switch", to: "fileserver", protocol: "SMB", payload: "Tree Connect", color: "#dc2626", type: "exploit", count: 5, delay: 300 },
                { from: "fileserver", to: "switch", protocol: "SMB", payload: "Success", color: "#ef4444", type: "data", count: 5, delay: 600 },
                { from: "switch", to: "fileserver", protocol: "SMB", payload: "Write .exe", color: "#dc2626", type: "data", count: 8, delay: 900 },
            ],
        },
        {
            stage: 4,
            name: "Ransomware Deployment",
            redAction: "Mass File Encryption",
            redTechnique: "AES-256 ENCRYPTION",
            redDetails: [
                "Encrypting files: .docx, .xlsx, .pdf, .jpg",
                "Encryption rate: 18 files/second",
                "Creating ransom note: README_DECRYPT.txt",
            ],
            blueDetection: "CRITICAL: High Entropy Files + Write Burst",
            blueResponse: "ML Model: Ransomware activity detected!",
            packets: [
                { from: "fileserver", to: "sentinel", protocol: "SYSLOG", payload: "File Write", color: "#3b82f6", type: "data", count: 15, delay: 0 },
                { from: "sentinel", to: "sentinel", protocol: "ANALYSIS", payload: "Entropy Check", color: "#10b981", type: "control", count: 5, delay: 500 },
                { from: "sentinel", to: "fileserver", protocol: "BLOCK", payload: "KILL PID", color: "#ef4444", type: "alert", count: 1, delay: 1500 },
            ],
        },
        {
            stage: 5,
            name: "Automated Defense Response",
            redAction: "⚠️ Attack Interrupted",
            redTechnique: "PROCESS TERMINATED",
            redDetails: [
                "Malicious process killed by Sentinel",
                "Encrypted files detected and quarantined",
                "C2 connection severed",
            ],
            blueDetection: "Threat Neutralization in Progress",
            blueResponse: "Process killed | Files quarantined | System isolated",
            packets: [
                { from: "sentinel", to: "quarantine", protocol: "MOVE", payload: "Quarantine", color: "#10b981", type: "data", count: 10, delay: 0 },
                { from: "quarantine", to: "sentinel", protocol: "ACK", payload: "Secured", color: "#10b981", type: "control", count: 5, delay: 1000 },
                { from: "sentinel", to: "firewall", protocol: "RULE", payload: "Block IP", color: "#3b82f6", type: "alert", count: 1, delay: 1500 },
            ],
        },
    ];

    // Animation loop for smooth packet movement
    useEffect(() => {
        if (!isSimulating) return;

        const animate = () => {
            setAnimatedPackets((prev) =>
                prev
                    .map((p) => ({
                        ...p,
                        progress: Math.min(p.progress + p.speed, 1),
                    }))
                    .filter((p) => p.progress < 1)
            );
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isSimulating]);

    // Canvas drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 1100;
        canvas.height = 550;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background grid
            ctx.strokeStyle = "rgba(6, 182, 212, 0.05)";
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += 40) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }

            // Draw connection lines between nodes
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            const connections = [
                ["attacker", "firewall"],
                ["firewall", "switch"],
                ["switch", "webserver"],
                ["switch", "database"],
                ["switch", "fileserver"],
                ["webserver", "database"],
                ["fileserver", "sentinel"],
                ["database", "sentinel"],
                ["webserver", "sentinel"],
                ["sentinel", "quarantine"],
                ["sentinel", "firewall"],
            ];

            connections.forEach(([from, to]) => {
                const fromNode = nodes.find((n) => n.id === from);
                const toNode = nodes.find((n) => n.id === to);
                if (fromNode && toNode) {
                    ctx.beginPath();
                    ctx.moveTo(fromNode.x, fromNode.y);
                    ctx.lineTo(toNode.x, toNode.y);
                    ctx.stroke();
                }
            });
            ctx.setLineDash([]);

            // Draw animated packets
            animatedPackets.forEach((packet) => {
                const fromNode = nodes.find((n) => n.id === packet.fromNode);
                const toNode = nodes.find((n) => n.id === packet.toNode);
                if (!fromNode || !toNode) return;

                const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress;
                const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress;

                // Packet glow
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
                gradient.addColorStop(0, packet.color + "ff");
                gradient.addColorStop(1, packet.color + "00");
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, 15, 0, Math.PI * 2);
                ctx.fill();

                // Packet Shape based on type
                ctx.fillStyle = packet.color;
                if (packet.type === "data") {
                    ctx.fillRect(x - 6, y - 4, 12, 8); // Rectangle for data
                } else if (packet.type === "exploit") {
                    ctx.beginPath();
                    ctx.moveTo(x, y - 6);
                    ctx.lineTo(x + 6, y + 6);
                    ctx.lineTo(x - 6, y + 6);
                    ctx.fill(); // Triangle for exploit
                } else if (packet.type === "alert") {
                    ctx.beginPath();
                    ctx.arc(x, y, 6, 0, Math.PI * 2);
                    ctx.fill(); // Circle for alert
                } else {
                    ctx.fillRect(x - 4, y - 4, 8, 8); // Square for control
                }

                // Packet label
                ctx.fillStyle = "#fff";
                ctx.font = "bold 10px monospace";
                ctx.textAlign = "center";
                ctx.fillText(packet.protocol, x, y - 12);

                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.font = "9px monospace";
                ctx.fillText(packet.payload, x, y + 15);
            });

            // Draw nodes
            nodes.forEach((node) => {
                const color =
                    node.type === "attacker"
                        ? "#ef4444"
                        : node.type === "defender"
                            ? "#3b82f6"
                            : node.type === "target"
                                ? "#f59e0b"
                                : "#6b7280";

                // Outer glow
                if (isSimulating) {
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = color;
                }

                // Node circle - outer
                ctx.beginPath();
                ctx.arc(node.x, node.y, 35, 0, Math.PI * 2);
                ctx.fillStyle = color + "15";
                ctx.fill();
                ctx.strokeStyle = color + "80";
                ctx.lineWidth = 2;
                ctx.stroke();

                // Node circle - inner
                ctx.beginPath();
                ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
                ctx.fillStyle = color + "30";
                ctx.fill();
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.shadowBlur = 0;

                // Icon (emoji replacement for now, could be images)
                ctx.font = "20px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                if (node.icon === "twisted") ctx.fillText("🔀", node.x, node.y);
                else ctx.fillText(node.icon, node.x, node.y);

                // Labels
                ctx.font = "bold 11px monospace";
                ctx.fillStyle = "#fff";
                ctx.fillText(node.label, node.x, node.y + 50);
                ctx.font = "10px monospace";
                ctx.fillStyle = "#888";
                ctx.fillText(node.sublabel, node.x, node.y + 63);
            });
        };

        draw();
        const interval = setInterval(draw, 50);
        return () => clearInterval(interval);
    }, [nodes, animatedPackets, isSimulating]);

    const startSimulation = () => {
        setIsSimulating(true);
        setCurrentStage(0);
        setAnimatedPackets([]);

        attackStages.forEach((stage, index) => {
            setTimeout(() => {
                setCurrentStage(index + 1);

                // Spawn packets for this stage
                stage.packets.forEach((pkt) => {
                    // Burst packets
                    for (let i = 0; i < pkt.count; i++) {
                        setTimeout(() => {
                            const newPacket: AnimatedPacket = {
                                id: `${stage.stage}-${i}-${Date.now()}-${Math.random()}`,
                                fromNode: pkt.from,
                                toNode: pkt.to,
                                progress: 0,
                                protocol: pkt.protocol,
                                payload: pkt.payload,
                                color: pkt.color,
                                type: pkt.type,
                                speed: 0.003 + (Math.random() * 0.002) // Variable slow speed
                            };
                            setAnimatedPackets((prev) => [...prev, newPacket]);
                        }, pkt.delay + (i * 150)); // Staggered burst
                    }
                });
            }, index * 6000); // Longer stages for slower animation
        });

        setTimeout(() => {
            setIsSimulating(false);
        }, attackStages.length * 6000 + 3000);
    };

    return (
        <div className="backdrop-blur-sm bg-black/50 p-8 rounded-2xl border-2 border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.15)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 p-[3px] shadow-lg">
                        <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                            <Terminal className="w-7 h-7 text-cyan-400" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-cyan-400 tracking-tight">
                            ADVANCED THREAT SIMULATOR
                        </h2>
                        <p className="text-cyan-300 text-xs font-mono mt-1 tracking-wider">
                            Multi-Stage Attack Chain Analysis | SQL Injection → Ransomware
                        </p>
                    </div>
                </div>
                <button
                    onClick={startSimulation}
                    disabled={isSimulating}
                    className={`px-10 py-4 rounded-xl font-bold font-mono text-sm flex items-center gap-3 transition-all border-2 shadow-xl ${isSimulating
                        ? "bg-purple-500/20 text-purple-300 border-purple-400/60 animate-pulse shadow-purple-500/50"
                        : "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-white border-transparent hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
                        }`}
                >
                    {isSimulating ? (
                        <>
                            <Wifi className="w-5 h-5 animate-spin" />
                            ATTACK SIMULATION RUNNING
                        </>
                    ) : (
                        <>
                            <AlertTriangle className="w-5 h-5" />
                            LAUNCH ATTACK SIMULATION
                        </>
                    )}
                </button>
            </div>

            {/* Network Topology Canvas */}
            <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black rounded-2xl p-8 border-2 border-cyan-500/20 mb-6 relative overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08),transparent_70%)]"></div>
                <div className="absolute top-4 right-4 text-xs font-mono text-cyan-400/50">
                    NETWORK TOPOLOGY MAP
                </div>
                <canvas ref={canvasRef} className="w-full relative z-10" />
            </div>

            {/* Attack Details */}
            <div className="grid grid-cols-2 gap-6">
                {/* Red Team */}
                <div className="bg-gradient-to-br from-red-950/40 to-black/60 rounded-xl border-2 border-red-500/30 p-6 font-mono shadow-xl">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-red-500/30">
                        <Skull className="w-7 h-7 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        <div>
                            <h3 className="text-xl font-bold text-red-400 tracking-wide">RED TEAM [OFFENSIVE]</h3>
                            <p className="text-xs text-red-300/60 mt-0.5">Advanced Persistent Threat Simulation</p>
                        </div>
                    </div>
                    {currentStage > 0 && currentStage <= attackStages.length && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 font-bold animate-pulse">
                                    {attackStages[currentStage - 1].stage}
                                </div>
                                <div className="text-red-300 text-sm font-bold">{attackStages[currentStage - 1].redAction}</div>
                            </div>
                            <div className="bg-black/60 p-4 rounded-lg border border-red-500/20">
                                <p className="text-[10px] text-red-400 mb-2 font-bold tracking-wider">⚡ TECHNIQUE:</p>
                                <p className="text-xs text-red-200">{attackStages[currentStage - 1].redTechnique}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] text-red-400 font-bold tracking-wider">📋 EXECUTION:</p>
                                {attackStages[currentStage - 1].redDetails.map((detail, i) => (
                                    <div key={i} className="text-[10px] text-red-300/80 font-mono bg-black/40 p-2 rounded border-l-2 border-red-500/50">
                                        $ {detail}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Blue Team */}
                <div className="bg-gradient-to-br from-blue-950/40 to-black/60 rounded-xl border-2 border-blue-500/30 p-6 font-mono shadow-xl">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-blue-500/30">
                        <Shield className="w-7 h-7 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        <div>
                            <h3 className="text-xl font-bold text-blue-400 tracking-wide">BLUE TEAM [DEFENSIVE]</h3>
                            <p className="text-xs text-blue-300/60 mt-0.5">AI-Powered Threat Detection & Response</p>
                        </div>
                    </div>
                    {currentStage > 0 && currentStage <= attackStages.length && (
                        <div className="space-y-4">
                            <div className="bg-black/60 p-4 rounded-lg border border-blue-500/20">
                                <p className="text-[10px] text-blue-400 mb-2 font-bold tracking-wider">🔍 DETECTION:</p>
                                <p className="text-xs text-blue-200">{attackStages[currentStage - 1].blueDetection}</p>
                            </div>
                            <div className="bg-gradient-to-r from-cyan-500/15 to-blue-500/15 p-4 rounded-lg border-2 border-cyan-400/40 shadow-inner">
                                <p className="text-[10px] text-cyan-300 mb-2 font-bold tracking-wider">⚡ AUTOMATED RESPONSE:</p>
                                <p className="text-xs text-cyan-100 leading-relaxed">{attackStages[currentStage - 1].blueResponse}</p>
                            </div>
                            {currentStage === attackStages.length && (
                                <div className="bg-green-500/20 p-3 rounded-lg border border-green-500/50 animate-pulse">
                                    <p className="text-xs text-green-300 font-bold text-center">✅ THREAT NEUTRALIZED</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
