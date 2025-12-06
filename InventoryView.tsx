import React from 'react';
import { Ingredient } from '../types';

interface InventoryViewProps {
  ingredients: Ingredient[];
}

const CATEGORY_ICONS: Record<string, string> = {
  'Produce': '🥦',
  'Fruit': '🍎',
  'Vegetable': '🥕',
  'Dairy': '🥛',
  'Meat': '🥩',
  'Seafood': '🐟',
  'Pantry': '🍝',
  'Grains': '🍚',
  'Condiment': '🧂',
  'Beverage': '🧃',
  'Bakery': '🥖',
  'Frozen': '❄️',
  'Snacks': '🍿',
  'Other': '🧺'
};

const InventoryView: React.FC<InventoryViewProps> = ({ ingredients }) => {
  const groupedIngredients = ingredients.reduce((acc, item) => {
    let category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const categories = Object.keys(groupedIngredients).sort();

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Glass Header */}
      <div className="px-6 py-6 z-10 sticky top-0 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Your Fridge</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {ingredients.length} items tracked
            </p>
          </div>
          <div className="bg-white/50 p-2.5 rounded-2xl shadow-sm border border-white/60">
             <span className="text-2xl">🧊</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
        {ingredients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center opacity-60 mt-10">
            <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/60">
              <span className="text-5xl grayscale opacity-50">🍽️</span>
            </div>
            <p className="text-gray-800 font-semibold text-lg">Your inventory is empty</p>
            <p className="text-gray-500 text-sm mt-2 max-w-xs leading-relaxed">Scan some food in the Cook tab to populate your inventory automatically.</p>
          </div>
        ) : (
          categories.map((category) => {
            const iconKey = Object.keys(CATEGORY_ICONS).find(k => category.includes(k)) || 'Other';
            const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS[iconKey] || CATEGORY_ICONS['Other'];
            
            return (
              <div key={category} className="animate-fade-in-up">
                <div className="flex items-center mb-3 ml-1">
                  <span className="text-xl mr-2 filter drop-shadow-sm">{icon}</span>
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {category}
                  </h2>
                  <span className="ml-auto text-[10px] font-bold text-gray-400 bg-white/50 px-2 py-1 rounded-full border border-white/60">
                    {groupedIngredients[category].length}
                  </span>
                </div>
                
                <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-sm border border-white/50 overflow-hidden divide-y divide-white/50">
                  {groupedIngredients[category].map((item, index) => (
                    <div 
                      key={`${category}-${index}`} 
                      className="p-4 flex justify-between items-center hover:bg-white/40 transition-colors group"
                    >
                      <p className="font-semibold text-gray-700 group-hover:text-green-700 transition-colors">{item.name}</p>
                      <span className="text-xs font-medium text-gray-500 bg-gray-50/50 px-2.5 py-1 rounded-lg border border-gray-100/50">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InventoryView;