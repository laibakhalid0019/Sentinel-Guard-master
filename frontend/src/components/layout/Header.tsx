"use client";

import { Bell, Search, User } from "lucide-react";

export default function Header() {
    return (
        <header className="h-16 bg-cyber-panel/80 backdrop-blur-md border-b border-cyber-border fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-8">
            <div className="flex items-center gap-4 w-96">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search logs, threats, or files..."
                        className="w-full bg-black/50 border border-cyber-border rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyber-primary transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-gray-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyber-accent rounded-full animate-pulse" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-cyber-border">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-cyber-secondary">Security Analyst</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-cyber-border flex items-center justify-center border border-cyber-primary/20">
                        <User className="w-5 h-5 text-cyber-primary" />
                    </div>
                </div>
            </div>
        </header>
    );
}
