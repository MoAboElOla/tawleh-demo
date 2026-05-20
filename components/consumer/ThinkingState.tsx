"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, Sparkles, UtensilsCrossed } from "lucide-react";

const steps = [
  { text: "Understanding your craving...", icon: Search },
  { text: "Searching structured menus...", icon: UtensilsCrossed },
  { text: "Finding your best matches...", icon: Sparkles },
];

export default function ThinkingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 900),
      setTimeout(() => setActiveStep(2), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col gap-3 py-8 px-4">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = i <= activeStep;
        return (
          <AnimatePresence key={step.text}>
            {i <= activeStep && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-accent-blush text-primary"
                  }`}
                >
                  <Icon size={14} />
                </div>
                <span className="text-sm font-medium text-text-main">{step.text}</span>
                {i === activeStep && (
                  <motion.div
                    className="flex gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="w-1 h-1 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: dot * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}
    </div>
  );
}
