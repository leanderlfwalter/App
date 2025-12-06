import React from 'react';

interface LoadingProps {
  text: string;
}

const Loading: React.FC<LoadingProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-8 animate-fade-in">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 bg-white/40 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-green-400 rounded-full border-t-transparent animate-spin shadow-[0_0_15px_rgba(74,222,128,0.5)]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl filter drop-shadow-md">👨‍🍳</span>
        </div>
      </div>
      <div className="bg-white/60 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/50 shadow-lg text-center">
        <h2 className="text-lg font-bold text-gray-800 animate-pulse">
            {text}
        </h2>
        <p className="text-gray-500 text-xs mt-2">
            Chef is crafting your menu...
        </p>
      </div>
    </div>
  );
};

export default Loading;