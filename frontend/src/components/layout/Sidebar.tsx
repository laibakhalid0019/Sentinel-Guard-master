"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Activity, FileText, Settings, Lock, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const menuItems = [
    { name: "Dashboard", href: "/", icon: Activity },
    { name: "Threats", href: "/threats", icon: Shield },
    { name: "Logs", href: "/logs", icon: FileText },
    { name: "Simulation", href: "/simulation", icon: Terminal },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-cyber-panel border-r border-cyber-border fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6 flex items-center gap-3 border-b border-cyber-border">
                <Lock className="w-8 h-8 text-cyber-primary animate-pulse" />
                <h1 className="text-xl font-bold tracking-wider text-white">
                    SENTINEL<span className="text-cyber-primary">GUARD</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/30"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 w-1 h-full bg-cyber-primary"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    />
                                )}
                                <Icon className={clsx("w-5 h-5", isActive && "cyber-text-glow")} />
                                <span className="font-medium tracking-wide">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-cyber-border">
                <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded border border-cyber-border/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    <span className="text-xs text-green-400 font-mono">SYSTEM ONLINE</span>
                </div>
            </div>
        </aside>
    );
}
