"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldX, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

type ThreatStatus = "protected" | "warning" | "threat_detected" | "critical";

interface ThreatMeterProps {
    level: number;
    status: ThreatStatus;
}

export function ThreatMeter({ level, status }: ThreatMeterProps) {
    const getStatusConfig = () => {
        switch (status) {
            case "protected":
                return {
                    icon: ShieldCheck,
                    label: "System Protected",
                    color: "text-green-500",
                    bgColor: "bg-green-500",
                    ringColor: "ring-green-500/30",
                    gradient: "from-green-500/20 to-green-500/5",
                };
            case "warning":
                return {
                    icon: Shield,
                    label: "Elevated Risk",
                    color: "text-yellow-500",
                    bgColor: "bg-yellow-500",
                    ringColor: "ring-yellow-500/30",
                    gradient: "from-yellow-500/20 to-yellow-500/5",
                };
            case "threat_detected":
                return {
                    icon: ShieldAlert,
                    label: "Threat Detected",
                    color: "text-cyber-accent",
                    bgColor: "bg-cyber-accent",
                    ringColor: "ring-cyber-accent/30",
                    gradient: "from-cyber-accent/20 to-cyber-accent/5",
                };
            case "critical":
                return {
                    icon: ShieldX,
                    label: "Critical Alert",
                    color: "text-cyber-accent animate-pulse",
                    bgColor: "bg-cyber-accent",
                    ringColor: "ring-cyber-accent/50",
                    gradient: "from-cyber-accent/30 to-cyber-accent/10",
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (level / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="relative overflow-visible cyber-box-glow">
                <div className={cn("absolute inset-0 rounded-xl bg-gradient-to-br", config.gradient)} />
                <CardHeader className="relative pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Icon className={cn("h-5 w-5", config.color)} />
                        Threat Level
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                    <div className="flex items-center justify-center gap-8">
                        <div className="relative">
                            <svg className="w-32 h-32 -rotate-90 transform">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="45"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    className="text-gray-700"
                                />
                                <motion.circle
                                    cx="64"
                                    cy="64"
                                    r="45"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    className={config.color}
                                    strokeDasharray={circumference}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <motion.span
                                        className={cn("text-3xl font-bold tabular-nums", config.color)}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {level}
                                    </motion.span>
                                    <span className="text-gray-500 text-sm block">/ 100</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full ring-2", config.ringColor, "bg-background")}>
                                <div className={cn("h-2 w-2 rounded-full", config.bgColor, status === "critical" && "animate-pulse")} />
                                <span className={cn("text-sm font-medium", config.color)}>{config.label}</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Safe</span>
                                    <span className="text-gray-500">Critical</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className={cn("h-full rounded-full", config.bgColor)}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${level}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
