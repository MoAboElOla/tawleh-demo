import Fuse from "fuse.js";
import dishes from "@/data/dishes.json";
import type { Dish, RecommendationResult } from "./types";

const allDishes = dishes as Dish[];

// Typo correction map
const typoMap: Record<string, string> = {
  spocy: "spicy", spicey: "spicy", spice: "spicy",
  cheezy: "cheesy", cheesey: "cheesy", cheeze: "cheese",
  burgr: "burger", burget: "burger", burgar: "burger",
  healthey: "healthy", helathy: "healthy", heathy: "healthy",
  protien: "protein", protin: "protein",
  strawbery: "strawberry", stawberry: "strawberry",
  crisphy: "crispy", krispey: "crispy", crispey: "crispy",
  sallad: "salad", salade: "salad",
  veggie: "vegetarian", veggies: "vegetarian",
  shareing: "sharing", shaaring: "sharing",
  chicen: "chicken", chiken: "chicken", chickn: "chicken",
  lambb: "lamb", lam: "lamb",
  shawarme: "shawarma", shwarma: "shawarma",
  biryani: "biryani", biriyani: "biryani",
};

function normalizeQuery(raw: string): string {
  let q = raw.toLowerCase().trim();
  const words = q.split(/\s+/);
  const corrected = words.map((w) => typoMap[w] ?? w);
  return corrected.join(" ");
}

interface ParsedIntent {
  sensoryWants: string[];
  categoryWants: string[];
  dietaryWants: string[];
  proteinWants: string[];
  occasionWants: string[];
  portionWants: string[];
  spiceWant: number | null;
  excludeProteins: string[];
  excludeAllergens: string[];
  excludeSpicy: boolean;
  wantNoSpice: boolean;
  wantSurprise: boolean;
  wantSharing: boolean;
  rawKeywords: string[];
}

function parseIntent(query: string): ParsedIntent {
  const q = query.toLowerCase();

  const sensoryWants: string[] = [];
  const categoryWants: string[] = [];
  const dietaryWants: string[] = [];
  const proteinWants: string[] = [];
  const occasionWants: string[] = [];
  const portionWants: string[] = [];
  const excludeProteins: string[] = [];
  const excludeAllergens: string[] = [];
  let spiceWant: number | null = null;
  let excludeSpicy = false;
  let wantNoSpice = false;
  let wantSurprise = false;
  let wantSharing = false;

  // Exclusions first
  if (/no chicken|without chicken|not chicken/.test(q)) excludeProteins.push("Chicken");
  if (/no beef|without beef|not beef/.test(q)) excludeProteins.push("Beef");
  if (/no lamb|without lamb|not lamb/.test(q)) excludeProteins.push("Lamb");
  if (/no dairy|dairy.?free|without dairy|lactose/.test(q)) excludeAllergens.push("Dairy");
  if (/no nuts|nut.?free/.test(q)) excludeAllergens.push("Nuts");
  if (/no gluten|gluten.?free/.test(q)) excludeAllergens.push("Gluten");
  if (/not spicy|no spice|mild only/.test(q)) { excludeSpicy = true; wantNoSpice = true; }

  // Surprise
  if (/surprise|random|anything/.test(q)) wantSurprise = true;

  // Sharing / group
  if (/feeding|group|sharing|platter|family|people|for \d|for the|everyone/.test(q)) {
    wantSharing = true;
    occasionWants.push("Sharing", "Family Dinner");
    portionWants.push("Sharing", "Large");
  }

  // Sensory
  if (/chees|cheesy/.test(q)) sensoryWants.push("Cheesy");
  if (/crispy|crunchy/.test(q)) sensoryWants.push("Crispy");
  if (/creamy/.test(q)) sensoryWants.push("Creamy");
  if (/smoky|smoked/.test(q)) sensoryWants.push("Smoky");
  if (/spicy|spice|hot|fiery|spocy/.test(q) && !excludeSpicy) { sensoryWants.push("Spicy"); spiceWant = 3; }
  if (/sweet|dessert/.test(q)) sensoryWants.push("Sweet");
  if (/tangy/.test(q)) sensoryWants.push("Tangy");
  if (/juicy/.test(q)) sensoryWants.push("Juicy");
  if (/fresh/.test(q)) sensoryWants.push("Fresh");
  if (/rich|indulgent|heavy|filling|hearty/.test(q)) sensoryWants.push("Rich");
  if (/tender/.test(q)) sensoryWants.push("Tender");

  // Categories
  if (/burger|burgr|burget/.test(q)) categoryWants.push("Burger");
  if (/shawarma|shwarma/.test(q)) categoryWants.push("Shawarma");
  if (/biryani|biriyani/.test(q)) categoryWants.push("Biryani");
  if (/pasta/.test(q)) categoryWants.push("Pasta");
  if (/sushi|roll|sashimi/.test(q)) categoryWants.push("Sushi");
  if (/ramen|noodle/.test(q)) categoryWants.push("Comfort");
  if (/dessert|sweet|cake|kunafa|chocolate/.test(q)) categoryWants.push("Dessert");
  if (/salad|bowl|healthy|light|clean/.test(q) && !/unhealthy/.test(q)) {
    categoryWants.push("Healthy");
    dietaryWants.push("Halal");
  }
  if (/grill|skewer|kofta|kebab/.test(q)) categoryWants.push("Grill");
  if (/sandwich/.test(q)) categoryWants.push("Burger");
  if (/rice|biryani|machboos|kabsa/.test(q)) categoryWants.push("Rice", "Biryani");
  if (/comfort|mac|stew/.test(q)) categoryWants.push("Comfort");

  // Specific items
  if (/strawberry|strawbery/.test(q)) {
    sensoryWants.push("Sweet", "Fresh");
    categoryWants.push("Dessert");
  }
  if (/pizza/.test(q)) categoryWants.push("Comfort");
  if (/mango/.test(q)) sensoryWants.push("Sweet", "Fresh");

  // Dietary
  if (/high protein|protein|gains|muscle|gym/.test(q)) dietaryWants.push("High Protein");
  if (/keto|low carb|no carb|zero carb/.test(q)) dietaryWants.push("Keto", "Low Carb");
  if (/vegan/.test(q)) dietaryWants.push("Vegan");
  if (/vegetarian|veggie/.test(q)) dietaryWants.push("Vegetarian");
  if (/healthy|light|clean|lean/.test(q)) dietaryWants.push("Low Carb");
  if (/filling|heavy|hearty/.test(q)) portionWants.push("Large");

  // Protein type
  if (/chicken/.test(q) && !excludeProteins.includes("Chicken")) proteinWants.push("Chicken");
  if (/beef/.test(q) && !excludeProteins.includes("Beef")) proteinWants.push("Beef");
  if (/lamb/.test(q) && !excludeProteins.includes("Lamb")) proteinWants.push("Lamb");
  if (/fish|salmon|tuna|sea bass/.test(q)) proteinWants.push("Fish");
  if (/shrimp|prawn|seafood/.test(q)) proteinWants.push("Seafood");
  if (/plant|vegan|vegetarian/.test(q)) proteinWants.push("Plant");

  // Occasion
  if (/late night|midnight|night/.test(q)) occasionWants.push("Late Night");
  if (/lunch/.test(q)) occasionWants.push("Lunch");
  if (/dinner/.test(q)) occasionWants.push("Dinner");
  if (/date|romantic/.test(q)) occasionWants.push("Date Night");
  // hangover query maps to late night comfort
  if (/hangover|recovery/.test(q)) occasionWants.push("Late Night");
  if (/office|work/.test(q)) occasionWants.push("Office Order");

  const rawKeywords = q.split(/\s+/).filter((w) => w.length > 2);

  return {
    sensoryWants, categoryWants, dietaryWants, proteinWants,
    occasionWants, portionWants, spiceWant, excludeProteins,
    excludeAllergens, excludeSpicy, wantNoSpice, wantSurprise,
    wantSharing, rawKeywords,
  };
}

function scoreDish(dish: Dish, intent: ParsedIntent): number {
  let score = 0;

  // Hard exclusions
  for (const p of intent.excludeProteins) {
    if (dish.proteinType === p) return -9999;
  }
  for (const a of intent.excludeAllergens) {
    if (dish.allergens.includes(a)) return -9999;
  }
  if (intent.excludeSpicy && dish.spiceLevel >= 3) return -9999;

  // Category match
  for (const cat of intent.categoryWants) {
    if (dish.category === cat || dish.cuisine === cat) score += 60;
  }

  // Sensory match
  for (const tag of intent.sensoryWants) {
    if (dish.sensoryTags.includes(tag)) score += 30;
  }

  // Dietary match
  for (const flag of intent.dietaryWants) {
    if (dish.dietaryFlags.includes(flag)) score += 20;
  }

  // Protein match
  for (const p of intent.proteinWants) {
    if (dish.proteinType === p) score += 20;
  }

  // Occasion match
  for (const occ of intent.occasionWants) {
    if (dish.occasionTags.includes(occ)) score += 15;
  }

  // Portion match
  for (const portion of intent.portionWants) {
    if (dish.portionSize === portion) score += 15;
  }

  // Spice match
  if (intent.spiceWant !== null) {
    if (dish.spiceLevel >= intent.spiceWant) score += 20;
  }
  if (intent.wantNoSpice && dish.spiceLevel === 0) score += 10;

  // Sharing bonus
  if (intent.wantSharing && dish.portionSize === "Sharing") score += 30;

  // Popularity and trend
  score += dish.popularityScore * 0.25;
  score += dish.trendScore * 0.15;

  return score;
}

function buildMatchReason(dish: Dish, intent: ParsedIntent): string {
  const matchedSensory = dish.sensoryTags.filter((t) => intent.sensoryWants.includes(t));
  const matchedDietary = dish.dietaryFlags.filter((f) => intent.dietaryWants.includes(f));

  if (matchedSensory.length > 0 && matchedDietary.length > 0) {
    return `${matchedSensory.join(" and ")} with ${matchedDietary.join(", ")} — from ${dish.restaurantName}.`;
  }
  if (matchedSensory.length > 0) {
    return `A ${matchedSensory.slice(0, 2).join(", ").toLowerCase()} ${dish.category.toLowerCase()} from ${dish.restaurantName} that fits your craving perfectly.`;
  }
  if (intent.wantSharing) {
    return `A ${dish.portionSize.toLowerCase()} ${dish.category.toLowerCase()} from ${dish.restaurantName}, built to share.`;
  }
  if (dish.popularityScore >= 90) {
    return `One of the most-ordered dishes at ${dish.restaurantName} — consistently loved by diners.`;
  }
  return `From ${dish.restaurantName}, this ${dish.category.toLowerCase()} matches your vibe with ${dish.sensoryTags.slice(0, 2).join(" and ").toLowerCase()} notes.`;
}

function scoreToPercent(score: number, min: number, max: number): number {
  if (max === min) return 90;
  const normalized = (score - min) / (max - min);
  return Math.round(72 + normalized * 26);
}

export function getRecommendations(rawQuery: string, count = 8): RecommendationResult[] {
  const query = normalizeQuery(rawQuery);
  const intent = parseIntent(query);

  // Surprise mode — return random top-scored dishes
  if (intent.wantSurprise) {
    const top30 = [...allDishes]
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 30);
    const shuffled = top30.sort(() => Math.random() - 0.5).slice(0, count);
    return shuffled.map((dish, i) => ({
      dish,
      matchScore: 85 - i * 2,
      matchPercent: 85 - i * 3,
      matchReason: `Hand-picked from the most beloved dishes across Doha — you're in for a treat.`,
      matchedTags: dish.sensoryTags.slice(0, 3),
    }));
  }

  // Score all dishes
  const scored = allDishes
    .map((dish) => ({ dish, score: scoreDish(dish, intent) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    // Fallback: top popular
    return allDishes
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, count)
      .map((dish) => ({
        dish,
        matchScore: 70,
        matchPercent: 78,
        matchReason: `A top-rated dish from ${dish.restaurantName} — always a safe bet.`,
        matchedTags: dish.sensoryTags.slice(0, 2),
      }));
  }

  const top = scored.slice(0, count);
  const scores = top.map((x) => x.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  return top.map(({ dish, score }) => ({
    dish,
    matchScore: score,
    matchPercent: scoreToPercent(score, minScore, maxScore),
    matchReason: buildMatchReason(dish, intent),
    matchedTags: [
      ...dish.sensoryTags.filter((t) => intent.sensoryWants.includes(t)),
      ...dish.dietaryFlags.filter((f) => intent.dietaryWants.includes(f)),
    ].slice(0, 4),
  }));
}
