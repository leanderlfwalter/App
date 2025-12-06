import React from 'react';
import { UserPreferences, DietaryRestriction, HealthGoal } from '../types';

interface ProfileViewProps {
  preferences: UserPreferences;
  onUpdate: (prefs: UserPreferences) => void;
}

const DIETS: DietaryRestriction[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo'];
const GOALS: HealthGoal[] = ['Balanced', 'High Protein (Gym)', 'Low Carb', 'Budget Friendly'];

const ProfileView: React.FC<ProfileViewProps> = ({ preferences, onUpdate }) => {
  
  const toggleDiet = (diet: DietaryRestriction) => {
    const current = preferences.diets;
    const updated = current.includes(diet)
      ? current.filter(d => d !== diet)
      : [...current, diet];
    
    onUpdate({ ...preferences, diets: updated });
  };

  const setGoal = (goal: HealthGoal) => {
    onUpdate({ ...preferences, goal });
  };

  const handleAllergyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...preferences, allergies: e.target.value });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 z-10 sticky top-0 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">You</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Preferences & Goals</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
        
        {/* Diet Section */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center ml-1">
            Dietary Restrictions
          </h3>
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-5 border border-white/50 shadow-sm">
            <div className="flex flex-wrap gap-2">
                {DIETS.map(diet => {
                const isActive = preferences.diets.includes(diet);
                return (
                    <button
                    key={diet}
                    onClick={() => toggleDiet(diet)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300
                        ${isActive 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-200 scale-105' 
                        : 'bg-white/50 text-gray-600 border border-white/60 hover:bg-white hover:shadow-md'}`}
                    >
                    {diet}
                    </button>
                );
                })}
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center ml-1">
            Health Goal
          </h3>
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl border border-white/50 shadow-sm overflow-hidden divide-y divide-white/50">
            {GOALS.map((goal, idx) => (
              <button
                key={goal}
                onClick={() => setGoal(goal)}
                className={`w-full text-left px-5 py-4 text-sm flex justify-between items-center transition-all duration-200
                  ${preferences.goal === goal ? 'bg-green-50/50 text-green-700 font-bold' : 'text-gray-600 hover:bg-white/60'}`}
              >
                <span>{goal}</span>
                {preferences.goal === goal && (
                  <span className="bg-green-100 text-green-600 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Allergies Section */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center ml-1">
            Allergies
          </h3>
          <div className="bg-white/60 backdrop-blur-lg p-5 rounded-3xl border border-white/50 shadow-sm">
            <input 
              type="text" 
              value={preferences.allergies}
              onChange={handleAllergyChange}
              placeholder="e.g. Peanuts, Shellfish..."
              className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 outline-none text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-green-100 focus:border-green-300 transition-all"
            />
            <p className="text-xs text-gray-400 mt-3 ml-1">We'll exclude recipes with these ingredients.</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ProfileView;