
import React from 'react';

interface BottomNavProps {
  currentTab: 'COOK' | 'INVENTORY' | 'SHOPPING' | 'PROFILE' | 'DASHBOARD';
  onTabChange: (tab: 'COOK' | 'INVENTORY' | 'SHOPPING' | 'PROFILE' | 'DASHBOARD') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="absolute bottom-6 left-4 right-4 z-50">
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] px-4 py-4 flex justify-between items-center shadow-lg shadow-black/5">
        <button 
          onClick={() => onTabChange('COOK')}
          className={`flex flex-col items-center space-y-1 w-12 transition-all duration-300 ${currentTab === 'COOK' ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={currentTab === 'COOK' ? 2.5 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </button>

        <button 
          onClick={() => onTabChange('INVENTORY')}
          className={`flex flex-col items-center space-y-1 w-12 transition-all duration-300 ${currentTab === 'INVENTORY' ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={currentTab === 'INVENTORY' ? 2.5 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </button>

         <button 
          onClick={() => onTabChange('DASHBOARD')}
          className={`flex flex-col items-center space-y-1 w-12 transition-all duration-300 ${currentTab === 'DASHBOARD' ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={currentTab === 'DASHBOARD' ? 2.5 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>

        <button 
          onClick={() => onTabChange('SHOPPING')}
          className={`flex flex-col items-center space-y-1 w-12 transition-all duration-300 ${currentTab === 'SHOPPING' ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={currentTab === 'SHOPPING' ? 2.5 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>

        <button 
          onClick={() => onTabChange('PROFILE')}
          className={`flex flex-col items-center space-y-1 w-12 transition-all duration-300 ${currentTab === 'PROFILE' ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={currentTab === 'PROFILE' ? 2.5 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
