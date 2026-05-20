import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tawleh — What are you craving?",
  description: "AI-native food discovery. Describe your craving and find the perfect dish.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
