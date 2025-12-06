import React, { useState } from 'react';
import { ShoppingItem } from '../types';

interface ShoppingListViewProps {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onAdd: (name: string) => void;
  onClearCompleted: () => void;
  onDelete: (id: string) => void;
}

const ShoppingListView: React.FC<ShoppingListViewProps> = ({ 
  items, 
  onToggle, 
  onAdd, 
  onClearCompleted,
  onDelete
}) => {
  const [newItem, setNewItem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAdd(newItem.trim());
      setNewItem('');
    }
  };

  const activeItems = items.filter(i => !i.completed);
  const completedItems = items.filter(i => i.completed);

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 z-10 sticky top-0 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Shopping</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {activeItems.length} items to buy
            </p>
          </div>
          <div className="bg-white/50 p-2.5 rounded-2xl shadow-sm border border-white/60">
             <span className="text-2xl">🛒</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
        
        {/* Add Item Input */}
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add item..."
            className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 focus:bg-white/80 focus:border-green-400 focus:ring-4 focus:ring-green-100/50 outline-none shadow-sm transition-all placeholder-gray-400 text-gray-700"
          />
          <button 
            type="submit"
            disabled={!newItem.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-green-500 text-white rounded-xl disabled:opacity-30 disabled:bg-gray-400 shadow-lg shadow-green-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </form>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-10 opacity-60">
            <div className="inline-block p-5 bg-white/40 rounded-full mb-4 border border-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <p className="text-gray-600 font-medium">Your list is empty</p>
          </div>
        )}

        {/* Active List */}
        {activeItems.length > 0 && (
          <div className="space-y-3">
            {activeItems.map(item => (
              <div key={item.id} className="group flex items-center bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm transition-all hover:bg-white/80">
                <button 
                  onClick={() => onToggle(item.id)}
                  className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 mr-4 flex items-center justify-center hover:border-green-500 hover:bg-green-50 transition-all"
                >
                </button>
                <span className="flex-grow text-gray-800 font-medium">{item.name}</span>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="p-2 bg-gray-100/50 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Completed List */}
        {completedItems.length > 0 && (
          <div className="pt-6">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Completed</h3>
                <button onClick={onClearCompleted} className="text-xs text-red-400 hover:text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-md">Clear</button>
            </div>
            <div className="space-y-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
                {completedItems.map(item => (
                <div key={item.id} className="flex items-center bg-gray-50/50 p-3 rounded-2xl border border-transparent">
                    <button 
                    onClick={() => onToggle(item.id)}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 border-2 border-green-500 mr-4 flex items-center justify-center text-white shadow-sm"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    </button>
                    <span className="flex-grow text-gray-500 line-through decoration-gray-400">{item.name}</span>
                    <button 
                        onClick={() => onDelete(item.id)}
                        className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListView;