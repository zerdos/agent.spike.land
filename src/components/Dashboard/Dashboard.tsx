import { useState } from 'react';
import { Project } from '../../types';
import AgentStats from '../AgentStats/AgentStats';
import ProjectCard from '../ProjectCard/ProjectCard';
import AgentConsole from '../AgentConsole/AgentConsole';
import './Dashboard.css';

// Mock data - will be replaced with real data later
const mockProjects: Project[] = [
    {
        id: '1',
        name: 'E-commerce Platform',
        description: 'AI agents handling customer support and order processing',
        agentCount: 5,
        status: 'active',
        lastActivity: new Date(),
    },
    {
        id: '2',
        name: 'Data Analytics Pipeline',
        description: 'Automated data processing and reporting agents',
        agentCount: 3,
        status: 'active',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: '3',
        name: 'Content Moderation',
        description: 'AI agents for content review and moderation',
        agentCount: 2,
        status: 'idle',
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
];

export default function Dashboard() {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const totalAgents = mockProjects.reduce((sum, project) => sum + project.agentCount, 0);
    const activeAgents = mockProjects
        .filter(p => p.status === 'active')
        .reduce((sum, project) => sum + project.agentCount, 0);
    const offlineAgents = totalAgents - activeAgents;

    // If a project is selected, show the agent console
    if (selectedProjectId) {
        return (
            <AgentConsole
                projectId={selectedProjectId}
                onClose={() => setSelectedProjectId(null)}
            />
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Agent Control Panel</h1>
                <p className="dashboard-subtitle">Monitor and manage your AI agents</p>
            </header>

            <section className="stats-section">
                <AgentStats
                    totalAgents={totalAgents}
                    activeAgents={activeAgents}
                    offlineAgents={offlineAgents}
                />
            </section>

            <section className="projects-section">
                <h2>Projects</h2>
                <div className="projects-grid">
                    {mockProjects.map(project => (
                        <div key={project.id} onClick={() => setSelectedProjectId(project.id)}>
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
