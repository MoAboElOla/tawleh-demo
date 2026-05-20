"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, RefreshCw } from "lucide-react";
import Link from "next/link";
import QuickChips from "@/components/consumer/QuickChips";
import SearchInput from "@/components/consumer/SearchInput";
import ThinkingState from "@/components/consumer/ThinkingState";
import RecommendationCard from "@/components/consumer/RecommendationCard";
import TrendingCarousel from "@/components/consumer/TrendingCarousel";
import { getRecommendations } from "@/lib/recommendation-engine";
import type { RecommendationResult } from "@/lib/types";

type AppState = "idle" | "thinking" | "results";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [lastQuery, setLastQuery] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const runSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setLastQuery(q);
    setQuery(q);
    setState("thinking");
    setResults([]);

    setTimeout(() => {
      const recs = getRecommendations(q, 8);
      setResults(recs);
      setState("results");
    }, 2800);
  }, []);

  useEffect(() => {
    if (state === "results" && resultsRef.current) {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [state]);

  const handleTryAnother = () => {
    const recs = getRecommendations(lastQuery, 8);
    // Shuffle slightly for variety
    const shuffled = [...recs].sort(() => Math.random() - 0.5);
    setResults(shuffled);
  };

  return (
    <div className="min-h-screen bg-warm-white font-jakarta">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-warm-white/90 backdrop-blur border-b border-border-soft">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <LayoutGrid size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl text-text-main tracking-tight">Tawleh</span>
          </div>
          <Link
            href="/admin"
            className="text-sm font-semibold px-4 py-2 rounded-xl border border-border-soft text-text-muted hover:text-primary hover:border-primary hover:bg-accent-blush transition-all duration-200"
          >
            View Restaurant Portal
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-4 pt-16 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-main leading-tight tracking-tight">
            What are you{" "}
            <span className="text-primary">craving?</span>
          </h1>
          <p className="mt-4 text-text-muted text-base sm:text-lg font-medium">
            Describe your mood, craving, group size, or dietary preference.
          </p>
        </motion.div>

        {/* Quick chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8"
        >
          <QuickChips onSelect={runSearch} disabled={state === "thinking"} />
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5"
        >
          <SearchInput
            value={query}
            onChange={setQuery}
            onSubmit={runSearch}
            disabled={state === "thinking"}
          />
        </motion.div>
      </section>

      {/* Thinking state */}
      <AnimatePresence>
        {state === "thinking" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-sm mx-auto px-4 py-4"
          >
            <ThinkingState />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {state === "results" && results.length > 0 && (
          <motion.section
            ref={resultsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto px-4 pb-20"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-xl text-text-main">
                  {results.length} dishes for you
                </h2>
                <p className="text-text-muted text-sm mt-0.5">
                  Based on: <span className="text-primary font-medium">&ldquo;{lastQuery}&rdquo;</span>
                </p>
              </div>
              <button
                onClick={handleTryAnother}
                className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark px-4 py-2 rounded-xl border border-primary/30 hover:bg-accent-blush transition-all"
              >
                <RefreshCw size={14} />
                Try another set
              </button>
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="sm:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
              {results.map((result, i) => (
                <div key={result.dish.id} className="snap-start shrink-0 w-72">
                  <RecommendationCard
                    result={result}
                    index={i}
                    onShowSimilar={runSearch}
                  />
                </div>
              ))}
            </div>

            {/* Desktop: grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {results.map((result, i) => (
                <RecommendationCard
                  key={result.dish.id}
                  result={result}
                  index={i}
                  onShowSimilar={runSearch}
                />
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Idle + results: always show carousel below */}
      {state !== "thinking" && (
        <div className="pb-20">
          {state === "idle" && (
            <div className="max-w-2xl mx-auto px-4 text-center mb-2">
              <p className="text-text-muted text-sm">
                Try: &ldquo;Something spicy but no chicken&rdquo; or &ldquo;Feeding 6 people&rdquo;
              </p>
            </div>
          )}
          <TrendingCarousel onDishClick={runSearch} />
        </div>
      )}
    </div>
  );
}
