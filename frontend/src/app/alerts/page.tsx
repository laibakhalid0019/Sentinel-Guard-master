"use client";

import { useEffect, useState } from "react";
import { apiService, type Alert } from "@/services/api";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 2000);
        return () => clearInterval(interval);
    }, []);

    const fetchAlerts = async () => {
        try {
            const data = await apiService.getAlerts(0, 50);
            setAlerts(data);
        } catch (error) {
            console.error("Error fetching alerts:", error);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between backdrop-blur-sm bg-black/20 p-4 rounded-2xl border border-white/5">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tighter">
                        SECURITY <span className="text-cyber-accent">ALERTS</span>
                    </h2>
                    <p className="text-gray-400 text-sm tracking-widest uppercase mt-1">Threat Detection Log</p>
                </div>
            </div>

            <div className="grid gap-4">
                {alerts.length > 0 ? (
                    alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`p-6 rounded-xl border flex items-start gap-4 transition-all hover:scale-[1.01] ${alert.severity === 'high' ? 'bg-red-500/5 border-red-500/20' :
                                    alert.severity === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
                                        'bg-blue-500/5 border-blue-500/20'
                                }`}
                        >
                            <div className={`p-3 rounded-lg ${alert.severity === 'high' ? 'bg-red-500/10 text-red-500' :
                                    alert.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-blue-500/10 text-blue-500'
                                }`}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg text-foreground">{alert.message}</h3>
                                    <span className="font-mono text-sm text-muted-foreground">
                                        {new Date(alert.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded uppercase font-bold tracking-wider ${alert.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                                            alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {alert.severity}
                                    </span>
                                    <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">
                                        ID: {alert.id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                        <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No active threats detected</p>
                        <p className="text-sm opacity-60">Your system is secure.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
