"use client";

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  accentColor?: "primary" | "secondary" | "accent" | "destructive";
}

const accentColors = {
  primary: "border-primary/30 hover:border-primary/60",
  secondary: "border-secondary/30 hover:border-secondary/60",
  accent: "border-accent/30 hover:border-accent/60",
  destructive: "border-destructive/30 hover:border-destructive/60",
};

export default function Card({ title, icon, children, className = "", accentColor = "primary" }: CardProps) {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-card/80 backdrop-blur-xl
        border border-border rounded-xl
        ${accentColors[accentColor]}
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10
        group
        ${className}
      `}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border/50">
        {icon && <span className="text-primary">{icon}</span>}
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
