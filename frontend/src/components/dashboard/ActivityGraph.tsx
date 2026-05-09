"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ActivityDataPoint {
    timestamp: string;
    events: number;
    threats: number;
    entropy: number;
}

interface ActivityGraphProps {
    data: ActivityDataPoint[];
}

export function ActivityGraph({ data }: ActivityGraphProps) {
    // Ensure we have valid data
    const chartData = data && data.length > 0 ? data : [
        { timestamp: new Date().toISOString(), events: 0, threats: 0, entropy: 0 }
    ];

    return (
        <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff0055" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#ff0055" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorEntropy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00b8ff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00b8ff" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />
                    <XAxis
                        dataKey="timestamp"
                        stroke="#888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                        tickFormatter={(value) => {
                            try {
                                const date = new Date(value);
                                if (isNaN(date.getTime())) return "";
                                return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                            } catch {
                                return "";
                            }
                        }}
                    />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#111",
                            border: "1px solid #333",
                            borderRadius: "6px",
                            fontSize: "12px",
                        }}
                        labelStyle={{ color: "#ededed" }}
                        labelFormatter={(value) => {
                            try {
                                const date = new Date(value);
                                return date.toLocaleTimeString();
                            } catch {
                                return "";
                            }
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-sm text-gray-400">{value}</span>}
                    />
                    <Area
                        type="monotone"
                        dataKey="events"
                        name="File Events"
                        stroke="#00ff9d"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorEvents)"
                    />
                    <Area
                        type="monotone"
                        dataKey="threats"
                        name="Threats"
                        stroke="#ff0055"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorThreats)"
                    />
                    <Area
                        type="monotone"
                        dataKey="entropy"
                        name="Avg Entropy"
                        stroke="#00b8ff"
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                        fillOpacity={1}
                        fill="url(#colorEntropy)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
