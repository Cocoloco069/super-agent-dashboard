"use client";

import { useState, useEffect } from "react";
import WeatherWidget from "@/components/WeatherWidget";
import TaskTracker from "@/components/TaskTracker";
import AgentStatus from "@/components/AgentStatus";
import ProjectPortfolio from "@/components/ProjectPortfolio";
import SurpriseWidget from "@/components/SurpriseWidget";
import { Sparkles, Clock, Zap } from "lucide-react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting("Guten Morgen");
    else if (hour < 18) setGreeting("Guten Tag");
    else setGreeting("Guten Abend");
  }, [currentTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-xl animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Super Agent Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">Dein persönliches KI-Cockpit</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono text-lg">{formatTime(currentTime)}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg border border-accent/30">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent">Live</span>
          </div>
        </div>
      </header>

      {/* Greeting */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-xl md:text-2xl font-semibold">
          {greeting}! 👋
        </h2>
        <p className="text-muted-foreground">{formatDate(currentTime)}</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weather Widget - Takes 1 column */}
        <div className="md:col-span-1">
          <WeatherWidget />
        </div>

        {/* Task Tracker - Takes 1 column */}
        <div className="md:col-span-1">
          <TaskTracker />
        </div>

        {/* Agent Status - Takes 1 column */}
        <div className="md:col-span-1 lg:row-span-2">
          <AgentStatus />
        </div>

        {/* Project Portfolio - Takes 2 columns on large screens */}
        <div className="md:col-span-2">
          <ProjectPortfolio />
        </div>

        {/* Surprise Widget - Takes 1 column */}
        <div className="md:col-span-1">
          <SurpriseWidget />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>🚀 Super Agent Dashboard v1.0 • Built with Next.js + Tailwind</p>
      </footer>
    </div>
  );
}
