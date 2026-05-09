"use client";

import { useState, useEffect } from "react";
import { Lock, Trash2, RefreshCw, ShieldCheck } from "lucide-react";
import { apiService } from "@/services/api";

interface QuarantinedFile {
    id: number;
    filename: string;
    original_path: string;
    quarantine_path: string;
    timestamp: string;
    date: string; // fallback
    reason: string;
}

export default function QuarantinePage() {
    const [files, setFiles] = useState<QuarantinedFile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const data = await apiService.getQuarantinedFiles();
            setFiles(data);
        } catch (error) {
            console.error("Failed to load quarantined files:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id: number) => {
        try {
            await apiService.restoreFile(id.toString());
            loadFiles(); // Reload list
        } catch (error) {
            console.error("Failed to restore file:", error);
            alert("Failed to restore file");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to permanently delete this file?")) return;
        try {
            await apiService.deleteFile(id.toString());
            loadFiles(); // Reload list
        } catch (error) {
            console.error("Failed to delete file:", error);
            alert("Failed to delete file");
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between backdrop-blur-sm bg-black/20 p-4 rounded-2xl border border-white/5">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tighter">
                        QUARANTINE <span className="text-cyber-primary">VAULT</span>
                    </h2>
                    <p className="text-gray-400 text-sm tracking-widest uppercase mt-1">Isolated Threats Management</p>
                </div>
                <button onClick={loadFiles} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <RefreshCw className="w-5 h-5 text-cyber-primary" />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="text-center text-muted-foreground">Loading vault contents...</div>
                ) : files.length > 0 ? (
                    files.map((file) => (
                        <div key={file.id} className="p-6 rounded-xl bg-card border border-border flex items-center justify-between group hover:border-cyber-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-red-500/10 text-red-500">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">{file.filename}</h3>
                                    <p className="text-sm text-muted-foreground font-mono">{file.original_path}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">
                                            {file.reason}
                                        </span>
                                        <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                                            {new Date(file.timestamp || file.date).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleRestore(file.id)}
                                    className="p-2 hover:bg-green-500/20 hover:text-green-400 rounded-lg transition-colors"
                                    title="Restore"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(file.id)}
                                    className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
                                    title="Delete Permanently"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 text-center border border-dashed border-border rounded-xl bg-card/50">
                        <ShieldCheck className="w-20 h-20 text-green-500/20 mb-6" />
                        <h3 className="text-2xl font-bold text-foreground mb-2">Vault is Empty</h3>
                        <p className="text-muted-foreground max-w-md">
                            No files are currently in quarantine. Your system is clean and no threats have been isolated recently.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
