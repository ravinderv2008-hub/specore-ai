import React, { useState } from 'react';
import { Bookmark, Trash2, ExternalLink, GitCompare, Calendar, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { PCBuild } from '../types';

interface SavedBuildsPageProps {
  savedBuilds: PCBuild[];
  onLoadBuild: (build: PCBuild) => void;
  onDeleteBuild: (id: string) => void;
  onCompareBuilds: (buildA: PCBuild, buildB?: PCBuild) => void;
}

export const SavedBuildsPage: React.FC<SavedBuildsPageProps> = ({
  savedBuilds,
  onLoadBuild,
  onDeleteBuild,
  onCompareBuilds
}) => {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const toggleSelectForCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(item => item !== id));
    } else {
      if (selectedForCompare.length < 2) {
        setSelectedForCompare([...selectedForCompare, id]);
      } else {
        setSelectedForCompare([selectedForCompare[1], id]);
      }
    }
  };

  const handleLaunchCompare = () => {
    if (selectedForCompare.length === 2) {
      const b1 = savedBuilds.find(b => b.id === selectedForCompare[0]);
      const b2 = savedBuilds.find(b => b.id === selectedForCompare[1]);
      if (b1 && b2) {
        onCompareBuilds(b1, b2);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            My Saved PC Configurations
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Review past iterations, compare specification architectures, or reload into the active dashboard.
          </p>
        </div>

        {selectedForCompare.length === 2 && (
          <button
            onClick={handleLaunchCompare}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 animate-bounce"
          >
            <GitCompare className="h-4 w-4" />
            <span>Compare Selected 2 Builds</span>
          </button>
        )}
      </div>

      {savedBuilds.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Bookmark className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Saved Builds Yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Use the Build Wizard or Dashboard to engineer a customized system, then click "Save Build" to persist it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedBuilds.map(b => {
            const isSelected = selectedForCompare.includes(b.id);
            return (
              <div
                key={b.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl border transition-all p-6 flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:shadow-lg'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {b.userPreferences.purposes.join(' + ')}
                      </span>
                      <h3 className="font-extrabold text-lg text-gray-900 dark:text-white mt-0.5 line-clamp-1">
                        {b.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteBuild(b.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Build"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Pricing and Overall score */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/60">
                    <div>
                      <div className="text-xs text-gray-400">Total Price</div>
                      <div className="text-xl font-black text-gray-900 dark:text-white">
                        ₹{b.totalCost.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">SpecCore Score</div>
                      <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                        {b.scores.overall}/100
                      </div>
                    </div>
                  </div>

                  {/* Components snippet */}
                  <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                    {b.components.cpu && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">CPU:</span>
                        <span className="font-semibold">{b.components.cpu.brand} {b.components.cpu.model}</span>
                      </div>
                    )}
                    {b.components.gpu && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">GPU:</span>
                        <span className="font-semibold">{b.components.gpu.brand} {b.components.gpu.model}</span>
                      </div>
                    )}
                    {b.components.ram && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">RAM:</span>
                        <span className="font-semibold">{b.components.ram.capacity}GB {b.components.ram.generation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onLoadBuild(b)}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Open in Dashboard</span>
                    </button>
                    <button
                      onClick={() => toggleSelectForCompare(b.id)}
                      className={`px-3 py-2 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border-indigo-500'
                          : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <GitCompare className="h-3.5 w-3.5" />
                      <span>{isSelected ? 'Selected' : 'Compare'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
