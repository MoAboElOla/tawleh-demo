"use client";

import { useState, useRef } from "react";
import { Send, Mic } from "lucide-react";

interface SearchInputProps {
  onSubmit: (query: string) => void;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export default function SearchInput({ onSubmit, value, onChange, disabled }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="relative flex items-center w-full bg-white rounded-2xl shadow-card border border-border-soft focus-within:border-primary focus-within:shadow-card-hover transition-all duration-200">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder="I want something cheesy, heavy, maybe spicy..."
        className="flex-1 bg-transparent px-5 py-4 text-text-main placeholder:text-text-muted text-sm outline-none rounded-2xl"
      />
      <button
        onClick={() => value.trim() && onSubmit(value.trim())}
        disabled={disabled || !value.trim()}
        className="mr-2 p-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
