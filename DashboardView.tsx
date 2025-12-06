
import React from 'react';
import { DashboardStats } from '../types';

interface DashboardViewProps {
  stats: DashboardStats;
}

const DashboardView: React.FC<DashboardViewProps> = ({ stats }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-6 z-10 sticky top-0 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Impact</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Your Zero-Waste Journey</p>
          </div>
          <div className="bg-white/50 p-2.5 rounded-2xl shadow-sm border border-white/60">
             <span className="text-2xl">🌍</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
        
        {/* Main Hero Card - Money Saved */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-green-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
            
            <p className="relative z-10 text-green-100 font-medium uppercase tracking-widest text-xs mb-2">Total Money Saved</p>
            <div className="relative z-10 flex items-baseline">
                <span className="text-6xl font-bold tracking-tighter">${stats.totalMoneySaved.toFixed(0)}</span>
                <span className="text-2xl opacity-80 ml-1">.{stats.totalMoneySaved.toFixed(2).split('.')[1]}</span>
            </div>
            <p className="relative z-10 text-sm text-green-50 mt-4 opacity-90">
                You've saved enough for {Math.floor(stats.totalMoneySaved / 15)} takeout meals!
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            {/* Meals Cooked */}
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-sm flex flex-col justify-between h-40 group hover:bg-white/70 transition-colors">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
                    👨‍🍳
                </div>
                <div>
                    <span className="text-3xl font-bold text-gray-800">{stats.totalMealsCooked}</span>
                    <p className="text-xs text-gray-500 font-medium uppercase mt-1">Meals Cooked</p>
                </div>
            </div>

            {/* Ingredients Rescued */}
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-sm flex flex-col justify-between h-40 group hover:bg-white/70 transition-colors">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
                    🍎
                </div>
                <div>
                    <span className="text-3xl font-bold text-gray-800">{stats.totalIngredientsUsed}</span>
                    <p className="text-xs text-gray-500 font-medium uppercase mt-1">Items Rescued</p>
                </div>
            </div>
        </div>

        {/* CO2 Saved */}
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-20 text-8xl grayscale group-hover:grayscale-0 transition-all duration-700">
                🌱
             </div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Environmental Impact</p>
             <div className="flex items-baseline mb-2">
                <span className="text-5xl font-bold text-gray-800">{stats.totalCo2Saved.toFixed(1)}</span>
                <span className="text-xl text-gray-500 ml-2">kg CO₂e</span>
             </div>
             <p className="text-gray-500 text-sm leading-relaxed max-w-[80%]">
                That's equivalent to charging a smartphone <strong>{Math.floor(stats.totalCo2Saved * 120)}</strong> times!
             </p>
        </div>

        {/* Tip Card */}
        <div className="bg-blue-50/50 backdrop-blur-md p-6 rounded-3xl border border-blue-100/50 flex items-start space-x-4">
             <div className="text-2xl">💡</div>
             <div>
                 <h4 className="font-bold text-blue-900 text-sm mb-1">Did you know?</h4>
                 <p className="text-blue-800/70 text-xs leading-relaxed">
                     Scanning your fridge once a week reduces food waste by up to 30%. You're doing great!
                 </p>
             </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardView;
