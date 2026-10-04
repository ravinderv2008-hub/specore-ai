import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Star, ShieldCheck, Eye, ArrowUpDown } from 'lucide-react';
import { AnyComponent, ComponentCategory } from '../types';
import { ALL_COMPONENTS } from '../data/componentsData';

interface CatalogPageProps {
  onViewDetails: (component: AnyComponent) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(110000);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'performance'>('performance');

  const categories: (string | ComponentCategory)[] = [
    'All',
    'CPU',
    'GPU',
    'Motherboard',
    'RAM',
    'Storage',
    'PSU',
    'Cabinet',
    'Cooler',
    'Monitor'
  ];

  const brands = useMemo(() => {
    const list = new Set<string>();
    ALL_COMPONENTS.forEach(c => list.add(c.brand));
    return ['All', ...Array.from(list)];
  }, []);

  const filteredComponents = useMemo(() => {
    return ALL_COMPONENTS.filter(comp => {
      const matchesSearch =
        comp.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'All' || comp.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || comp.brand === selectedBrand;
      const matchesPrice = comp.price <= maxPrice;

      return matchesSearch && matchesCat && matchesBrand && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'performance') return b.performanceScore - a.performanceScore;
      return 0;
    });
  }, [searchTerm, selectedCategory, selectedBrand, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Hardware Component Catalog
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Explore SpecCore's verified hardware specifications, verified dimensions, and real-world benchmarks.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search CPU, GPU, brand, model..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Brand Filter */}
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {brands.map(b => (
                <option key={b} value={b}>
                  Brand: {b}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="flex flex-col justify-center px-2">
            <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              <span>Max Price</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="3000"
              max="110000"
              step="2000"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="performance">Sort: SpecCore Performance</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="rating">Sort: User Rating</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-gray-100 dark:border-gray-700">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>Showing {filteredComponents.length} components</span>
        <span>Verified SpecCore Hardware Database</span>
      </div>

      {/* Grid of Components */}
      {filteredComponents.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
          <p className="text-gray-500 font-medium">No components match your search filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedBrand('All');
              setMaxPrice(110000);
            }}
            className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredComponents.map(comp => (
            <div
              key={comp.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="h-44 w-full bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
                  <img
                    src={comp.imageUrl}
                    alt={comp.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
                    {comp.category}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-amber-400 text-[11px] font-bold flex items-center">
                    <Star className="h-3 w-3 fill-amber-400 mr-1" />
                    {comp.rating}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-bold text-gray-400 uppercase">{comp.brand}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-1">
                    {comp.model}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {comp.productName}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>Performance Index:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {comp.performanceScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-extrabold text-gray-900 dark:text-white">
                      ₹{comp.price.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[9px] text-gray-400">Estimated Price</span>
                  </div>
                  <button
                    onClick={() => onViewDetails(comp)}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-indigo-600 hover:text-white text-gray-700 dark:text-gray-200 text-xs font-semibold transition-all flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Specs</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
