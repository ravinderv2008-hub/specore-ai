import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

interface ComponentCardProps {
  id: number;
  category: string;
  brand: string;
  model: string;
  productName: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ 
  category, brand, model, productName, price, rating, reviewCount, description 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{category}</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{brand} {model}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{productName}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full flex items-center text-sm font-semibold">
            <ShieldCheck size={16} className="mr-1" />
            Compatible
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{price.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center text-sm text-yellow-500 font-medium">
            ⭐ {rating} <span className="text-gray-400 ml-1">({reviewCount})</span>
          </div>
        </div>
        
        <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};
