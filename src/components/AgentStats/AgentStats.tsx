import './AgentStats.css';

interface AgentStatsProps {
    totalAgents: number;
    activeAgents: number;
    offlineAgents: number;
}

export default function AgentStats({ totalAgents, activeAgents, offlineAgents }: AgentStatsProps) {
    return (
        <div className="agent-stats">
            <div className="stat-card stat-card-primary">
                <div className="stat-value">{totalAgents}</div>
                <div className="stat-label">Total Agents</div>
            </div>
            <div className="stat-card stat-card-success">
                <div className="stat-value">{activeAgents}</div>
                <div className="stat-label">Active</div>
            </div>
            <div className="stat-card stat-card-muted">
                <div className="stat-value">{offlineAgents}</div>
                <div className="stat-label">Offline</div>
            </div>
        </div>
    );
}
