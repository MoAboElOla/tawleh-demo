export interface Dish {
  id: string;
  dishName: string;
  restaurantName: string;
  category: string;
  cuisine: string;
  description: string;
  priceQar: number;
  proteinType: string;
  spiceLevel: number;
  portionSize: string;
  caloriesApprox: number;
  proteinApprox: number;
  carbsApprox: number;
  allergens: string[];
  dietaryFlags: string[];
  sensoryTags: string[];
  occasionTags: string[];
  popularityScore: number;
  trendScore: number;
}

export interface RecommendationResult {
  dish: Dish;
  matchScore: number;
  matchPercent: number;
  matchReason: string;
  matchedTags: string[];
}

export type SpiceLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type PortionSize = "Small" | "Medium" | "Large" | "Sharing";

export type ProteinType =
  | "Beef"
  | "Chicken"
  | "Lamb"
  | "Fish"
  | "Seafood"
  | "Plant"
  | "Eggs"
  | "Mixed"
  | "None";

export type Allergen =
  | "Gluten"
  | "Dairy"
  | "Nuts"
  | "Eggs"
  | "Soy"
  | "Shellfish";

export type DietaryFlag =
  | "Vegan"
  | "Vegetarian"
  | "Keto"
  | "Low Carb"
  | "High Protein";

export type SensoryTag =
  | "Crispy"
  | "Creamy"
  | "Cheesy"
  | "Smoky"
  | "Spicy"
  | "Sweet"
  | "Tangy"
  | "Juicy"
  | "Crunchy"
  | "Fresh"
  | "Rich"
  | "Savory"
  | "Tender"
  | "Flaky";

export type OccasionTag =
  | "Lunch"
  | "Dinner"
  | "Late Night"
  | "Sharing"
  | "Date Night"
  | "Office Order"
  | "Family Dinner";
