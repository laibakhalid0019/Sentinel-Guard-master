"use client";

import { useEffect, useState } from "react";
import { Activity, ShieldAlert, HardDrive, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { apiService, type Event, type Alert } from "@/services/api";
import { ActivityGraph } from "@/components/dashboard/ActivityGraph";
import { ThreatMeter } from "@/components/dashboard/ThreatMeter";

const stats = [
  {
    name: "System Status",
    value: "SECURE",
    icon: CheckCircle,
    color: "text-green-500",
    borderColor: "border-green-500/30",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]"
  },
  {
    name: "Active Threats",
    value: "0",
    icon: ShieldAlert,
    color: "text-cyber-primary",
    borderColor: "border-cyber-primary/30",
    glow: "shadow-[0_0_20px_rgba(0,255,157,0.2)]"
  },
  {
    name: "Monitored Paths",
    value: "3",
    icon: HardDrive,
    color: "text-cyber-secondary",
    borderColor: "border-cyber-secondary/30",
    glow: "shadow-[0_0_20px_rgba(0,184,255,0.2)]"
  },
  {
    name: "Events (24h)",
    value: "0",
    icon: Activity,
    color: "text-cyber-accent",
    borderColor: "border-cyber-accent/30",
    glow: "shadow-[0_0_20px_rgba(255,0,85,0.2)]"
  },
];

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [threatLevel, setThreatLevel] = useState(5);
  const [threatStatus, setThreatStatus] = useState<"protected" | "warning" | "threat_detected" | "critical">("protected");

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Poll for updates every 2 seconds
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [eventsData, alertsData] = await Promise.all([
        apiService.getEvents(0, 20),
        apiService.getAlerts(0, 10),
      ]);
      setEvents(eventsData);
      setAlerts(alertsData);

      // Calculate threat level based on suspicious events
      const suspiciousCount = eventsData.filter(e => e.is_suspicious).length;
      const newThreatLevel = Math.min(100, suspiciousCount * 10);
      setThreatLevel(newThreatLevel);

      if (newThreatLevel > 70) {
        setThreatStatus("critical");
      } else if (newThreatLevel > 40) {
        setThreatStatus("threat_detected");
      } else if (newThreatLevel > 15) {
        setThreatStatus("warning");
      } else {
        setThreatStatus("protected");
      }

      // Update stats
      stats[1].value = suspiciousCount.toString();
      stats[3].value = eventsData.length.toString();

      if (suspiciousCount > 0) {
        stats[0].value = "AT RISK";
        stats[0].color = "text-red-500";
        stats[0].icon = AlertTriangle;
      } else {
        stats[0].value = "SECURE";
        stats[0].color = "text-green-500";
        stats[0].icon = CheckCircle;
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Generate chart data from events - creates cumulative timeline
  const generateChartData = () => {
    if (events.length === 0) {
      // Return empty default data
      return [{ timestamp: new Date().toISOString(), events: 0, threats: 0, entropy: 0 }];
    }

    // Sort events by timestamp
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Create cumulative data points - one point per event for smooth graph
    const dataPoints: { timestamp: string; events: number; threats: number; entropy: number }[] = [];
    let cumulativeEvents = 0;
    let cumulativeThreats = 0;
    let totalEntropy = 0;

    sortedEvents.forEach((event, index) => {
      cumulativeEvents++;
      if (event.is_suspicious) cumulativeThreats++;
      if (event.details?.entropy) totalEntropy += event.details.entropy;

      // Add a data point for every few events to create a smooth line
      // Or for all events if there are fewer than 15
      if (sortedEvents.length <= 15 || index % Math.ceil(sortedEvents.length / 10) === 0 || index === sortedEvents.length - 1) {
        dataPoints.push({
          timestamp: event.timestamp,
          events: cumulativeEvents,
          threats: cumulativeThreats,
          entropy: Math.round((totalEntropy / cumulativeEvents) * 100) / 100,
        });
      }
    });

    // Ensure we have at least 2 points for a proper line
    if (dataPoints.length === 1) {
      const firstPoint = dataPoints[0];
      const startTime = new Date(firstPoint.timestamp);
      startTime.setMinutes(startTime.getMinutes() - 5);
      dataPoints.unshift({
        timestamp: startTime.toISOString(),
        events: 0,
        threats: 0,
        entropy: 0,
      });
    }

    return dataPoints.slice(-10);
  };

  const chartData = generateChartData();

  return (
    <div className="p-8 space-y-8">

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between backdrop-blur-sm bg-black/20 p-4 rounded-2xl border border-white/5">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tighter">
              DASHBOARD
            </h2>
            <p className="text-gray-400 text-sm tracking-widest uppercase mt-1">Real-time System Monitoring</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm border border-green-500/20 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Real-time Protection: ON
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p - 6 rounded - xl bg - card backdrop - blur - md border ${stat.borderColor} relative overflow - hidden group hover: scale - [1.02] transition - all duration - 300 ${stat.glow} `}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon className="w-24 h-24 -mr-4 -mt-4" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p - 3 rounded - lg bg - white / 5 ${stat.color} ring - 1 ring - white / 10`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{stat.name}</h3>
                  <p className={`text - 3xl font - black mt - 1 ${stat.color} tracking - tight`}>
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 rounded-xl bg-card backdrop-blur-md border border-border shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyber-primary" />
                System Activity
              </h3>
              <ActivityGraph data={chartData.length > 0 ? chartData : [
                { timestamp: new Date().toISOString(), events: 0, threats: 0, entropy: 0 }
              ]} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* System Resources Widget */}
              <div className="p-6 rounded-xl bg-card backdrop-blur-md border border-border shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-cyber-secondary" />
                  System Resources
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">CPU Usage</span>
                      <span className="text-cyber-secondary font-mono">12%</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-cyber-secondary w-[12%] rounded-full shadow-[0_0_10px_rgba(0,184,255,0.3)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Memory</span>
                      <span className="text-purple-400 font-mono">4.2 GB / 16 GB</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[26%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Disk I/O</span>
                      <span className="text-green-400 font-mono">Active</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[45%] rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Traffic Widget */}
              <div className="p-6 rounded-xl bg-card backdrop-blur-md border border-border shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyber-accent" />
                  Network Traffic
                </h3>
                <div className="flex items-center justify-between gap-4 h-full pb-4">
                  <div className="flex-1 text-center p-3 rounded-lg bg-black/20 border border-white/5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Incoming</p>
                    <p className="text-xl font-mono text-cyber-primary font-bold">2.4 <span className="text-xs text-gray-400">MB/s</span></p>
                    <div className="w-full h-8 mt-2 flex items-end justify-center gap-0.5">
                      {[40, 60, 30, 80, 50, 90, 40].map((h, i) => (
                        <div key={i} className="w-1 bg-cyber-primary/50 rounded-t-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 text-center p-3 rounded-lg bg-black/20 border border-white/5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Outgoing</p>
                    <p className="text-xl font-mono text-cyber-accent font-bold">0.8 <span className="text-xs text-gray-400">MB/s</span></p>
                    <div className="w-full h-8 mt-2 flex items-end justify-center gap-0.5">
                      {[20, 30, 20, 40, 30, 50, 20].map((h, i) => (
                        <div key={i} className="w-1 bg-cyber-accent/50 rounded-t-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <ThreatMeter level={threatLevel} status={threatStatus} />

            <div className="p-6 rounded-xl bg-card backdrop-blur-md border border-border h-[400px] overflow-hidden flex flex-col">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-cyber-accent" />
                Recent Alerts
              </h3>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {alerts.length > 0 ? (
                  alerts.slice(0, 10).map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded bg-white/5 border border-white/10 hover:border-cyber-primary/50 transition-all hover:bg-white/10 cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-mono text-gray-500 group-hover:text-cyber-primary transition-colors">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={`text - [10px] px - 2 py - 0.5 rounded uppercase font - bold tracking - wider ${alert.severity === "high" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                          alert.severity === "medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                            "bg-green-500/20 text-green-400 border border-green-500/30"
                          } `}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 font-medium">{alert.message}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-12 flex flex-col items-center justify-center h-full">
                    <ShieldAlert className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-sm">No active threats detected.</p>
                    <p className="text-xs opacity-50 mt-1">System is running securely.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
