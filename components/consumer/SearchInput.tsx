"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search } from "lucide-react";

interface SearchInputProps {
  onSubmit: (query: string) => void;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

const placeholders = [
  "Something cheesy and heavy...",
  "Late night comfort food...",
  "Feeding 6 people...",
  "High protein but not boring...",
  "Something sweet with strawberry...",
];

export default function SearchInput({ onSubmit, value, onChange, disabled }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phIndex, setPhIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (focused || value) return;
    const interval = setInterval(() => {
      setPhIndex((i) => (i + 1) % placeholders.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [focused, value]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      onSubmit(value.trim());
    }
  };

  const showPlaceholder = !value && !focused;

  return (
    <div
      className={`relative flex items-center w-full bg-white rounded-2xl border transition-all duration-300 ${
        focused
          ? "border-primary shadow-glow"
          : "border-border-soft shadow-card hover:border-primary/40"
      }`}
    >
      <Search size={18} className={`ml-4 sm:ml-5 shrink-0 transition-colors ${focused ? "text-primary" : "text-text-muted"}`} />

      {/* Animated fake placeholder */}
      {showPlaceholder && (
        <div className="absolute left-12 sm:left-14 right-14 pointer-events-none overflow-hidden h-6 flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={phIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-text-muted text-sm sm:text-base whitespace-nowrap absolute"
            >
              {placeholders[phIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder=""
        className="flex-1 bg-transparent px-3 sm:px-4 py-4 sm:py-5 text-text-main text-sm sm:text-base outline-none rounded-2xl min-w-0"
      />
      <button
        onClick={() => value.trim() && onSubmit(value.trim())}
        disabled={disabled || !value.trim()}
        className="mr-2 p-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 hover:scale-105 active:scale-95"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
