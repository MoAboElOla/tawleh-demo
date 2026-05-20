"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, X } from "lucide-react";
import type { Chip } from "./QuickChips";

interface SearchInputProps {
  onSubmit: (query: string) => void;
  textValue: string;
  onTextChange: (v: string) => void;
  selectedChips: Chip[];
  onRemoveChip: (label: string) => void;
  disabled?: boolean;
}

const placeholders = [
  "Or type something...",
  "Add more details...",
  "e.g. no chicken...",
  "e.g. under QAR 50...",
  "e.g. something crispy...",
];

const idlePlaceholders = [
  "Something cheesy and heavy...",
  "Late night comfort food...",
  "Feeding 6 people...",
  "High protein but not boring...",
  "Something sweet with strawberry...",
];

export default function SearchInput({
  onSubmit, textValue, onTextChange,
  selectedChips, onRemoveChip, disabled,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phIndex, setPhIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  const hasChips = selectedChips.length > 0;
  const pool = hasChips ? placeholders : idlePlaceholders;

  useEffect(() => {
    setPhIndex(0);
  }, [hasChips]);

  useEffect(() => {
    if (focused || textValue) return;
    const interval = setInterval(() => {
      setPhIndex((i) => (i + 1) % pool.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [focused, textValue, pool.length]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const chipPart = selectedChips.map((c) => c.query).join(" ");
      const combined = [chipPart, textValue.trim()].filter(Boolean).join(" ");
      if (combined) onSubmit(combined);
    }
    // Backspace on empty text removes last chip
    if (e.key === "Backspace" && !textValue && hasChips) {
      onRemoveChip(selectedChips[selectedChips.length - 1].label);
    }
  };

  const handleSubmit = () => {
    const chipPart = selectedChips.map((c) => c.query).join(" ");
    const combined = [chipPart, textValue.trim()].filter(Boolean).join(" ");
    if (combined) onSubmit(combined);
  };

  const showPlaceholder = !textValue && !focused;
  const canSubmit = hasChips || !!textValue.trim();

  return (
    <div
      className={`relative flex items-start w-full bg-white rounded-2xl border transition-all duration-300 ${
        focused
          ? "border-primary shadow-glow"
          : "border-border-soft shadow-card hover:border-primary/40"
      }`}
    >
      <Search
        size={18}
        className={`mt-4 ml-4 sm:ml-5 shrink-0 transition-colors ${focused ? "text-primary" : "text-text-muted"}`}
      />

      {/* Chips + text area */}
      <div className="flex-1 flex flex-wrap items-center gap-1.5 px-3 py-3 min-w-0">
        {/* Selected chip pills */}
        <AnimatePresence>
          {selectedChips.map((chip) => (
            <motion.span
              key={chip.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-1 bg-primary text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shrink-0"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => onRemoveChip(chip.label)}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X size={10} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Text input with animated placeholder overlay */}
        <div className="relative flex-1 min-w-[80px] flex items-center">
          {showPlaceholder && (
            <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-text-muted text-sm sm:text-base whitespace-nowrap absolute"
                >
                  {pool[phIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            disabled={disabled}
            placeholder=""
            className="w-full bg-transparent py-1 text-text-main text-sm sm:text-base outline-none"
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={disabled || !canSubmit}
        className="m-2 mt-2 p-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 hover:scale-105 active:scale-95 self-start"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
