import React from 'react';
import { Cpu, Sparkles, Layers, Bookmark, GitCompare, Shield, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentTab: 'wizard' | 'dashboard' | 'catalog' | 'saved' | 'compare' | 'admin';
  setCurrentTab: (tab: 'wizard' | 'dashboard' | 'catalog' | 'saved' | 'compare' | 'admin') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  hasActiveBuild: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isDarkMode,
  setIsDarkMode,
  hasActiveBuild
}) => {
  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setCurrentTab('wizard')}
          >
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Spec<span className="text-indigo-600 dark:text-indigo-400">Core</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                AI Build Engine
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentTab('wizard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-all ${
                currentTab === 'wizard'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Wizard</span>
            </button>

            {hasActiveBuild && (
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Cpu className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('catalog')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-all ${
                currentTab === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Catalog</span>
            </button>

            <button
              onClick={() => setCurrentTab('saved')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-all ${
                currentTab === 'saved'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden md:inline">Saved Builds</span>
            </button>

            <button
              onClick={() => setCurrentTab('compare')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-all ${
                currentTab === 'compare'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <GitCompare className="h-4 w-4" />
              <span className="hidden md:inline">Compare</span>
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-all ${
                currentTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span className="hidden lg:inline">Admin</span>
            </button>

            {/* Dark Mode Toggle */}
            <div className="pl-2 border-l border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Toggle Dark/Light Mode"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
