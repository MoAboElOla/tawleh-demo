"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const rotatingWords = ["craving?", "hungry for?", "in the mood for?"];

export default function HeroTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center"
    >
      {/* Kicker badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-saffron/30 text-saffron-dark text-[11px] font-bold uppercase tracking-widest shadow-soft mb-6">
        <Sparkles size={11} className="text-saffron" />
        AI-powered food discovery · Doha
      </div>

      {/* Title — two lines, rotating word on its own block so it never wraps the first line */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-main tracking-tight leading-tight">
        <span className="block">What are you</span>
        <span className="block relative h-[1.15em] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={rotatingWords[index]}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center text-primary"
            >
              {rotatingWords[index]}
            </motion.span>
          </AnimatePresence>
        </span>
      </h1>

      <p className="mt-5 text-text-muted text-base sm:text-lg font-medium max-w-md">
        Describe your mood, craving, group size, or dietary preference.
      </p>
    </motion.div>
  );
}
