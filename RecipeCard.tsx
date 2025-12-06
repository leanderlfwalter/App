import React from 'react';
import { Recipe, RecipeType } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const isReady = recipe.type === RecipeType.READY_TO_COOK;

  return (
    <div 
      onClick={() => onSelect(recipe)}
      className="group relative rounded-3xl mb-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden bg-white/60 backdrop-blur-lg border border-white/60 shadow-sm hover:shadow-xl"
    >
      {/* Image Area */}
      <div className="h-40 w-full bg-gray-100/50 relative overflow-hidden">
        {recipe.imageUrl ? (
           <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
           <div className={`w-full h-full flex items-center justify-center opacity-30 ${isReady ? 'bg-green-100' : 'bg-orange-100'}`}>
             <span className="text-4xl">🥘</span>
           </div>
        )}
        
        {/* Badge Overlay */}
        <div className="absolute top-3 right-3">
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/20
            ${isReady ? 'bg-green-500/90 text-white' : 'bg-orange-400/90 text-white'}`}>
            {recipe.type}
            </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 leading-tight">{recipe.title}</h3>
            <div className="text-green-600 text-xs font-bold bg-green-50/50 backdrop-blur-sm px-2 py-1 rounded-lg border border-green-100/50">
              Save ${recipe.moneySaved.toFixed(2)}
            </div>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{recipe.description}</p>
        
        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-400">
            <span className="flex items-center bg-gray-100/50 px-2 py-1 rounded-md">⏱️ {recipe.estimatedTime}</span>
            <span className="flex items-center bg-gray-100/50 px-2 py-1 rounded-md">🔥 {recipe.calories} kcal</span>
        </div>

        {recipe.macros && (
          <div className="mt-3 flex space-x-3 text-[10px] text-gray-400 font-medium uppercase tracking-wide">
             <span className="bg-gray-100/50 px-2 py-1 rounded-md">P: <span className="text-gray-700">{recipe.macros.protein}</span></span>
             <span className="bg-gray-100/50 px-2 py-1 rounded-md">F: <span className="text-gray-700">{recipe.macros.fat}</span></span>
             <span className="bg-gray-100/50 px-2 py-1 rounded-md">C: <span className="text-gray-700">{recipe.macros.carbs}</span></span>
          </div>
        )}

        {!isReady && recipe.missingIngredients.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100/50">
            <p className="text-xs text-orange-600/80">
                <span className="font-bold">Missing:</span> {recipe.missingIngredients.join(', ')}
            </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;