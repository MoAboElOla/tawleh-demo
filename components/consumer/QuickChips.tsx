"use client";

import {
  Layers, Leaf, CircleDot, Flame, Cookie,
  Users, Moon, Shuffle, Dumbbell, Heart,
} from "lucide-react";

const chips = [
  { label: "Heavy & Filling", query: "something heavy and filling", icon: Layers, tint: "bg-amber-100 text-amber-700" },
  { label: "Healthy", query: "healthy but filling", icon: Leaf, tint: "bg-emerald-100 text-emerald-700" },
  { label: "Burger", query: "best burger in town", icon: CircleDot, tint: "bg-orange-100 text-orange-700" },
  { label: "Spicy", query: "something spicy", icon: Flame, tint: "bg-red-100 text-red-600" },
  { label: "Sweet", query: "something sweet with strawberry", icon: Cookie, tint: "bg-pink-100 text-pink-700" },
  { label: "Group", query: "feeding 6 people family sharing platter", icon: Users, tint: "bg-indigo-100 text-indigo-700" },
  { label: "Late Night", query: "late night comfort food", icon: Moon, tint: "bg-slate-200 text-slate-700" },
  { label: "Surprise Me", query: "surprise me", icon: Shuffle, tint: "bg-saffron-light text-saffron-dark" },
  { label: "High Protein", query: "high protein but not boring", icon: Dumbbell, tint: "bg-blue-100 text-blue-700" },
  { label: "Comfort", query: "late night comfort food cheesy heavy", icon: Heart, tint: "bg-rose-100 text-rose-700" },
];

interface QuickChipsProps {
  onSelect: (query: string) => void;
  disabled?: boolean;
}

export default function QuickChips({ onSelect, disabled }: QuickChipsProps) {
  return (
    <div className="grid grid-cols-5 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-2.5">
      {chips.map(({ label, query, icon: Icon, tint }) => (
        <button
          key={label}
          onClick={() => onSelect(query)}
          disabled={disabled}
          className="group flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-2.5 sm:py-2 rounded-2xl sm:rounded-full border border-border-soft bg-white/80 backdrop-blur text-text-main text-[10px] sm:text-sm font-semibold shadow-soft hover:border-primary hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={`flex items-center justify-center w-7 h-7 sm:w-6 sm:h-6 rounded-full ${tint} group-hover:scale-110 transition-transform`}>
            <Icon size={13} className="shrink-0" />
          </span>
          <span className="leading-tight text-center">{label}</span>
        </button>
      ))}
    </div>
  );
}
