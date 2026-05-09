import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Event {
    id: number;
    timestamp: string;
    file_path: string;
    event_type: string;
    is_suspicious: boolean;
    details: {
        entropy?: number;
        burst_count?: number;
        reasons?: string[];
    };
}

export interface Alert {
    id: number;
    timestamp: string;
    severity: string;
    message: string;
    status: string;
    related_event_id?: number;
}

export interface MonitoredPath {
    id: number;
    path: string;
    is_active: boolean;
}

export const apiService = {
    // Events
    getEvents: async (skip = 0, limit = 100): Promise<Event[]> => {
        const response = await api.get(`/events/?skip=${skip}&limit=${limit}`);
        return response.data;
    },

    createEvent: async (eventData: Partial<Event>) => {
        const response = await api.post('/events/', eventData);
        return response.data;
    },

    // Alerts
    getAlerts: async (skip = 0, limit = 50): Promise<Alert[]> => {
        const response = await api.get(`/alerts/?skip=${skip}&limit=${limit}`);
        return response.data;
    },

    // Settings
    getMonitoredPaths: async (): Promise<MonitoredPath[]> => {
        const response = await api.get('/settings/paths');
        return response.data;
    },

    addMonitoredPath: async (path: string) => {
        const response = await api.post(`/settings/paths?path=${encodeURIComponent(path)}`);
        return response.data;
    },

    removeMonitoredPath: async (pathId: number) => {
        const response = await api.delete(`/settings/paths/${pathId}`);
        return response.data;
    },

    // Simulation
    startSimulation: async (): Promise<{ status: string; message: string }> => {
        const response = await api.post('/simulation/start');
        return response.data;
    },

    // Quarantine
    getQuarantinedFiles: async (): Promise<any[]> => {
        const response = await api.get('/quarantine/');
        return response.data;
    },

    restoreFile: async (id: string) => {
        const response = await api.post(`/quarantine/${id}/restore`);
        return response.data;
    },

    deleteFile: async (id: string) => {
        const response = await api.delete(`/quarantine/${id}`);
        return response.data;
    },

    // General Settings
    getConfig: async (): Promise<Record<string, any>> => {
        const response = await api.get('/settings/config');
        return response.data;
    },

    updateConfig: async (config: Record<string, any>) => {
        const response = await api.post('/settings/config', config);
        return response.data;
    },
};
