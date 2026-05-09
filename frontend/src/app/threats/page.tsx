"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, Clock, FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService, type Alert } from "@/services/api";

export default function ThreatsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        loadAlerts();
        const interval = setInterval(loadAlerts, 3000);
        return () => clearInterval(interval);
    }, []);

    const loadAlerts = async () => {
        try {
            const data = await apiService.getAlerts(0, 100);
            setAlerts(data);
        } catch (error) {
            console.error("Error loading alerts:", error);
        }
    };

    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case "critical":
                return { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", icon: ShieldAlert };
            case "high":
                return { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: AlertTriangle };
            case "medium":
                return { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: FileWarning };
            default:
                return { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30", icon: Clock };
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                    Threat <span className="text-cyber-accent">Analysis</span>
                </h2>
                <p className="text-gray-400">Detailed view of all detected threats and security alerts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="cyber-box-glow border-red-500/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-400">Critical Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-red-500">
                            {alerts.filter(a => a.severity === "critical").length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="cyber-box-glow border-orange-500/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-400">High Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-orange-500">
                            {alerts.filter(a => a.severity === "high").length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="cyber-box-glow border-yellow-500/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-400">Total Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-yellow-500">{alerts.length}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="cyber-box-glow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-cyber-accent" />
                        All Threat Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {alerts.length > 0 ? (
                            alerts.map((alert, index) => {
                                const config = getSeverityConfig(alert.severity);
                                const Icon = config.icon;

                                return (
                                    <motion.div
                                        key={alert.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`p-4 rounded-lg border ${config.border} ${config.bg} hover:scale-[1.02] transition-transform cursor-pointer`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-white">{alert.message}</h4>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.color} font-medium uppercase`}>
                                                        {alert.severity}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {new Date(alert.timestamp).toLocaleString()}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded ${alert.status === "resolved" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                                        {alert.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg">No threats detected</p>
                                <p className="text-sm">Your system is secure</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
