import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Super Agent Dashboard | Dein persönliches KI-Cockpit",
  description: "Your personal AI cockpit with weather, tasks, agent status, and more!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
