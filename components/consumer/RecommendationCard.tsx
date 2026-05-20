"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown, ChevronUp, RotateCcw, Wheat, Milk,
  Nut, AlertTriangle, Zap,
} from "lucide-react";
import type { RecommendationResult } from "@/lib/types";
import DishImage from "./DishImage";

interface Props {
  result: RecommendationResult;
  index: number;
  onShowSimilar: (query: string) => void;
}

const allergenIcons: Record<string, React.ElementType> = {
  Gluten: Wheat,
  Dairy: Milk,
  Nuts: Nut,
  Eggs: AlertTriangle,
  Soy: AlertTriangle,
  Shellfish: AlertTriangle,
};

const spiceLabels = ["None", "Mild", "Medium", "Hot", "Very Hot", "Extreme"];

export default function RecommendationCard({ result, index, onShowSimilar }: Props) {
  const { dish, matchPercent, matchReason, matchedTags } = result;
  const [expanded, setExpanded] = useState(false);

  const matchColor =
    matchPercent >= 90
      ? "bg-success text-white"
      : matchPercent >= 80
      ? "bg-primary text-white"
      : "bg-accent-blush text-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative">
        <DishImage category={dish.category} className="w-full h-44 rounded-t-3xl" />
        <span
          className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${matchColor}`}
        >
          {matchPercent}% match
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Header */}
        <div>
          <h3 className="font-bold text-text-main text-base leading-tight">{dish.dishName}</h3>
          <p className="text-text-muted text-sm mt-0.5">{dish.restaurantName}</p>
          <p className="text-primary font-bold text-lg mt-1">QAR {dish.priceQar}</p>
        </div>

        {/* Sensory tags */}
        <div className="flex flex-wrap gap-1.5">
          {dish.sensoryTags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                matchedTags.includes(tag)
                  ? "bg-accent-blush text-primary border border-primary/20"
                  : "bg-bg-light text-text-muted"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Nutrition */}
        <div className="grid grid-cols-3 gap-2 bg-bg-light rounded-2xl p-3">
          <div className="text-center">
            <p className="text-xs text-text-muted">Cal</p>
            <p className="text-sm font-bold text-text-main">{dish.caloriesApprox}</p>
          </div>
          <div className="text-center border-x border-border-soft">
            <p className="text-xs text-text-muted">Protein</p>
            <p className="text-sm font-bold text-text-main">{dish.proteinApprox}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted">Carbs</p>
            <p className="text-sm font-bold text-text-main">{dish.carbsApprox}g</p>
          </div>
        </div>

        {/* Portion + Spice */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-bg-light text-text-muted px-2.5 py-1 rounded-full">
            {dish.portionSize}
          </span>
          {dish.spiceLevel > 0 && (
            <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
              <Zap size={10} />
              {spiceLabels[dish.spiceLevel]}
            </span>
          )}
          {dish.dietaryFlags
            .slice(0, 2)
            .map((flag) => (
              <span key={flag} className="text-xs bg-emerald-50 text-success px-2.5 py-1 rounded-full">
                {flag}
              </span>
            ))}
        </div>

        {/* Allergens */}
        {dish.allergens.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-text-muted">Contains:</span>
            {dish.allergens.map((a) => {
              const Icon = allergenIcons[a] ?? AlertTriangle;
              return (
                <span
                  key={a}
                  className="flex items-center gap-1 text-xs text-text-muted bg-bg-light px-2 py-0.5 rounded-full"
                >
                  <Icon size={10} />
                  {a}
                </span>
              );
            })}
          </div>
        )}

        {/* Why this expandable */}
        <div className="border-t border-border-soft pt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Why this?
          </button>
          {expanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-sm text-text-muted mt-2 leading-relaxed"
            >
              {matchReason}
            </motion.p>
          )}
        </div>

        {/* Show similar */}
        <button
          onClick={() => onShowSimilar(`${dish.category} ${dish.sensoryTags.slice(0, 2).join(" ")}`)}
          className="flex items-center justify-center gap-2 w-full mt-auto py-2.5 rounded-2xl border border-border-soft text-sm font-semibold text-text-main hover:border-primary hover:text-primary hover:bg-accent-blush transition-all duration-200"
        >
          <RotateCcw size={13} />
          Show Similar
        </button>
      </div>
    </motion.div>
  );
}
