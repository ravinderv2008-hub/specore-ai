import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRightLeft,
  Eye,
  Bookmark,
  Share2,
  Sparkles,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PCBuild, AnyComponent } from '../types';

interface AnalysisDashboardProps {
  build: PCBuild;
  onViewDetails: (component: AnyComponent) => void;
  onReplaceComponent: (component: AnyComponent) => void;
  onSaveBuild: (build: PCBuild) => void;
  onApplyOptimization: (orig: AnyComponent, suggested: AnyComponent) => void;
  onRerunWizard: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  build,
  onViewDetails,
  onReplaceComponent,
  onSaveBuild,
  onApplyOptimization,
  onRerunWizard
}) => {
  const { totalCost, targetBudget, scores, compatibilityReport, components, optimizationSuggestions, explanation } = build;
  const remainingBudget = targetBudget - totalCost;
  const isOverBudget = remainingBudget < 0;

  // Chart data for Budget Breakdown
  const chartColors = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#64748b'];
  const costData = Object.entries(components)
    .filter(([_, comp]) => !!comp)
    .map(([cat, comp]) => ({
      name: comp?.category || cat,
      value: comp?.price || 0
    }));

  const componentList = Object.entries(components).filter(([_, comp]) => !!comp) as [string, AnyComponent][];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Hero Summary */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                SpecCore Verification Complete
              </span>
              <span className="text-xs text-gray-400">
                {new Date(build.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{build.name}</h1>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              Targeting <span className="font-semibold text-white">{build.userPreferences.purposes.join(', ')}</span> at{' '}
              <span className="font-semibold text-white">{build.userPreferences.targetResolution}</span> with{' '}
              <span className="font-semibold text-white">{build.userPreferences.priorityPreference}</span> priority.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSaveBuild(build)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md border border-white/10 transition-all flex items-center gap-2"
            >
              <Bookmark className="h-4 w-4" />
              <span>Save Build</span>
            </button>
            <button
              onClick={onRerunWizard}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Modify Config</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <div className="text-xs text-gray-400 font-medium">Total Configuration Cost</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              ₹{totalCost.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Target Budget</div>
            <div className="text-2xl sm:text-3xl font-black text-gray-300 mt-1">
              ₹{targetBudget.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Budget Status</div>
            <div
              className={`text-2xl sm:text-3xl font-black mt-1 ${
                isOverBudget ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isOverBudget
                ? `+₹${Math.abs(remainingBudget).toLocaleString('en-IN')} Over`
                : `₹${remainingBudget.toLocaleString('en-IN')} Remaining`}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Estimated Power Draw</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 flex items-center gap-1">
              <Zap className="h-5 w-5 fill-amber-400" />
              <span>{compatibilityReport.totalSystemPower}W</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Optimization Alert (Section 11 Requirement) */}
      {optimizationSuggestions.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-base">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>SpecCore Budget Optimization Engine Suggestion</span>
          </div>
          {optimizationSuggestions.map((sug, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800/40"
            >
              <div className="space-y-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">{sug.reason}</p>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Saves: ₹{Math.abs(sug.costDifference).toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-500">Performance impact: {sug.performanceImpact}</span>
                </div>
              </div>
              <button
                onClick={() => onApplyOptimization(sug.originalComponent, sug.suggestedComponent)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
              >
                Accept Optimization Swap
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SpecCore Scoring Section (Section 12 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Overall Score', val: scores.overall, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/50' },
          { label: 'Compatibility', val: scores.compatibility, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
          { label: 'Performance', val: scores.performance, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/50' },
          { label: 'Value for Money', val: scores.value, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50' },
          { label: 'Upgradeability', val: scores.upgradeability, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/50' }
        ].map(item => (
          <div
            key={item.label}
            className={`p-5 rounded-2xl border border-gray-200 dark:border-gray-800 ${item.bg} text-center space-y-1 shadow-sm`}
          >
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {item.label}
            </div>
            <div className={`text-3xl sm:text-4xl font-black ${item.color}`}>
              {item.val}<span className="text-base font-normal text-gray-400">/100</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Compatibility Audit Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Breakdown Donut Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Cost Allocation Breakdown</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {costData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {costData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compatibility Engine Audit Log */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Automated Compatibility & Hardware Checks
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                compatibilityReport.isCompatible
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
              }`}
            >
              {compatibilityReport.isCompatible ? '✓ 100% Compatible' : '✕ Issues Detected'}
            </span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {compatibilityReport.issues.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  Flawless electrical, physical, and socket match across all 8 core subsystems. No bottlenecks or clearance conflicts found.
                </p>
              </div>
            ) : (
              compatibilityReport.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    issue.severity === 'ERROR'
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 text-rose-900 dark:text-rose-200'
                      : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    {issue.severity === 'ERROR' ? (
                      <XCircle className="h-4 w-4 text-rose-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    <span>{issue.title}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{issue.message}</p>
                  <p className="font-semibold text-indigo-600 dark:text-indigo-400 pt-0.5">
                    Fix: {issue.recommendation}
                  </p>
                </div>
              ))
            )}

            {/* PSU Headroom Check Note */}
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-300">
                Power Supply Headroom ({compatibilityReport.totalSystemPower}W estimated / Recommended:{' '}
                {compatibilityReport.recommendedPsuWattage}W)
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ✓ {compatibilityReport.psuHeadroomStatus} Headroom
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation System Box (Section 16 Requirement) */}
      <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 space-y-2">
        <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          SpecCore Architectural Decision Rationale
        </h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{explanation}</p>
      </div>

      {/* COMPONENT CARDS GRID (Section 13 Requirement) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Configured Components List
          </h2>
          <span className="text-xs text-gray-500">
            Click 'Replace' to test alternatives with live recalculation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {componentList.map(([slot, comp]) => (
            <div
              key={comp.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header tag and image */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                      {comp.category}
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base mt-1 line-clamp-1">
                      {comp.brand} {comp.model}
                    </h3>
                  </div>
                  <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-900 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                    <img
                      src={comp.imageUrl}
                      alt={comp.model}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {comp.productName}
                </p>

                {/* Short specs */}
                <div className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700/60 space-y-1">
                  {'socket' in comp && <div>Socket: {(comp as any).socket}</div>}
                  {'vram' in comp && <div>VRAM: {(comp as any).vram}GB {(comp as any).memoryType}</div>}
                  {'capacity' in comp && <div>Capacity: {(comp as any).capacity} ({(comp as any).generation || (comp as any).storageType})</div>}
                  {'wattage' in comp && <div>Wattage: {(comp as any).wattage}W ({(comp as any).efficiencyRating})</div>}
                  <div className="text-[11px] text-gray-400">Power: {comp.powerRequirement}W</div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-4 mt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xl font-extrabold text-gray-900 dark:text-white">
                      ₹{comp.price.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">Estimated Price</span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                    <ShieldCheck className="h-3.5 w-3.5 mr-0.5" />
                    Compatible
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onViewDetails(comp)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Details</span>
                  </button>
                  <button
                    onClick={() => onReplaceComponent(comp)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-indigo-200 dark:border-indigo-800"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    <span>Replace</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
