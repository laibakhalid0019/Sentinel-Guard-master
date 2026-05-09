"use client";

import { useEffect, useState } from "react";
import { apiService, type Event } from "@/services/api";
import { FileText, Folder, HardDrive } from "lucide-react";

export default function MonitorPage() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        fetchEvents();
        const interval = setInterval(fetchEvents, 2000);
        return () => clearInterval(interval);
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await apiService.getEvents(0, 50);
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between backdrop-blur-sm bg-black/20 p-4 rounded-2xl border border-white/5">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tighter">
                        FILE <span className="text-cyber-secondary">MONITOR</span>
                    </h2>
                    <p className="text-gray-400 text-sm tracking-widest uppercase mt-1">Real-time File System Watcher</p>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                    <span className="font-mono text-sm text-muted-foreground">Live Feed</span>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-500">Monitoring Active</span>
                    </div>
                </div>
                <div className="divide-y divide-border">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event.id} className="p-4 hover:bg-muted/10 transition-colors flex items-center gap-4 group">
                                <div className={`p-2 rounded-lg ${event.is_suspicious ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    {event.is_suspicious ? <FileText className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs text-muted-foreground">
                                            {new Date(event.timestamp).toLocaleTimeString()}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${event.event_type === 'modified' ? 'bg-yellow-500/10 text-yellow-500' :
                                                event.event_type === 'created' ? 'bg-green-500/10 text-green-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {event.event_type}
                                        </span>
                                        {event.is_suspicious && (
                                            <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">
                                                SUSPICIOUS
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground font-medium truncate font-mono">{event.file_path}</p>
                                    {event.details && (
                                        <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                                            {event.details.entropy && <span>Entropy: {event.details.entropy.toFixed(2)}</span>}
                                            {event.details.burst_count && <span>Burst: {event.details.burst_count}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-muted-foreground">
                            <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No file events detected yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
