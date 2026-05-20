"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const rotatingWords = ["craving?", "hungry for?", "in the mood for?"];

export default function HeroTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % rotatingWords.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center"
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold text-text-main tracking-tight leading-tight text-center">
        <span className="block">What are you</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={rotatingWords[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="block text-primary whitespace-nowrap"
          >
            {rotatingWords[index]}
          </motion.span>
        </AnimatePresence>
      </h1>

      <p className="mt-5 text-text-muted text-base sm:text-lg font-medium max-w-md">
        Describe your mood, craving, group size, or dietary preference.
      </p>
    </motion.div>
  );
}
