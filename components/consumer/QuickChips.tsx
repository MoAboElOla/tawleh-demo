"use client";

import {
  Layers, Leaf, CircleDot, Flame, Cookie,
  Users, Moon, Shuffle, Dumbbell, Heart,
} from "lucide-react";

const chips = [
  { label: "Heavy & Filling", query: "something heavy and filling", icon: Layers },
  { label: "Healthy", query: "healthy but filling", icon: Leaf },
  { label: "Burger", query: "best burger in town", icon: CircleDot },
  { label: "Spicy", query: "something spicy", icon: Flame },
  { label: "Something Sweet", query: "something sweet with strawberry", icon: Cookie },
  { label: "Feeding a Group", query: "feeding 6 people family sharing platter", icon: Users },
  { label: "Late Night", query: "late night comfort food", icon: Moon },
  { label: "Surprise Me", query: "surprise me", icon: Shuffle },
  { label: "High Protein", query: "high protein but not boring", icon: Dumbbell },
  { label: "Comfort Food", query: "late night comfort food cheesy heavy", icon: Heart },
];

interface QuickChipsProps {
  onSelect: (query: string) => void;
  disabled?: boolean;
}

export default function QuickChips({ onSelect, disabled }: QuickChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {chips.map(({ label, query, icon: Icon }) => (
        <button
          key={label}
          onClick={() => onSelect(query)}
          disabled={disabled}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border-soft bg-white text-text-main text-sm font-medium shadow-soft hover:border-primary hover:text-primary hover:bg-accent-blush transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon size={14} className="shrink-0" />
          {label}
        </button>
      ))}
    </div>
  );
}
