"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronRight, AlertTriangle, Wheat, Milk, Nut, Zap } from "lucide-react";
import type { Dish } from "@/lib/types";
import DishImage from "@/components/consumer/DishImage";

// ─── Options ────────────────────────────────────────────────────────────────
const ALLERGEN_OPTIONS = ["Gluten", "Dairy", "Nuts", "Eggs", "Soy", "Shellfish"];
const DIETARY_OPTIONS = ["Vegan", "Vegetarian", "Keto", "Low Carb", "High Protein"];
const SENSORY_OPTIONS = ["Crispy","Creamy","Cheesy","Smoky","Spicy","Sweet","Tangy","Juicy","Crunchy","Fresh","Rich","Savory"];
const OCCASION_OPTIONS = ["Lunch","Dinner","Late Night","Sharing","Date Night","Office Order","Family Dinner"];
const CATEGORIES = ["Burger","Shawarma","Biryani","Rice","Grill","Pasta","Sushi","Healthy","Dessert","Drink","Late Night","Sharing","Comfort"];
const CUISINES = ["American","Levantine","South Asian","Qatari","Khaleeji","Italian","Japanese","Thai","Hawaiian","Modern","Mediterranean","Korean","French"];
const PROTEIN_TYPES = ["Beef","Chicken","Lamb","Fish","Seafood","Plant","Eggs","Mixed","None"];
const SPICE_LABELS = ["No Spice","Mild","Medium","Hot","Very Hot","Extreme"];

// ─── New chip-based attribute options ────────────────────────────────────────
const COOKING_STYLES = ["Grilled","Fried","Baked","Smoked","Raw","Steamed","Braised","Sauteed"];
const MEAT_CUTS = ["Breast","Thigh","Wings","Patty","Steak","Ribs","Minced","Whole","Fillet"];
const SIZES = ["Small","Medium","Large","150g","200g","250g","500g","1kg"];
const BREADS = ["Brioche","Potato Bun","Tortilla","Rice","Pasta","Lettuce","Sourdough","Pita","Flatbread","None"];
const SAUCES = ["Garlic","Spicy Mayo","BBQ","Truffle","Tahini","Tomato","Creamy","Sriracha","Pesto","Aioli"];
const TEXTURES = ["Crispy","Juicy","Soft","Crunchy","Tender","Flaky","Silky","Chewy"];
const SERVING_FORMATS = ["Wrap","Bowl","Plate","Box","Platter","Sandwich","Skewer","Pot"];
const GOOD_FOR = ["Solo","Two People","Group","Family","Date Night","Work Lunch","Late Night In"];

const allergenIcons: Record<string, React.ElementType> = {
  Gluten: Wheat, Dairy: Milk, Nuts: Nut,
  Eggs: AlertTriangle, Soy: AlertTriangle, Shellfish: AlertTriangle,
};

type FormData = {
  dishName: string; restaurantName: string; description: string;
  category: string; cuisine: string; priceQar: string;
  proteinType: string; spiceLevel: number; portionSize: string;
  caloriesApprox: string; proteinApprox: string; carbsApprox: string;
  allergens: string[]; dietaryFlags: string[];
  sensoryTags: string[]; occasionTags: string[];
  // new structured fields
  cookingStyles: string[]; meatCuts: string[]; sizes: string[];
  breads: string[]; sauces: string[]; textures: string[];
  servingFormats: string[]; goodFor: string[];
};

const defaultForm: FormData = {
  dishName: "", restaurantName: "", description: "",
  category: "Burger", cuisine: "American", priceQar: "",
  proteinType: "Beef", spiceLevel: 0, portionSize: "Medium",
  caloriesApprox: "", proteinApprox: "", carbsApprox: "",
  allergens: [], dietaryFlags: [],
  sensoryTags: [], occasionTags: [],
  cookingStyles: [], meatCuts: [], sizes: [],
  breads: [], sauces: [], textures: [],
  servingFormats: [], goodFor: [],
};

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

// Single-select chip group (only one active at a time)
function SingleChipGroup({ options, value, onChange, label }: {
  options: string[]; value: string; onChange: (v: string) => void; label: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-muted mb-2">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => (
          <button key={o} type="button" onClick={() => onChange(o)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
              value === o
                ? "bg-primary text-white border-primary"
                : "bg-white border-border-soft text-text-muted hover:border-primary/40 hover:text-text-main"
            }`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

// Multi-select chip group
function MultiChipGroup({ options, value, onChange, label, accent }: {
  options: string[]; value: string[]; onChange: (v: string[]) => void;
  label: string; accent?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-muted mb-2">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => {
          const active = value.includes(o);
          return (
            <button key={o} type="button" onClick={() => onChange(toggle(value, o))}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                active
                  ? accent
                    ? "bg-accent-blush text-primary border-primary/30"
                    : "bg-primary/10 text-primary border-primary/25"
                  : "bg-white border-border-soft text-text-muted hover:border-primary/30 hover:text-text-main"
              }`}>
              {active && <CheckCircle size={10} />}
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Section wrapper
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border-soft p-5 space-y-4">
      <h2 className="font-semibold text-xs uppercase tracking-widest text-primary">{title}</h2>
      {children}
    </div>
  );
}

export default function AddDishPage() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const set = <K extends keyof FormData>(field: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    const newDish: Dish = {
      id: `custom_${Date.now()}`,
      dishName: form.dishName || "Unnamed Dish",
      restaurantName: form.restaurantName || "Your Restaurant",
      category: form.category,
      cuisine: form.cuisine,
      description: form.description,
      priceQar: parseFloat(form.priceQar) || 0,
      proteinType: form.proteinType,
      spiceLevel: form.spiceLevel,
      portionSize: form.portionSize,
      caloriesApprox: parseInt(form.caloriesApprox) || 0,
      proteinApprox: parseInt(form.proteinApprox) || 0,
      carbsApprox: parseInt(form.carbsApprox) || 0,
      allergens: form.allergens,
      dietaryFlags: form.dietaryFlags,
      sensoryTags: Array.from(new Set([...form.sensoryTags, ...form.textures])),
      occasionTags: Array.from(new Set([...form.occasionTags, ...form.goodFor])),
      popularityScore: 70,
      trendScore: 75,
    };
    if (typeof window !== "undefined") {
      window.__newDishes = [newDish, ...(window.__newDishes ?? [])];
    }
    setSaved(true);
    setTimeout(() => router.push("/admin/dishes"), 1200);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-main">Add New Dish</h1>
        <p className="text-text-muted text-xs sm:text-sm mt-1">Structured tagging powers the AI recommendation engine</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ─── Form ─────────────────────────────────────────────── */}
        <div className="flex-1 space-y-4 min-w-0">

          {/* Basic Info */}
          <Section title="Basic Info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">Dish Name</label>
                <input value={form.dishName} onChange={e => set("dishName", e.target.value)}
                  placeholder="e.g. Wagyu Smash Burger"
                  className="w-full border border-border-soft rounded-xl px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">Restaurant Name</label>
                <input value={form.restaurantName} onChange={e => set("restaurantName", e.target.value)}
                  placeholder="e.g. Grind House Doha"
                  className="w-full border border-border-soft rounded-xl px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-text-muted mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  rows={2} placeholder="Describe the dish..."
                  className="w-full border border-border-soft rounded-xl px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-colors resize-none" />
              </div>
              <SingleChipGroup label="Category" options={CATEGORIES} value={form.category}
                onChange={v => set("category", v)} />
              <SingleChipGroup label="Cuisine" options={CUISINES} value={form.cuisine}
                onChange={v => set("cuisine", v)} />
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">Price (QAR)</label>
                <input type="number" value={form.priceQar} onChange={e => set("priceQar", e.target.value)}
                  placeholder="55"
                  className="w-full border border-border-soft rounded-xl px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-colors" />
              </div>
            </div>
          </Section>

          {/* Cooking Method */}
          <Section title="Cooking Method">
            <MultiChipGroup label="Cooking Style" options={COOKING_STYLES}
              value={form.cookingStyles} onChange={v => set("cookingStyles", v)} />
            <MultiChipGroup label="Serving Format" options={SERVING_FORMATS}
              value={form.servingFormats} onChange={v => set("servingFormats", v)} />
          </Section>

          {/* Protein & Cut */}
          <Section title="Protein">
            <SingleChipGroup label="Protein Type" options={PROTEIN_TYPES}
              value={form.proteinType} onChange={v => set("proteinType", v)} />
            <MultiChipGroup label="Cut / Style" options={MEAT_CUTS}
              value={form.meatCuts} onChange={v => set("meatCuts", v)} />
          </Section>

          {/* Size & Base */}
          <Section title="Size & Base">
            <SingleChipGroup label="Portion Size" options={["Small","Medium","Large","Sharing"]}
              value={form.portionSize} onChange={v => set("portionSize", v)} />
            <MultiChipGroup label="Weight / Serving Size" options={SIZES}
              value={form.sizes} onChange={v => set("sizes", v)} />
            <MultiChipGroup label="Bread / Base" options={BREADS}
              value={form.breads} onChange={v => set("breads", v)} />
          </Section>

          {/* Flavor Profile */}
          <Section title="Flavor Profile">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-2">
                Spice Level — <span className="text-primary font-bold">{SPICE_LABELS[form.spiceLevel]}</span>
              </label>
              <input type="range" min={0} max={5} value={form.spiceLevel}
                onChange={e => set("spiceLevel", parseInt(e.target.value))}
                className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>None</span><span>Extreme</span>
              </div>
            </div>
            <MultiChipGroup label="Sauce Profile" options={SAUCES}
              value={form.sauces} onChange={v => set("sauces", v)} accent />
            <MultiChipGroup label="Texture" options={TEXTURES}
              value={form.textures} onChange={v => set("textures", v)} accent />
            <MultiChipGroup label="Sensory Tags" options={SENSORY_OPTIONS}
              value={form.sensoryTags} onChange={v => set("sensoryTags", v)} accent />
          </Section>

          {/* Nutrition */}
          <Section title="Nutrition (approx.)">
            <div className="grid grid-cols-3 gap-4">
              {([["Calories", "caloriesApprox", "720"], ["Protein (g)", "proteinApprox", "42"], ["Carbs (g)", "carbsApprox", "55"]] as const).map(([label, field, ph]) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">{label}</label>
                  <input type="number" value={form[field as keyof FormData] as string}
                    onChange={e => set(field as keyof FormData, e.target.value as FormData[keyof FormData])}
                    placeholder={ph}
                    className="w-full border border-border-soft rounded-xl px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-colors" />
                </div>
              ))}
            </div>
          </Section>

          {/* Dietary + Allergens */}
          <Section title="Dietary & Allergens">
            <MultiChipGroup label="Dietary Flags" options={DIETARY_OPTIONS}
              value={form.dietaryFlags} onChange={v => set("dietaryFlags", v)} />
            <MultiChipGroup label="Allergens" options={ALLERGEN_OPTIONS}
              value={form.allergens} onChange={v => set("allergens", v)} />
          </Section>

          {/* Occasion */}
          <Section title="Occasion & Audience">
            <MultiChipGroup label="Occasion" options={OCCASION_OPTIONS}
              value={form.occasionTags} onChange={v => set("occasionTags", v)} />
            <MultiChipGroup label="Good For" options={GOOD_FOR}
              value={form.goodFor} onChange={v => set("goodFor", v)} />
          </Section>

          {/* Save */}
          <button onClick={handleSave} disabled={saved}
            className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saved ? <><CheckCircle size={16} /> Saved — redirecting...</>
                   : <><ChevronRight size={16} /> Save Dish</>}
          </button>
        </div>

        {/* ─── Live Preview ──────────────────────────────────────── */}
        <div className="hidden lg:block w-72 shrink-0 sticky top-8">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Live Preview</p>
          <div className="bg-white rounded-3xl shadow-card overflow-hidden border border-border-soft">
            <div className="relative">
              <DishImage category={form.category} className="w-full h-40" />
              <span className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full bg-primary text-white">Preview</span>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-text-main text-base leading-tight">{form.dishName || "Dish Name"}</h3>
                <p className="text-text-muted text-sm">{form.restaurantName || "Restaurant Name"}</p>
                {parseFloat(form.priceQar) > 0 && (
                  <p className="text-primary font-bold text-lg mt-1">QAR {form.priceQar}</p>
                )}
              </div>

              {/* Cooking style tags */}
              {form.cookingStyles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {form.cookingStyles.map(s => (
                    <span key={s} className="text-xs bg-bg-light text-text-muted px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}

              {/* Sensory tags */}
              {[...form.sensoryTags, ...form.textures].length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(new Set([...form.sensoryTags, ...form.textures])).slice(0, 4).map(tag => (
                    <span key={tag} className="text-xs bg-accent-blush text-primary px-2.5 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              )}

              {/* Nutrition */}
              {(parseInt(form.caloriesApprox) > 0 || parseInt(form.proteinApprox) > 0) && (
                <div className="grid grid-cols-3 gap-2 bg-bg-light rounded-2xl p-3">
                  <div className="text-center">
                    <p className="text-xs text-text-muted">Cal</p>
                    <p className="text-sm font-bold text-text-main">{form.caloriesApprox || "—"}</p>
                  </div>
                  <div className="text-center border-x border-border-soft">
                    <p className="text-xs text-text-muted">Protein</p>
                    <p className="text-sm font-bold text-text-main">{form.proteinApprox ? `${form.proteinApprox}g` : "—"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-muted">Carbs</p>
                    <p className="text-sm font-bold text-text-main">{form.carbsApprox ? `${form.carbsApprox}g` : "—"}</p>
                  </div>
                </div>
              )}

              {/* Attributes */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs bg-bg-light text-text-muted px-2.5 py-1 rounded-full">{form.portionSize}</span>
                {form.spiceLevel > 0 && (
                  <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                    <Zap size={10} />{SPICE_LABELS[form.spiceLevel]}
                  </span>
                )}
                {form.breads.slice(0, 1).map(b => (
                  <span key={b} className="text-xs bg-bg-light text-text-muted px-2.5 py-1 rounded-full">{b}</span>
                ))}
              </div>

              {/* Dietary flags */}
              {form.dietaryFlags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {form.dietaryFlags.map(f => (
                    <span key={f} className="text-xs bg-emerald-50 text-success px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
              )}

              {/* Allergens */}
              {form.allergens.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-text-muted">Contains:</span>
                  {form.allergens.map(a => {
                    const Icon = allergenIcons[a] ?? AlertTriangle;
                    return (
                      <span key={a} className="flex items-center gap-1 text-xs text-text-muted bg-bg-light px-2 py-0.5 rounded-full">
                        <Icon size={9} />{a}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sauce preview chips */}
          {form.sauces.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-text-muted mb-1.5">Sauce Profile</p>
              <div className="flex flex-wrap gap-1">
                {form.sauces.map(s => (
                  <span key={s} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Serving info */}
          {form.servingFormats.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-text-muted mb-1.5">Served as</p>
              <div className="flex flex-wrap gap-1">
                {form.servingFormats.map(s => (
                  <span key={s} className="text-xs bg-bg-light text-text-muted px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
