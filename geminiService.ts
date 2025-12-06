import { GoogleGenAI, Type } from "@google/genai";
import { Ingredient, Recipe, RecipeType, UserPreferences } from "../types";
import { PANTRY_STAPLES } from "../constants";

// Initialize Gemini
// Note: In a real production app, ensure the key is restricted or proxied.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image to identify ingredients.
 */
export const identifyIngredients = async (base64Image: string): Promise<Ingredient[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Correct model for Vision/Multimodal tasks
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analyze this image of a fridge or pantry with EXTREME PRECISION. 
            Identify every visible food ingredient. 
            
            CRITICAL RULES:
            1. SPECIFICITY: Do not use generic terms like 'Meat' or 'Cheese'. Identify the exact type (e.g., 'Ribeye Steak', 'Ground Turkey', 'Pork Chops', 'Sharp Cheddar', 'Mozzarella Ball').
            2. QUANTITY: Count items precisely where possible (e.g., '3 items', '6 eggs', '2 steaks'). Estimate volume for liquids (e.g., '1/2 gallon').
            3. PRODUCE: Identify the specific variety if possible (e.g., 'Roma Tomatoes', 'Granny Smith Apples').
            
            Return a JSON array.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Specific name of the ingredient (e.g. 'Boneless Chicken Breast', 'Ground Beef 80/20', 'Baby Spinach'). Avoid generic names." },
              category: { type: Type.STRING, description: "General category (e.g. 'Produce', 'Dairy', 'Meat', 'Seafood', 'Pantry')" },
              quantity: { type: Type.STRING, description: "Precise count or amount (e.g. '3 count', 'approx 1 lb', '1/2 bottle')" }
            },
            required: ["name", "category", "quantity"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Ingredient[];
    }
    return [];
  } catch (error) {
    console.error("Error identifying ingredients:", error);
    // Fallback/Mock data if API fails or key is missing for demo purposes
    return [
      { name: "Organic Radishes", category: "Produce", quantity: "1 bunch (8 count)" },
      { name: "English Cucumber", category: "Produce", quantity: "1 large" },
      { name: "Greek Yogurt (0% Fat)", category: "Dairy", quantity: "1/2 tub (16oz)" },
      { name: "Boneless Chicken Breast", category: "Meat", quantity: "2 fillets (approx 1lb)" }
    ];
  }
};

/**
 * Generates recipes based on available ingredients and user preferences.
 */
export const suggestRecipes = async (ingredients: Ingredient[], preferences: UserPreferences): Promise<Recipe[]> => {
  const ingredientNames = ingredients.map(i => i.name).join(", ");
  const pantryNames = PANTRY_STAPLES.join(", ");
  
  const dietString = preferences.diets.length > 0 ? `STRICT Dietary restrictions: ${preferences.diets.join(', ')} (Do NOT suggest recipes violating this).` : '';
  const goalString = `Health Goal: ${preferences.goal}.`;
  const allergyString = preferences.allergies ? `ALLERGIES (Must Avoid): ${preferences.allergies}.` : '';

  const prompt = `
    You are a Zero-Waste Sous Chef.
    User has these ingredients: ${ingredientNames}.
    User has these pantry staples: ${pantryNames}.
    
    User Profile:
    ${dietString}
    ${goalString}
    ${allergyString}

    Create exactly 4 unique recipes that STRICTLY adhere to the dietary restrictions and allergies.
    
    Rules:
    1. EXACTLY TWO (2) recipes must be "Ready to Cook" (uses ONLY user ingredients + staples).
    2. EXACTLY TWO (2) recipes must be "Upgrade It" (requires buying 1-2 cheap items like fresh herbs or a specific spice).
    3. Calculate "moneySaved" compared to ordering a similar takeout meal (e.g. $15 takeout - $3 home cost = $12 saved).
    4. Keep instructions concise.
    5. Include estimated macronutrients (Protein, Fat, Carbs) in grams for each recipe, especially important if goal is Gym/High Protein.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: [RecipeType.READY_TO_COOK, RecipeType.UPGRADE_IT] },
              ingredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              estimatedTime: { type: Type.STRING },
              moneySaved: { type: Type.NUMBER },
              calories: { type: Type.NUMBER },
              macros: {
                type: Type.OBJECT,
                properties: {
                  protein: { type: Type.STRING },
                  fat: { type: Type.STRING },
                  carbs: { type: Type.STRING }
                },
                required: ["protein", "fat", "carbs"]
              }
            },
            required: ["id", "title", "description", "type", "ingredientsUsed", "missingIngredients", "instructions", "moneySaved", "macros"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Recipe[];
    }
    return [];
  } catch (error) {
    console.error("Error generating recipes:", error);
    // Fallback data
    return [
      {
        id: "1",
        title: "Creamy Radish & Cucumber Salad",
        description: "A refreshing, crunchy salad using your yogurt as a dressing base.",
        type: RecipeType.READY_TO_COOK,
        ingredientsUsed: ["Radishes", "Cucumber", "Greek Yogurt", "Lemon", "Salt", "Pepper", "Olive Oil"],
        missingIngredients: [],
        instructions: ["Slice radishes and cucumber thinly.", "Whisk yogurt, lemon juice, oil, salt, and pepper.", "Toss vegetables in dressing.", "Serve immediately."],
        estimatedTime: "10 mins",
        moneySaved: 12.50,
        calories: 220,
        macros: { protein: "8g", fat: "12g", carbs: "15g" }
      },
      {
        id: "2",
        title: "Grilled Chicken with Veggies",
        description: "Lean protein with roasted vegetables.",
        type: RecipeType.READY_TO_COOK,
        ingredientsUsed: ["Chicken Breast", "Radishes", "Cucumber", "Olive Oil", "Spices"],
        missingIngredients: [],
        instructions: ["Season chicken and cook in pan.", "Sauté radishes until tender.", "Serve together."],
        estimatedTime: "25 mins",
        moneySaved: 15.00,
        calories: 450,
        macros: { protein: "45g", fat: "10g", carbs: "5g" }
      },
      {
        id: "3",
        title: "Roasted Radishes with Dill",
        description: "Transform sharp radishes into sweet, tender bites.",
        type: RecipeType.UPGRADE_IT,
        ingredientsUsed: ["Radishes", "Butter", "Salt"],
        missingIngredients: ["Fresh Dill"],
        instructions: ["Halve radishes.", "Sauté in butter until browned.", "Season with salt.", "Garnish with fresh dill."],
        estimatedTime: "20 mins",
        moneySaved: 8.00,
        calories: 150,
        macros: { protein: "2g", fat: "14g", carbs: "8g" }
      },
      {
        id: "4",
        title: "Tzatziki Dip with Crudités",
        description: "Classic Greek dip perfect for snacking.",
        type: RecipeType.UPGRADE_IT,
        ingredientsUsed: ["Cucumber", "Greek Yogurt", "Garlic", "Lemon"],
        missingIngredients: ["Pita Bread"],
        instructions: ["Grate cucumber and squeeze out water.", "Mix with yogurt, minced garlic, and lemon.", "Serve with pita bread."],
        estimatedTime: "15 mins",
        moneySaved: 6.50,
        calories: 180,
        macros: { protein: "10g", fat: "6g", carbs: "25g" }
      }
    ];
  }
};

/**
 * Generates a photo realistic image for a recipe.
 */
export const generateRecipeImage = async (recipe: Recipe): Promise<string | null> => {
  try {
    const prompt = `Professional food photography of ${recipe.title}. ${recipe.description}. The dish looks delicious, high quality, 4k, restaurant style plating.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating recipe image:", error);
    return null;
  }
};