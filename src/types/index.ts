export interface Project {
    id: string;
    name: string;
    description: string;
    agentCount: number;
    status: 'active' | 'idle' | 'error';
    lastActivity: Date;
}

export interface Agent {
    id: string;
    name: string;
    projectId: string;
    status: 'online' | 'offline' | 'busy';
    connectedAt: Date;
}

export interface DashboardStats {
    totalProjects: number;
    totalAgents: number;
    activeAgents: number;
    offlineAgents: number;
}
