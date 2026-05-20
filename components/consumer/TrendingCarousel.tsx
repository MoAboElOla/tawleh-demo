"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Shuffle, ChevronRight, Zap } from "lucide-react";
import allDishesRaw from "@/data/dishes.json";
import type { Dish } from "@/lib/types";
import DishImage from "./DishImage";

const allDishes = allDishesRaw as Dish[];

const FILTERS = [
  { label: "Trending", key: "trending" },
  { label: "Popular", key: "popular" },
  { label: "High Protein", key: "highprotein" },
  { label: "Light", key: "light" },
  { label: "Spicy", key: "spicy" },
  { label: "Sweet", key: "sweet" },
  { label: "Burgers", key: "burgers" },
  { label: "Rice", key: "rice" },
  { label: "Desserts", key: "desserts" },
  { label: "Sharing", key: "sharing" },
];

function filterDishes(key: string, dishes: Dish[]): Dish[] {
  switch (key) {
    case "trending":   return [...dishes].sort((a, b) => b.trendScore - a.trendScore).slice(0, 20);
    case "popular":    return [...dishes].sort((a, b) => b.popularityScore - a.popularityScore).slice(0, 20);
    case "highprotein":return dishes.filter(d => d.dietaryFlags.includes("High Protein") || d.proteinApprox >= 35).slice(0, 20);
    case "light":      return dishes.filter(d => d.caloriesApprox < 500).slice(0, 20);
    case "spicy":      return dishes.filter(d => d.spiceLevel >= 3).slice(0, 20);
    case "sweet":      return dishes.filter(d => d.sensoryTags.includes("Sweet") || d.category === "Dessert").slice(0, 20);
    case "burgers":    return dishes.filter(d => d.category === "Burger").slice(0, 20);
    case "rice":       return dishes.filter(d => d.category === "Rice" || d.category === "Biryani").slice(0, 20);
    case "desserts":   return dishes.filter(d => d.category === "Dessert").slice(0, 20);
    case "sharing":    return dishes.filter(d => d.portionSize === "Sharing" || d.occasionTags.includes("Sharing")).slice(0, 20);
    default:           return dishes.slice(0, 20);
  }
}

interface TrendingCarouselProps {
  onDishClick: (query: string) => void;
}

export default function TrendingCarousel({ onDishClick }: TrendingCarouselProps) {
  const [activeFilter, setActiveFilter] = useState("trending");
  const [shuffleKey, setShuffleKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const base = filterDishes(activeFilter, allDishes);
    // shuffleKey forces re-randomize on shuffle
    if (shuffleKey > 0) return [...base].sort(() => Math.random() - 0.5);
    return base;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, shuffleKey]);

  const handleShuffle = () => setShuffleKey(k => k + 1);

  const handleFilterChange = (key: string) => {
    setActiveFilter(key);
    setShuffleKey(0);
    scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full mt-10">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 mb-4 max-w-6xl mx-auto">
        <h2 className="font-bold text-lg text-text-main">Trending on Tawleh</h2>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark px-3 py-1.5 rounded-xl border border-primary/20 hover:bg-accent-blush transition-all"
        >
          <Shuffle size={13} />
          Shuffle
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-3 max-w-6xl mx-auto">
        {FILTERS.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => handleFilterChange(key)}
            className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
              activeFilter === key
                ? "bg-primary text-white border-primary shadow-soft"
                : "bg-white text-text-muted border-border-soft hover:border-primary hover:text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x snap-mandatory"
      >
        {filtered.map((dish, i) => (
          <motion.button
            key={`${dish.id}-${shuffleKey}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            onClick={() => onDishClick(`${dish.category} ${dish.sensoryTags.slice(0, 2).join(" ")} ${dish.dishName}`)}
            className="snap-start shrink-0 w-48 bg-white rounded-2xl shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200 overflow-hidden text-left group"
          >
            {/* Image */}
            <div className="relative">
              <DishImage category={dish.category} className="w-full h-32" />
              {dish.spiceLevel >= 3 && (
                <span className="absolute bottom-2 left-2 flex items-center gap-1 text-xs font-semibold bg-white/90 text-orange-600 px-2 py-0.5 rounded-full">
                  <Zap size={10} /> Spicy
                </span>
              )}
              {dish.trendScore >= 90 && (
                <span className="absolute top-2 right-2 text-xs font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                  Hot
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="font-bold text-text-main text-sm leading-tight line-clamp-1">{dish.dishName}</p>
              <p className="text-text-muted text-xs mt-0.5 line-clamp-1">{dish.restaurantName}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-primary font-bold text-sm">QAR {dish.priceQar}</span>
                <ChevronRight size={13} className="text-text-muted group-hover:text-primary transition-colors" />
              </div>
              {/* Sensory tags */}
              <div className="flex gap-1 mt-2 flex-wrap">
                {dish.sensoryTags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs bg-bg-light text-text-muted px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
