"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import { Users, Circle, Activity, Bot } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  status: "online" | "busy" | "offline";
  currentTask: string;
  lastActivity: string;
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Director",
    status: "online",
    currentTask: "Planning new features",
    lastActivity: "Gerade eben",
  },
  {
    id: "2",
    name: "Builder",
    status: "busy",
    currentTask: "Implementing components",
    lastActivity: "Vor 2 Min",
  },
  {
    id: "3",
    name: "QA",
    status: "online",
    currentTask: "Running tests",
    lastActivity: "Gerade eben",
  },
  {
    id: "4",
    name: "Scout",
    status: "offline",
    currentTask: "Researching APIs",
    lastActivity: "Vor 1 Std",
  },
  {
    id: "5",
    name: "Spec",
    status: "online",
    currentTask: "Writing specifications",
    lastActivity: "Vor 5 Min",
  },
  {
    id: "6",
    name: "Release",
    status: "busy",
    currentTask: "Deploying to Vercel",
    lastActivity: "Vor 1 Min",
  },
];

const statusColors = {
  online: "bg-green-500",
  busy: "bg-yellow-500",
  offline: "bg-gray-500",
};

const statusTextColors = {
  online: "text-green-400",
  busy: "text-yellow-400",
  offline: "text-gray-400",
};

export default function AgentStatus() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [isLoading, setIsLoading] = useState(false);

  // Try to fetch real agent status from local API
  const fetchAgentStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/agents", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.agents && Array.isArray(data.agents)) {
          setAgents(data.agents);
        }
      }
    } catch {
      // Use mock data if API not available
      console.log("Using mock agent data");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const onlineCount = agents.filter(a => a.status !== "offline").length;

  return (
    <Card title="Agent Status" icon={<Users className="w-5 h-5" />} accentColor="accent">
      <div className="space-y-4">
        {/* Summary */}
        <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            <span className="text-sm">Aktiv</span>
          </div>
          <span className="text-lg font-bold text-accent">
            {onlineCount}/{agents.length}
          </span>
        </div>

        {/* Agent List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {agents.map(agent => (
            <div
              key={agent.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border border-border hover:border-accent/30 transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{agent.name}</span>
                  <span className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {agent.currentTask}
                </p>
              </div>
              
              {/* Status */}
              <span className={`text-xs ${statusTextColors[agent.status]}`}>
                {agent.status === "online" ? "Online" : agent.status === "busy" ? "Busy" : "Offline"}
              </span>
            </div>
          ))}
        </div>

        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-center">
          <Circle className="w-2 h-2 inline mr-1 animate-pulse text-accent" />
          Aktualisiert alle 10 Sekunden
        </div>
      </div>
    </Card>
  );
}
