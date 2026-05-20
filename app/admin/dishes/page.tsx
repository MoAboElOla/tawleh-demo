"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import seedDishes from "@/data/dishes.json";
import type { Dish } from "@/lib/types";
import { Search, Plus, Flame } from "lucide-react";
import DishImage from "@/components/consumer/DishImage";

const spiceLabels = ["—", "Mild", "Medium", "Hot", "Very Hot", "Extreme"];

// Global store for newly added dishes (persists within session)
declare global {
  interface Window {
    __newDishes?: Dish[];
  }
}

export default function DishesPage() {
  const [search, setSearch] = useState("");

  const allDishes: Dish[] = useMemo(() => {
    const extra = typeof window !== "undefined" ? window.__newDishes ?? [] : [];
    return [...extra, ...(seedDishes as Dish[])];
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return allDishes;
    const q = search.toLowerCase();
    return allDishes.filter(
      (d) =>
        d.dishName.toLowerCase().includes(q) ||
        d.restaurantName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.cuisine.toLowerCase().includes(q)
    );
  }, [search, allDishes]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-text-main">Dishes</h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1 truncate">{allDishes.length} dishes in database</p>
        </div>
        <Link
          href="/admin/add"
          className="flex items-center gap-2 bg-primary text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-primary-dark transition-colors shrink-0"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add Dish</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search by name, restaurant, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-border-soft rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main placeholder:text-text-muted outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border-soft overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft bg-bg-light">
                <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wide">Dish</th>
                <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wide hidden sm:table-cell">Restaurant</th>
                <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wide hidden lg:table-cell">Spice</th>
                <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wide hidden lg:table-cell">Portion</th>
                <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wide hidden xl:table-cell">Flags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((dish) => (
                <tr
                  key={dish.id}
                  className="border-b border-border-soft last:border-0 hover:bg-bg-light transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-9 h-9 rounded-xl overflow-hidden">
                        <DishImage category={dish.category} className="w-full h-full" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-main leading-tight">{dish.dishName}</p>
                        <p className="text-text-muted text-xs sm:hidden">{dish.restaurantName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted hidden sm:table-cell">{dish.restaurantName}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="bg-bg-light text-text-muted text-xs px-2.5 py-1 rounded-full">{dish.category}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-text-main">QAR {dish.priceQar}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {dish.spiceLevel > 0 ? (
                      <span className="flex items-center gap-1 text-orange-600 text-xs">
                        <Flame size={11} />
                        {spiceLabels[dish.spiceLevel]}
                      </span>
                    ) : (
                      <span className="text-text-muted text-xs">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-muted text-xs hidden lg:table-cell">{dish.portionSize}</td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {dish.dietaryFlags.slice(0, 2).map(f => (
                        <span key={f} className="text-xs bg-bg-light text-text-muted px-2 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 100 && (
          <div className="px-4 py-3 border-t border-border-soft bg-bg-light text-xs text-text-muted text-center">
            Showing 100 of {filtered.length} dishes
          </div>
        )}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-text-muted text-sm">No dishes found</div>
        )}
      </div>
    </div>
  );
}
