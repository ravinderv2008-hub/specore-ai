import React from 'react';
import { X, ArrowRightLeft, ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { AnyComponent, PCBuild } from '../types';
import { ALL_COMPONENTS } from '../data/componentsData';
import { runCompatibilityCheck } from '../utils/compatibilityEngine';

interface ReplaceComponentModalProps {
  currentComponent: AnyComponent | null;
  activeBuild: PCBuild;
  onClose: () => void;
  onSelectReplacement: (oldComp: AnyComponent, newComp: AnyComponent) => void;
}

export const ReplaceComponentModal: React.FC<ReplaceComponentModalProps> = ({
  currentComponent,
  activeBuild,
  onClose,
  onSelectReplacement
}) => {
  if (!currentComponent) return null;

  // Filter alternatives in the same category excluding the current one
  const alternatives = ALL_COMPONENTS.filter(
    c => c.category === currentComponent.category && c.id !== currentComponent.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Replace {currentComponent.category}
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Current: <span className="font-semibold text-gray-700 dark:text-gray-300">{currentComponent.productName}</span> (₹{currentComponent.price.toLocaleString('en-IN')})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Alternatives List */}
        <div className="p-6 space-y-4">
          {alternatives.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No alternative components found in this category.
            </div>
          ) : (
            alternatives.map(alt => {
              const priceDelta = alt.price - currentComponent.price;
              const isSavings = priceDelta < 0;
              const perfDelta = alt.performanceScore - currentComponent.performanceScore;

              // Test trial compatibility if swapped
              const trialComponents = {
                ...activeBuild.components,
                [currentComponent.category.toLowerCase()]: alt
              };
              const trialCheck = runCompatibilityCheck(trialComponents as any);

              return (
                <div
                  key={alt.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 bg-gray-50/50 dark:bg-gray-900/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white text-base">
                        {alt.brand} {alt.model}
                      </span>
                      <div className="flex items-center text-xs text-amber-500 font-semibold">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                        {alt.rating}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">{alt.productName}</div>

                    {/* Metrics badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {/* Price delta */}
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1 ${
                          isSavings
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                        }`}
                      >
                        {isSavings ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                        {isSavings
                          ? `Save ₹${Math.abs(priceDelta).toLocaleString('en-IN')}`
                          : `+₹${priceDelta.toLocaleString('en-IN')}`}
                      </span>

                      {/* Performance delta */}
                      <span className="text-xs px-2 py-0.5 rounded font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        Perf: {perfDelta >= 0 ? `+${perfDelta}%` : `${perfDelta}%`}
                      </span>

                      {/* Compatibility badge */}
                      {trialCheck.isCompatible ? (
                        <span className="text-xs px-2 py-0.5 rounded font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/60">
                          <ShieldCheck className="h-3 w-3" /> Compatible
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-1 border border-rose-200 dark:border-rose-800/60">
                          <AlertTriangle className="h-3 w-3" /> Incompatible
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200 dark:border-gray-700">
                    <div className="text-lg font-extrabold text-gray-900 dark:text-white">
                      ₹{alt.price.toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => {
                        onSelectReplacement(currentComponent, alt);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all whitespace-nowrap"
                    >
                      Swap Component
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
