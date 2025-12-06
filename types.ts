
export interface Ingredient {
  name: string;
  category?: string;
  quantity?: string;
  expiryDate?: string; // ISO string
}

export enum RecipeType {
  READY_TO_COOK = 'Ready to Cook',
  UPGRADE_IT = 'Upgrade It',
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  type: RecipeType;
  ingredientsUsed: string[];
  missingIngredients: string[];
  instructions: string[];
  estimatedTime: string;
  moneySaved: number; // In dollars
  calories: number;
  imageUrl?: string;
  macros?: {
    protein: string;
    fat: string;
    carbs: string;
  };
}

export type AppState = 'SCAN' | 'ANALYZING' | 'REVIEW' | 'GENERATING_RECIPES' | 'RECIPE_LIST' | 'COOKING' | 'SUCCESS';

export type DietaryRestriction = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Keto' | 'Paleo';
export type HealthGoal = 'Balanced' | 'High Protein (Gym)' | 'Low Carb' | 'Budget Friendly';

export interface UserPreferences {
  diets: DietaryRestriction[];
  goal: HealthGoal;
  allergies: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

export interface DashboardStats {
  totalMoneySaved: number;
  totalMealsCooked: number;
  totalIngredientsUsed: number;
  totalCo2Saved: number; // in kg
}
