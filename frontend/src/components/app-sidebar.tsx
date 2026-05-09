"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Separator } from "@/components/ui/separator"
// import { Sheet, SheetContent } from "@/components/ui/sheet"
// import { Skeleton } from "@/components/ui/skeleton"
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"
// import { useIsMobile } from "@/hooks/use-mobile"

// Simplified Sidebar for immediate use
export function AppSidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col p-4">
            <div className="text-2xl font-bold text-sidebar-primary mb-8 tracking-tighter">
                SENTINEL<span className="text-white">GUARD</span>
            </div>

            <nav className="space-y-2">
                <NavItem href="/" icon="🛡️" label="Dashboard" active={pathname === "/"} />
                <NavItem href="/monitor" icon="👁️" label="Monitor" active={pathname === "/monitor"} />
                <NavItem href="/alerts" icon="⚠️" label="Alerts" active={pathname === "/alerts"} />
                <NavItem href="/quarantine" icon="🔒" label="Quarantine" active={pathname === "/quarantine"} />
                <NavItem href="/live" icon="⚡" label="Live Simulation" active={pathname === "/live"} />
                <NavItem href="/simulation" icon="🎮" label="Simulation" active={pathname === "/simulation"} />
                <NavItem href="/settings" icon="⚙️" label="Settings" active={pathname === "/settings"} />
            </nav>

            <div className="mt-auto pt-4 border-t border-sidebar-border">
                <div className="flex items-center gap-2 text-sidebar-foreground text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    System Online
                </div>
            </div>
        </div>
    )
}

function NavItem({ href, icon, label, active }: { href: string; icon: string; label: string; active?: boolean }) {
    return (
        <a
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_0_10px_rgba(0,255,157,0.1)]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
        >
            <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
            <span className="font-medium">{label}</span>
            {active && <div className="ml-auto w-1 h-1 rounded-full bg-cyber shadow-[0_0_5px_#00ff9d]" />}
        </a>
    )
}
