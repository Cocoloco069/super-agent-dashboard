"use client";

import Card from "./Card";
import { FolderKanban, ArrowRight, Code, Layers } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "planning" | "completed";
  progress: number;
  technologies: string[];
}

const projects: Project[] = [
  {
    id: "1",
    name: "Super Agent Dashboard",
    description: "Personal AI cockpit with weather, tasks, and agent monitoring",
    status: "active",
    progress: 75,
    technologies: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    id: "2",
    name: "Lisa Portfolio",
    description: "Beautiful portfolio website for creative projects",
    status: "active",
    progress: 90,
    technologies: ["React", "Framer", "CSS"],
  },
  {
    id: "3",
    name: "ColorSnap",
    description: "AI-powered color palette generator from images",
    status: "completed",
    progress: 100,
    technologies: ["Python", "OpenCV", "FastAPI"],
  },
  {
    id: "4",
    name: "OpenClaw Integration",
    description: "Advanced agent orchestration system",
    status: "planning",
    progress: 20,
    technologies: ["Node.js", "MCP", "WebSocket"],
  },
];

const statusColors = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  planning: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completed: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const statusLabels = {
  active: "Active",
  planning: "Planning",
  completed: "Completed",
};

export default function ProjectPortfolio() {
  return (
    <Card title="Projekt Portfolio" icon={<FolderKanban className="w-5 h-5" />} accentColor="primary">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="group p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {project.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {project.description}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[project.status]}`}>
                {statusLabels[project.status]}
              </span>
            </div>

            {/* Progress */}
            {project.status !== "completed" && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Fortschritt</span>
                  <span className="text-primary">{project.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Technologies */}
            <div className="flex flex-wrap gap-1 mt-3">
              {project.technologies.map(tech => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action */}
            <button className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
              Mehr Details
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Code className="w-4 h-4" />
            <span>{projects.length} Projekte</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Layers className="w-4 h-4" />
            <span>{projects.filter(p => p.status === "active").length} aktiv</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
