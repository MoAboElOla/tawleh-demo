"use client";

import { useState, useMemo } from "react";
import dishes from "@/data/dishes.json";
import type { Dish } from "@/lib/types";
import {
  Store, Clock, MapPin, Tag, ChevronDown, CheckCircle,
  Truck, ShoppingBag, Star,
} from "lucide-react";

const allDishes = dishes as Dish[];

const RESTAURANT_TAGS = [
  "Family Friendly","Late Night","Premium","Casual","Healthy",
  "Desserts","Grills","Fast Casual","Date Night","Trendy",
];

const PRICE_RANGES = ["Budget (Under QAR 30)","Mid-Range (QAR 30–80)","Premium (QAR 80–150)","Luxury (QAR 150+)"];

const HOURS_PRESETS = [
  "8:00 AM – 11:00 PM","10:00 AM – 12:00 AM","12:00 PM – 11:00 PM",
  "11:00 AM – 2:00 AM","Open 24 Hours",
];

type RestaurantProfile = {
  name: string; cuisine: string; branch: string; priceRange: string;
  hours: string; delivery: boolean; pickup: boolean;
  tags: string[]; popularCategories: string[];
};

function buildDefaultProfile(name: string, restDishes: Dish[]): RestaurantProfile {
  const categories = Array.from(new Set(restDishes.map(d => d.category))).slice(0, 4);
  const cuisine = restDishes[0]?.cuisine ?? "Modern";
  const avgPrice = restDishes.reduce((a, b) => a + b.priceQar, 0) / (restDishes.length || 1);
  const priceRange = avgPrice < 40 ? PRICE_RANGES[0] : avgPrice < 80 ? PRICE_RANGES[1] : avgPrice < 140 ? PRICE_RANGES[2] : PRICE_RANGES[3];
  return {
    name, cuisine, branch: "Doha, Qatar", priceRange,
    hours: "11:00 AM – 11:00 PM", delivery: true, pickup: true,
    tags: [], popularCategories: categories,
  };
}

function ToggleChip({ label, active, onChange }: { label: string; active: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
        active ? "bg-accent-blush text-primary border-primary/30" : "bg-white border-border-soft text-text-muted hover:border-primary/30"
      }`}>
      {active && <CheckCircle size={10} />}
      {label}
    </button>
  );
}

export default function RestaurantsPage() {
  // Derive unique restaurant names from dishes
  const restaurants = useMemo(() => {
    const map = new Map<string, Dish[]>();
    allDishes.forEach(d => {
      if (!map.has(d.restaurantName)) map.set(d.restaurantName, []);
      map.get(d.restaurantName)!.push(d);
    });
    return Array.from(map.entries()).map(([name, dishes]) => ({ name, dishes }));
  }, []);

  const [selectedName, setSelectedName] = useState(restaurants[0]?.name ?? "");
  const [profiles, setProfiles] = useState<Record<string, RestaurantProfile>>({});
  const [saved, setSaved] = useState(false);

  const currentDishes = useMemo(
    () => restaurants.find(r => r.name === selectedName)?.dishes ?? [],
    [restaurants, selectedName]
  );

  const profile: RestaurantProfile = profiles[selectedName] ?? buildDefaultProfile(selectedName, currentDishes);

  const updateProfile = (patch: Partial<RestaurantProfile>) => {
    setSaved(false);
    setProfiles(prev => ({
      ...prev,
      [selectedName]: { ...profile, ...patch },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-main">Restaurant Profiles</h1>
        <p className="text-text-muted text-sm mt-1">{restaurants.length} restaurants in the network</p>
      </div>

      <div className="flex gap-5 items-start">
        {/* ─── Restaurant list ───────────────────────────────────── */}
        <div className="w-52 shrink-0 bg-white rounded-2xl border border-border-soft overflow-hidden shadow-soft">
          <div className="p-3 border-b border-border-soft">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Restaurants</p>
          </div>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {restaurants.map(({ name, dishes: rd }) => (
              <button key={name} onClick={() => { setSelectedName(name); setSaved(false); }}
                className={`w-full text-left px-3 py-2.5 border-b border-border-soft last:border-0 transition-colors ${
                  selectedName === name ? "bg-accent-blush" : "hover:bg-bg-light"
                }`}>
                <p className={`text-sm font-semibold leading-tight ${selectedName === name ? "text-primary" : "text-text-main"}`}>
                  {name}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{rd.length} dishes</p>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Profile editor ────────────────────────────────────── */}
        <div className="flex-1 space-y-4">

          {/* Header card */}
          <div className="bg-white rounded-2xl border border-border-soft p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shrink-0">
                <Store size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-text-main">{profile.name}</h2>
                <p className="text-text-muted text-sm">{profile.cuisine} · {profile.branch}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    <Star size={10} fill="currentColor" /> {(3.8 + (selectedName.charCodeAt(0) % 10) * 0.12).toFixed(1)}
                  </span>
                  <span className="text-xs text-text-muted">{currentDishes.length} dishes listed</span>
                  <span className="text-xs text-text-muted">{profile.priceRange.split(" ")[0]}</span>
                </div>
              </div>
              <button onClick={handleSave}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                  saved ? "bg-success text-white" : "bg-primary text-white hover:bg-primary-dark"
                }`}>
                {saved ? <><CheckCircle size={14} /> Saved</> : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-border-soft p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Basic Info</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  <Store size={11} className="inline mr-1" />Restaurant Name
                </label>
                <input value={profile.name} onChange={e => updateProfile({ name: e.target.value })}
                  className="w-full border border-border-soft rounded-xl px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  <MapPin size={11} className="inline mr-1" />Branch / Location
                </label>
                <input value={profile.branch} onChange={e => updateProfile({ branch: e.target.value })}
                  placeholder="e.g. The Pearl, Doha"
                  className="w-full border border-border-soft rounded-xl px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">Cuisine Type</label>
                <input value={profile.cuisine} onChange={e => updateProfile({ cuisine: e.target.value })}
                  className="w-full border border-border-soft rounded-xl px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">Price Range</label>
                <div className="relative">
                  <select value={profile.priceRange} onChange={e => updateProfile({ priceRange: e.target.value })}
                    className="w-full border border-border-soft rounded-xl px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-colors bg-white appearance-none">
                    {PRICE_RANGES.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Hours & Availability */}
          <div className="bg-white rounded-2xl border border-border-soft p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Hours & Availability</h3>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-2">
                <Clock size={11} className="inline mr-1" />Opening Hours
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {HOURS_PRESETS.map(h => (
                  <button key={h} onClick={() => updateProfile({ hours: h })}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      profile.hours === h ? "bg-primary text-white border-primary" : "bg-white border-border-soft text-text-muted hover:border-primary/40"
                    }`}>
                    {h}
                  </button>
                ))}
              </div>
              <input value={profile.hours} onChange={e => updateProfile({ hours: e.target.value })}
                placeholder="Custom hours..."
                className="w-full border border-border-soft rounded-xl px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => updateProfile({ delivery: !profile.delivery })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${profile.delivery ? "bg-primary" : "bg-border-soft"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${profile.delivery ? "left-6" : "left-1"}`} />
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium text-text-main">
                  <Truck size={14} />Delivery
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => updateProfile({ pickup: !profile.pickup })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${profile.pickup ? "bg-primary" : "bg-border-soft"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${profile.pickup ? "left-6" : "left-1"}`} />
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium text-text-main">
                  <ShoppingBag size={14} />Pickup
                </span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-border-soft p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Restaurant Tags</h3>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-2">
                <Tag size={11} className="inline mr-1" />Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {RESTAURANT_TAGS.map(tag => (
                  <ToggleChip key={tag} label={tag}
                    active={profile.tags.includes(tag)}
                    onChange={() => updateProfile({ tags: profile.tags.includes(tag) ? profile.tags.filter(t => t !== tag) : [...profile.tags, tag] })} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-2">Popular Categories</label>
              <div className="flex flex-wrap gap-2">
                {["Burger","Shawarma","Biryani","Rice","Grill","Pasta","Sushi","Healthy","Dessert","Sharing"].map(cat => (
                  <ToggleChip key={cat} label={cat}
                    active={profile.popularCategories.includes(cat)}
                    onChange={() => updateProfile({
                      popularCategories: profile.popularCategories.includes(cat)
                        ? profile.popularCategories.filter(c => c !== cat)
                        : [...profile.popularCategories, cat]
                    })} />
                ))}
              </div>
            </div>
          </div>

          {/* Dish preview for this restaurant */}
          <div className="bg-white rounded-2xl border border-border-soft p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Listed Dishes</h3>
            <div className="space-y-2">
              {currentDishes.slice(0, 6).map((d: Dish) => (
                <div key={d.id} className="flex items-center justify-between py-1.5 border-b border-border-soft last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-text-main">{d.dishName}</p>
                    <p className="text-xs text-text-muted">{d.category} · {d.portionSize}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">QAR {d.priceQar}</span>
                </div>
              ))}
              {currentDishes.length > 6 && (
                <p className="text-xs text-text-muted pt-1">+{currentDishes.length - 6} more dishes</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
