"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import { Check, Plus, Trash2, FileSpreadsheet, Target } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

const STORAGE_KEY = "super-agent-tasks";

const priorityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
};

export default function TaskTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [isExporting, setIsExporting] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      priority,
    };
    
    setTasks([task, ...tasks]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    
    // Create CSV content (compatible with Excel)
    const headers = ["Task", "Status", "Priority"];
    const rows = tasks.map(t => [
      t.text,
      t.completed ? "Completed" : "Pending",
      t.priority,
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    // Download as CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tasks_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card title="Aufgaben" icon={<Target className="w-5 h-5" />} accentColor="secondary">
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fortschritt</span>
            <span className="text-primary font-medium">{completedCount}/{totalCount}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Add Task Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Neue Aufgabe..."
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
            className="px-2 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Med</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={addTask}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-4">
              Keine Aufgaben vorhanden
            </p>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className={`
                  flex items-center gap-2 p-2 rounded-lg border
                  ${task.completed ? "bg-muted/30" : "bg-background"}
                  border-border hover:border-primary/30 transition-colors
                `}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center
                    transition-colors
                    ${task.completed
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30 hover:border-primary"
                    }
                  `}
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </button>
                
                <span className={`flex-1 text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.text}
                </span>
                
                <span className={`text-xs px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={exportToExcel}
          disabled={isExporting || tasks.length === 0}
          className={`
            w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border
            text-sm font-medium transition-colors
            ${tasks.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-secondary/50 hover:border-secondary"
            }
          `}
        >
          <FileSpreadsheet className="w-4 h-4" />
          {isExporting ? "Exportiere..." : "Als Excel exportieren"}
        </button>
      </div>
    </Card>
  );
}
