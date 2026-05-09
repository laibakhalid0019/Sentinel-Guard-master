import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "SentinelGuard",
  description: "AI-Driven Ransomware Defense",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${mono.variable} font-sans antialiased bg-background text-foreground flex h-screen overflow-hidden`}
        suppressHydrationWarning
      >
        <AppSidebar />
        <main className="flex-1 overflow-auto relative flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <footer className="p-4 text-center text-xs text-muted-foreground border-t border-white/5 bg-black/20 backdrop-blur-sm">
            <p className="font-mono">Ali Hassan (22F-3377)</p>
            <p className="mt-1 opacity-70">Made with ❤️ by Ali</p>
          </footer>
        </main>
      </body>
    </html>
  );
}
