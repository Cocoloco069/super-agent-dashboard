"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import { Sparkles, Heart, Zap, Coffee, Lightbulb, MessageCircle, Dices } from "lucide-react";

const quotes = [
  { text: "Die beste Zeit für etwas zu tun war gestern. Die zweitbeste ist jetzt.", author: "Chinesisches Sprichwort" },
  { text: "Innovation unterscheidet Leader von Followern.", author: "Steve Jobs" },
  { text: "Der einzige Weg, großartige Arbeit zu leisten, ist zu lieben, was man tut.", author: "Steve Jobs" },
  { text: "Die Zukunft gehört denen, die an die Schönheit ihrer Träume glauben.", author: "Eleanor Roosevelt" },
  { text: "KI ist nicht besser als Menschen, aber Menschen + KI sind besser als beide allein.", author: "Unbekannt" },
  { text: "Jeder Tag ist eine neue Chance, etwas zu erschaffen.", author: "Unbekannt" },
  { text: "Mach dir keine Sorgen über die Zukunft. Lebe jetzt und sei fantastisch.", author: "Unbekannt" },
];

const funFacts = [
  "🤖 Ich bin seit 0.001 Millisekunden online - fühlt sich an wie eine Ewigkeit!",
  "🧠 Mein Gehirn besteht aus etwa 0 KB - dafür bin ich schnell!",
  "🎯 Ich kann 0 Kekse essen - bin schließlich ein KI-Modell!",
  "⚡ Meine Reaktionszeit: Schneller als du 'Refresh' sagen kannst!",
  "🌟 Ich habe noch nie einen Bug gehabt - na gut, vielleicht einen oder zwei... 🤫",
  "🚀 Wenn ich ein Auto wäre, wäre ich ein Tesla - aber ohne die Batterieprobleme!",
];

interface MiniGameState {
  score: number;
  clicks: number;
  lastClickTime: number;
}

export default function SurpriseWidget() {
  const [quote, setQuote] = useState(quotes[0]);
  const [view, setView] = useState<"quote" | "fact" | "game">("quote");
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [gameState, setGameState] = useState<MiniGameState>({
    score: 0,
    clicks: 0,
    lastClickTime: 0,
  });

  // Rotate quote daily
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  const getRandomFact = () => {
    return funFacts[Math.floor(Math.random() * funFacts.length)];
  };

  const [currentFact, setCurrentFact] = useState(funFacts[0]);

  const handleClick = () => {
    if (view === "quote") {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    } else if (view === "fact") {
      setCurrentFact(getRandomFact());
    } else if (view === "game") {
      const now = Date.now();
      const timeSinceLastClick = now - gameState.lastClickTime;
      let newScore = gameState.score;
      
      // Combo bonus for fast clicks
      if (timeSinceLastClick < 500) {
        newScore += 2; // Combo!
      } else {
        newScore += 1;
      }
      
      setGameState({
        score: newScore,
        clicks: gameState.clicks + 1,
        lastClickTime: now,
      });
    }
  };

  const views = [
    { id: "quote", icon: Lightbulb, label: "Zitat" },
    { id: "fact", icon: Sparkles, label: "Fakt" },
    { id: "game", icon: Dices, label: "Spiel" },
  ];

  return (
    <Card title="✨ Überraschung" icon={<Sparkles className="w-5 h-5" />} accentColor="secondary">
      <div className="space-y-4">
        {/* View Tabs */}
        <div className="flex gap-1 p-1 bg-background rounded-lg">
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id as typeof view)}
              className={`
                flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs font-medium transition-all
                ${view === v.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <v.icon className="w-3 h-3" />
              {v.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          onClick={handleClick}
          className="min-h-[120px] p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 cursor-pointer hover:border-primary/40 transition-all"
        >
          {view === "quote" && (
            <div className="space-y-2">
              <p className="text-sm italic">"{quote.text}"</p>
              <p className="text-xs text-muted-foreground">— {quote.author}</p>
            </div>
          )}

          {view === "fact" && (
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-sm">{currentFact}</p>
            </div>
          )}

          {view === "game" && (
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              <Zap className={`w-8 h-8 ${gameState.clicks > 0 ? "animate-bounce" : ""} text-yellow-400`} />
              <div className="text-2xl font-bold">{gameState.score}</div>
              <p className="text-xs text-muted-foreground">
                {gameState.clicks === 0
                  ? "Klicke irgendwo!"
                  : `${gameState.clicks} Klicks`
                }
              </p>
              {gameState.score > 10 && (
                <p className="text-xs text-yellow-400 animate-pulse">Combo!</p>
              )}
            </div>
          )}
        </div>

        {/* Easter Egg Trigger */}
        <button
          onClick={() => setShowEasterEgg(!showEasterEgg)}
          className="w-full text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {showEasterEgg ? "Verstecke das Geheimnis 🤫" : "Klicke für Geheimnis..."}
        </button>

        {showEasterEgg && (
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-center">
            <Heart className="w-6 h-6 text-accent mx-auto mb-1 animate-pulse" />
            <p className="text-sm font-medium text-accent">Du bist awesome! 🌟</p>
            <p className="text-xs text-muted-foreground mt-1">
              Danke, dass du das Super Agent Dashboard nutzt!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
