"use client";

import { useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";
import { apiService } from "@/services/api";

export default function SettingsPage() {
    const [config, setConfig] = useState({
        monitored_paths: "C:/Users/Test/Documents",
        entropy_threshold: "7.5",
        write_burst_limit: "50"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const data = await apiService.getConfig();
            if (data && Object.keys(data).length > 0) {
                setConfig(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await apiService.updateConfig(config);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("Failed to save settings");
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between backdrop-blur-sm bg-black/20 p-4 rounded-2xl border border-white/5">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tighter">
                        SYSTEM <span className="text-cyber-secondary">SETTINGS</span>
                    </h2>
                    <p className="text-gray-400 text-sm tracking-widest uppercase mt-1">Configuration & Preferences</p>
                </div>
            </div>

            <div className="grid gap-8 max-w-3xl">
                <div className="p-6 rounded-xl bg-card border border-border">
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-cyber-secondary" />
                        Monitoring Configuration
                    </h3>

                    {loading ? (
                        <div>Loading settings...</div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Monitored Directories</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={config.monitored_paths}
                                        onChange={(e) => setConfig({ ...config, monitored_paths: e.target.value })}
                                        className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyber-secondary"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Separate multiple paths with semicolons</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Entropy Threshold</label>
                                    <input
                                        type="number"
                                        value={config.entropy_threshold}
                                        onChange={(e) => setConfig({ ...config, entropy_threshold: e.target.value })}
                                        step="0.1"
                                        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyber-secondary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Write Burst Limit (ops/sec)</label>
                                    <input
                                        type="number"
                                        value={config.write_burst_limit}
                                        onChange={(e) => setConfig({ ...config, write_burst_limit: e.target.value })}
                                        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyber-secondary"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
