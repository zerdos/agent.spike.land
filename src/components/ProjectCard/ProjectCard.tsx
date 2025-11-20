import { Project } from '../../types';
import './ProjectCard.css';

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const statusClass = `status-badge status-${project.status}`;

    return (
        <div className="project-card">
            <div className="project-header">
                <h3 className="project-name">{project.name}</h3>
                <span className={statusClass}>{project.status}</span>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-footer">
                <span className="agent-count">
                    {project.agentCount} {project.agentCount === 1 ? 'agent' : 'agents'}
                </span>
                <span className="last-activity">
                    Last active: {new Date(project.lastActivity).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
}
