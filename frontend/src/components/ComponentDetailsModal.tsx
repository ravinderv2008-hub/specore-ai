import React from 'react';
import { X, Star, ShieldCheck, Zap, Layers, CheckCircle2, AlertTriangle, Cpu, Tag } from 'lucide-react';
import { AnyComponent } from '../types';

interface ComponentDetailsModalProps {
  component: AnyComponent | null;
  onClose: () => void;
  onReplace?: (comp: AnyComponent) => void;
}

export const ComponentDetailsModal: React.FC<ComponentDetailsModalProps> = ({
  component,
  onClose,
  onReplace
}) => {
  if (!component) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {component.category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">SpecCore ID #{component.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Info Hero */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex-shrink-0 relative group">
              <img
                src={component.imageUrl}
                alt={component.productName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold backdrop-blur-sm">
                Verified Spec
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase">{component.brand}</div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {component.productName}
              </h2>
              <div className="flex items-center space-x-4 pt-1">
                <div className="flex items-center text-amber-500 font-bold text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                  <span>{component.rating}</span>
                  <span className="text-gray-400 text-xs ml-1">({component.reviewCount} reviews)</span>
                </div>
                <div className="text-xs px-2.5 py-0.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 font-semibold border border-green-200 dark:border-green-800 flex items-center">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  SpecCore Certified
                </div>
              </div>

              {/* Price block */}
              <div className="pt-3">
                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  ₹{component.price.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-gray-400 block font-medium">
                  Estimated / Demo Price (Real-time e-commerce sync ready)
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Product Overview</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {component.description}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Technical & Architecture Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {'socket' in component && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">CPU Socket</span>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">{component.socket}</div>
                </div>
              )}
              {'cores' in component && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">Cores / Threads</span>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                    {component.cores}C / {component.threads}T
                  </div>
                </div>
              )}
              {'boostClock' in component && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">Boost Clock</span>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">{component.boostClock}</div>
                </div>
              )}
              {'vram' in component && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">VRAM Buffer</span>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                    {component.vram}GB {component.memoryType}
                  </div>
                </div>
              )}
              {'formFactor' in component && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">Form Factor</span>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">{component.formFactor}</div>
                </div>
              )}
              {'ramType' in component && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">Memory Support</span>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">{component.ramType}</div>
                </div>
              )}
              {'capacity' in component && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">Capacity</span>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                    {typeof component.capacity === 'number' ? `${component.capacity} GB` : component.capacity}
                  </div>
                </div>
              )}
              {'readSpeed' in component && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">Sequential Read</span>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">{component.readSpeed} MB/s</div>
                </div>
              )}
              {'wattage' in component && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">Power Rating</span>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                    {component.wattage}W ({component.efficiencyRating})
                  </div>
                </div>
              )}
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500">Power / TDP Draw</span>
                <div className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {component.powerRequirement}W
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500">SpecCore Performance Index</span>
                <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                  {component.performanceScore} / 100
                </div>
              </div>
            </div>
          </div>

          {/* Advantages & Disadvantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                SpecCore Advantages
              </h4>
              <ul className="space-y-1.5">
                {component.advantages.map((adv, idx) => (
                  <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Considerations & Drawbacks
              </h4>
              <ul className="space-y-1.5">
                {component.disadvantages.map((dis, idx) => (
                  <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Use Cases */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Recommended Workloads
            </h4>
            <div className="flex flex-wrap gap-2">
              {component.recommendedUseCases.map((useCase, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Close Details
          </button>
          {onReplace && (
            <button
              onClick={() => {
                onClose();
                onReplace(component);
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Explore Alternatives / Replace</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
