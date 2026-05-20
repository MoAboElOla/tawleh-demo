"use client";

import {
  CircleDot, Flame, Cookie, Leaf, UtensilsCrossed,
  Fish, Sandwich, Coffee, Grid3X3, Soup, Users,
} from "lucide-react";

const categoryConfig: Record<string, { gradient: string; icon: React.ElementType }> = {
  Burger: { gradient: "from-amber-400 to-orange-500", icon: CircleDot },
  Shawarma: { gradient: "from-yellow-500 to-amber-600", icon: UtensilsCrossed },
  Biryani: { gradient: "from-orange-400 to-red-500", icon: UtensilsCrossed },
  Rice: { gradient: "from-yellow-400 to-amber-500", icon: Grid3X3 },
  Grill: { gradient: "from-red-700 to-red-900", icon: Flame },
  Pasta: { gradient: "from-yellow-300 to-orange-400", icon: UtensilsCrossed },
  Sushi: { gradient: "from-rose-400 to-pink-600", icon: Fish },
  Healthy: { gradient: "from-green-400 to-emerald-600", icon: Leaf },
  Dessert: { gradient: "from-pink-400 to-rose-500", icon: Cookie },
  Drink: { gradient: "from-sky-400 to-blue-500", icon: Coffee },
  "Late Night": { gradient: "from-indigo-500 to-purple-700", icon: Soup },
  Sharing: { gradient: "from-primary to-primary-dark", icon: Users },
  Comfort: { gradient: "from-orange-300 to-amber-500", icon: Soup },
  Sandwich: { gradient: "from-lime-400 to-green-500", icon: Sandwich },
};

const defaultConfig = { gradient: "from-primary to-primary-dark", icon: UtensilsCrossed };

interface DishImageProps {
  category: string;
  className?: string;
}

export default function DishImage({ category, className = "" }: DishImageProps) {
  const config = categoryConfig[category] ?? defaultConfig;
  const Icon = config.icon;

  return (
    <div
      className={`bg-gradient-to-br ${config.gradient} flex items-center justify-center ${className}`}
    >
      <Icon size={36} className="text-white opacity-80" />
    </div>
  );
}
