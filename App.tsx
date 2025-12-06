
import React, { useState, useEffect } from 'react';
import Camera from './components/Camera';
import Loading from './components/Loading';
import RecipeCard from './components/RecipeCard';
import BottomNav from './components/BottomNav';
import InventoryView from './components/InventoryView';
import ProfileView from './components/ProfileView';
import ShoppingListView from './components/ShoppingListView';
import DashboardView from './components/DashboardView';
import { identifyIngredients, suggestRecipes, generateRecipeImage } from './services/geminiService';
import { AppState, Ingredient, Recipe, UserPreferences, ShoppingItem, DashboardStats } from './types';
import { PANTRY_STAPLES } from './constants';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'COOK' | 'INVENTORY' | 'SHOPPING' | 'PROFILE' | 'DASHBOARD'>('COOK');

  // App Flow State (within COOK tab)
  const [appState, setAppState] = useState<AppState>('SCAN');
  
  // Data State
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  // Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Preferences State
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('fridge_friend_prefs');
    return saved ? JSON.parse(saved) : {
      diets: [],
      goal: 'Balanced',
      allergies: ''
    };
  });

  // Shopping List State
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('fridge_friend_shopping');
    return saved ? JSON.parse(saved) : [];
  });

  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(() => {
    const saved = localStorage.getItem('fridge_friend_stats');
    return saved ? JSON.parse(saved) : {
      totalMoneySaved: 0,
      totalMealsCooked: 0,
      totalIngredientsUsed: 0,
      totalCo2Saved: 0
    };
  });

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('fridge_friend_prefs', JSON.stringify(preferences));
  }, [preferences]);

  // Persist shopping list
  useEffect(() => {
    localStorage.setItem('fridge_friend_shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Persist stats
  useEffect(() => {
    localStorage.setItem('fridge_friend_stats', JSON.stringify(dashboardStats));
  }, [dashboardStats]);

  // Helper for Toasts
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers
  const handleCapture = async (base64Image: string) => {
    setAppState('ANALYZING');
    const detectedIngredients = await identifyIngredients(base64Image);
    setIngredients(detectedIngredients);
    setAppState('REVIEW');
  };

  const handleGetRecipes = async () => {
    setAppState('GENERATING_RECIPES');
    const suggestions = await suggestRecipes(ingredients, preferences);
    setRecipes(suggestions);
    setAppState('RECIPE_LIST');

    // Trigger image generation in the background
    suggestions.forEach(async (recipe) => {
      const base64 = await generateRecipeImage(recipe);
      if (base64) {
        setRecipes(prev => 
          prev.map(r => r.id === recipe.id ? { ...r, imageUrl: `data:image/jpeg;base64,${base64}` } : r)
        );
      }
    });
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    // Ensure we select the version from state that might have the image loaded
    const upToDateRecipe = recipes.find(r => r.id === recipe.id) || recipe;
    setSelectedRecipe(upToDateRecipe);
    setAppState('COOKING');

    // Automatic Shopping List Logic
    if (upToDateRecipe.missingIngredients.length > 0) {
      let addedCount = 0;
      const updatedList = [...shoppingList];
      
      upToDateRecipe.missingIngredients.forEach(item => {
        // Check if item already exists (case insensitive)
        const exists = updatedList.some(i => i.name.toLowerCase() === item.toLowerCase() && !i.completed);
        if (!exists) {
          updatedList.push({
            id: Date.now().toString() + Math.random().toString(),
            name: item,
            completed: false
          });
          addedCount++;
        }
      });

      if (addedCount > 0) {
        setShoppingList(updatedList);
        showToast(`Added ${addedCount} missing item${addedCount > 1 ? 's' : ''} to Shopping List`);
      }
    }
  };

  const handleFinishCooking = () => {
    if (selectedRecipe) {
      // Update Dashboard Stats
      const money = selectedRecipe.moneySaved;
      const ingredientsCount = selectedRecipe.ingredientsUsed.length;
      // Approximate CO2 saved: 0.8 kg per ingredient rescued from waste/packaging impact
      const co2 = ingredientsCount * 0.8; 

      setDashboardStats(prev => ({
        totalMoneySaved: prev.totalMoneySaved + money,
        totalMealsCooked: prev.totalMealsCooked + 1,
        totalIngredientsUsed: prev.totalIngredientsUsed + ingredientsCount,
        totalCo2Saved: prev.totalCo2Saved + co2
      }));
    }
    setAppState('SUCCESS');
  };

  const handleReset = () => {
    setRecipes([]);
    setSelectedRecipe(null);
    setAppState('SCAN');
  };

  // Shopping List Handlers
  const handleShoppingToggle = (id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleShoppingAdd = (name: string) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name,
      completed: false
    };
    setShoppingList(prev => [...prev, newItem]);
  };

  const handleShoppingDelete = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const handleShoppingClearCompleted = () => {
      setShoppingList(prev => prev.filter(item => !item.completed));
  };


  // --- Render Content for Cook Tab ---
  const renderCookTab = () => {
    if (appState === 'SCAN') {
      return <Camera onCapture={handleCapture} />;
    }
  
    if (appState === 'ANALYZING') {
      return <Loading text="Identifying ingredients..." />;
    }
  
    if (appState === 'REVIEW') {
      return (
        <div className="flex flex-col h-full">
          <div className="px-6 py-8 z-10 sticky top-0 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Here's what I see</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              + Pantry Staples (Salt, Oil, Spices)
            </p>
          </div>
  
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar pb-40">
             {ingredients.length === 0 ? (
               <div className="text-center py-10 text-gray-400">No food detected. Try again?</div>
             ) : (
               <div className="grid grid-cols-2 gap-3">
                 {ingredients.map((item, idx) => (
                   <div key={idx} className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm flex flex-col justify-between hover:scale-105 transition-transform">
                     <span className="font-bold text-gray-800">{item.name}</span>
                     <span className="text-xs text-gray-500 mt-2 bg-gray-100/50 rounded-lg px-2 py-1 w-fit">{item.quantity}</span>
                   </div>
                 ))}
                 <div className="col-span-2 mt-4 pt-4 border-t border-gray-200/50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Pantry Staples Assumed</p>
                    <div className="flex flex-wrap gap-2">
                      {PANTRY_STAPLES.slice(0, 5).map(s => (
                          <span key={s} className="text-xs bg-white/50 border border-white/60 text-gray-500 px-3 py-1.5 rounded-full">{s}</span>
                      ))}
                      <span className="text-xs text-gray-400 px-2 py-1">+ more</span>
                    </div>
                 </div>
               </div>
             )}
          </div>
  
          <div className="absolute bottom-24 left-6 right-6 z-20">
            <button 
              onClick={handleGetRecipes}
              className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-4 rounded-3xl shadow-lg shadow-green-200 backdrop-blur-md active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-lg"
            >
              <span>What can I cook?</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
               onClick={() => setAppState('SCAN')} 
               className="w-full text-center text-gray-400 text-xs font-medium mt-3 pb-2 hover:text-gray-600 transition-colors uppercase tracking-widest"
            >
              Scan again
            </button>
          </div>
        </div>
      );
    }
  
    if (appState === 'GENERATING_RECIPES') {
      return <Loading text="Chef is thinking..." />;
    }
  
    if (appState === 'RECIPE_LIST') {
      return (
        <div className="flex flex-col h-full">
          <div className="px-6 py-6 z-10 sticky top-0 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tonight's Menu</h1>
              <p className="text-xs text-gray-500 font-medium">For you</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setAppState('REVIEW')} 
                className="p-3 bg-white/50 backdrop-blur-md border border-white/60 hover:bg-white rounded-full text-gray-500 transition-all shadow-sm"
                title="Back to Ingredients"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={handleReset} 
                className="p-3 bg-white/50 backdrop-blur-md border border-white/60 hover:bg-white rounded-full text-gray-500 transition-all shadow-sm"
                title="Scan New Items"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
  
          <div className="flex-1 overflow-y-auto p-6 space-y-2 no-scrollbar pb-32">
             {recipes.map((recipe) => (
               <RecipeCard key={recipe.id} recipe={recipe} onSelect={handleSelectRecipe} />
             ))}
          </div>
        </div>
      );
    }
  
    if (appState === 'COOKING' && selectedRecipe) {
      const activeRecipe = recipes.find(r => r.id === selectedRecipe.id) || selectedRecipe;
      
      return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar relative z-50 bg-[#F2F4F6]">
          <div className="h-72 w-full relative shrink-0">
              {activeRecipe.imageUrl ? (
                <img 
                    src={activeRecipe.imageUrl} 
                    alt={activeRecipe.title} 
                    className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-300">
                    <span className="text-6xl">🥘</span>
                </div>
              )}
               {/* Gradient overlay for text readability */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#F2F4F6] via-transparent to-black/30"></div>
              
              <button 
                  onClick={() => setAppState('RECIPE_LIST')}
                  className="absolute top-6 left-6 bg-white/30 backdrop-blur-xl border border-white/20 p-3 rounded-full text-white hover:bg-white/50 transition-all"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
              </button>
          </div>
  
          <div className="p-6 pb-32 -mt-10 relative z-10">
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm mb-6">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">{activeRecipe.title}</h1>
                <div className="flex items-center space-x-4 text-sm font-medium text-gray-600">
                    <span className="flex items-center bg-white/50 px-3 py-1 rounded-full"><span className="mr-2 text-lg">⏱️</span> {activeRecipe.estimatedTime}</span>
                    <span className="flex items-center bg-white/50 px-3 py-1 rounded-full"><span className="mr-2 text-lg">🔥</span> {activeRecipe.calories} kcal</span>
                </div>
              </div>

              {activeRecipe.macros && (
                <div className="mb-6 bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/50 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Nutrition per Serving</h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white/60 p-3 rounded-2xl shadow-sm border border-white/40">
                      <p className="text-xs text-gray-500 mb-1">Protein</p>
                      <p className="font-bold text-gray-900 text-lg">{activeRecipe.macros.protein}</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-2xl shadow-sm border border-white/40">
                      <p className="text-xs text-gray-500 mb-1">Fats</p>
                      <p className="font-bold text-gray-900 text-lg">{activeRecipe.macros.fat}</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-2xl shadow-sm border border-white/40">
                      <p className="text-xs text-gray-500 mb-1">Carbs</p>
                      <p className="font-bold text-gray-900 text-lg">{activeRecipe.macros.carbs}</p>
                    </div>
                  </div>
                </div>
              )}
  
              <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/50 shadow-sm mb-6">
                <h3 className="font-bold text-xl mb-4 text-gray-800">Ingredients</h3>
                <ul className="space-y-3">
                    {activeRecipe.ingredientsUsed.map((ing, i) => (
                        <li key={i} className="flex items-center group">
                            <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-4 shrink-0 shadow-sm group-hover:scale-125 transition-transform"></span>
                            <span className="text-gray-700 font-medium">{ing}</span>
                        </li>
                    ))}
                    {activeRecipe.missingIngredients.map((ing, i) => (
                        <li key={`miss-${i}`} className="flex items-center group">
                            <span className="w-2.5 h-2.5 bg-orange-400 rounded-full mr-4 shrink-0 shadow-sm group-hover:scale-125 transition-transform"></span>
                            <span className="text-gray-700 font-medium italic">{ing} <span className="text-orange-500 text-xs ml-2 not-italic bg-orange-100 px-2 py-0.5 rounded-full">Buy</span></span>
                        </li>
                    ))}
                </ul>
              </div>
  
              <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/50 shadow-sm">
                <h3 className="font-bold text-xl mb-4 text-gray-800">Instructions</h3>
                <div className="space-y-6">
                    {activeRecipe.instructions.map((step, i) => (
                        <div key={i} className="flex">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold mr-4 mt-0.5 shadow-inner">
                                {i + 1}
                            </div>
                            <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                        </div>
                    ))}
                </div>
              </div>
          </div>
  
          {/* Floating Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 z-50 pointer-events-none flex justify-center">
              <button 
                  onClick={handleFinishCooking}
                  className="pointer-events-auto bg-gray-900/90 backdrop-blur-xl text-white font-bold py-4 px-12 rounded-full shadow-2xl active:scale-[0.98] transition-all border border-white/10 hover:bg-black"
              >
                  Mark as Complete
              </button>
          </div>
        </div>
      );
    }
  
    if (appState === 'SUCCESS') {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-green-600 relative overflow-hidden z-50">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-900/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
  
          <div className="z-10 text-center animate-bounce mb-8 filter drop-shadow-lg">
              <span className="text-7xl">🎉</span>
          </div>
  
          <h1 className="text-5xl font-bold mb-2 z-10 text-white tracking-tight">Bon Appétit!</h1>
          <p className="text-green-100 text-xl mb-12 z-10 font-medium">Inventory & Stats Updated</p>
  
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 w-64 mb-12 border border-white/30 z-10 shadow-2xl">
              <p className="text-green-50 text-xs uppercase tracking-widest font-bold mb-2">Money Saved</p>
              <p className="text-5xl font-bold text-white">${selectedRecipe?.moneySaved.toFixed(2)}</p>
              <p className="text-xs text-green-100 mt-2 opacity-80">Impact recorded</p>
          </div>
  
          <button 
              onClick={handleReset}
              className="z-10 bg-white text-green-700 font-bold py-4 px-10 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
              Cook Another Meal
          </button>
        </div>
      );
    }

    return null;
  };

  // --- Main Layout ---
  const isImmersiveMode = appState === 'COOKING' || appState === 'SUCCESS';

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'COOK' && renderCookTab()}
        {activeTab === 'INVENTORY' && <InventoryView ingredients={ingredients} />}
        {activeTab === 'SHOPPING' && (
          <ShoppingListView 
            items={shoppingList} 
            onToggle={handleShoppingToggle}
            onAdd={handleShoppingAdd}
            onClearCompleted={handleShoppingClearCompleted}
            onDelete={handleShoppingDelete}
          />
        )}
        {activeTab === 'PROFILE' && <ProfileView preferences={preferences} onUpdate={setPreferences} />}
        {activeTab === 'DASHBOARD' && <DashboardView stats={dashboardStats} />}
      </div>
      
      {/* Glass Toast Notification */}
      {toastMessage && (
        <div className="absolute top-6 left-0 right-0 z-[60] flex justify-center pointer-events-none">
          <div className="bg-gray-900/80 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-2xl text-sm font-medium animate-fade-in-up border border-white/10">
            {toastMessage}
          </div>
        </div>
      )}

      {!isImmersiveMode && (
         <BottomNav currentTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

export default App;
