import React from 'react';
import { GitCompare, Trophy, CheckCircle2, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { PCBuild } from '../types';

interface BuildComparePageProps {
  buildA: PCBuild | null;
  buildB: PCBuild | null;
  allBuilds: PCBuild[];
  onSelectBuildA: (b: PCBuild) => void;
  onSelectBuildB: (b: PCBuild) => void;
}

export const BuildComparePage: React.FC<BuildComparePageProps> = ({
  buildA,
  buildB,
  allBuilds,
  onSelectBuildA,
  onSelectBuildB
}) => {
  if (allBuilds.length < 2 && (!buildA || !buildB)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <GitCompare className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Requires At Least 2 Builds</h2>
        <p className="text-gray-500 max-w-md mx-auto text-sm">
          Please generate and save at least two configurations to perform side-by-side specification comparison and score analysis.
        </p>
      </div>
    );
  }

  // Fallback pick if null
  const b1 = buildA || allBuilds[0];
  const b2 = buildB || (allBuilds.length > 1 ? allBuilds[1] : allBuilds[0]);

  // Determine winner based on overall score and purpose
  const winner = b1.scores.overall >= b2.scores.overall ? b1 : b2;
  const isTie = b1.scores.overall === b2.scores.overall;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <GitCompare className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          Side-by-Side PC Architecture Comparison
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Directly evaluate price efficiency, core bottlenecks, and benchmark suitability between two configurations.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Build A</label>
          <select
            value={b1.id}
            onChange={e => {
              const selected = allBuilds.find(b => b.id === e.target.value);
              if (selected) onSelectBuildA(selected);
            }}
            className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-semibold"
          >
            {allBuilds.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} (₹{b.totalCost.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Build B</label>
          <select
            value={b2.id}
            onChange={e => {
              const selected = allBuilds.find(b => b.id === e.target.value);
              if (selected) onSelectBuildB(selected);
            }}
            className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-semibold"
          >
            {allBuilds.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} (₹{b.totalCost.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Winner Verdict Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-blue-900 text-white shadow-xl flex items-center gap-4">
        <div className="p-3 bg-amber-400 text-gray-900 rounded-2xl flex-shrink-0">
          <Trophy className="h-8 w-8" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            SpecCore Verdict & Recommendation
          </span>
          <h3 className="text-xl font-bold mt-0.5">
            {isTie
              ? 'Both Builds Are Evenly Matched In Value & Capability'
              : `${winner.name} delivers higher overall value and architectural longevity`}
          </h3>
          <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
            {isTie
              ? 'Both configurations deliver comparable computing power. Choose based on your brand preference or aesthetics.'
              : `${winner.name} achieves a higher SpecCore rating (${winner.scores.overall}/100) through superior component balance and lower bottlenecks.`}
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/60 text-xs uppercase text-gray-500 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-bold w-1/4">Specification / Metric</th>
                <th className="px-6 py-4 font-bold w-3/8 text-indigo-600 dark:text-indigo-400">{b1.name}</th>
                <th className="px-6 py-4 font-bold w-3/8 text-blue-600 dark:text-blue-400">{b2.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {/* Total Price */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Total Price</td>
                <td className="px-6 py-4 font-extrabold text-base text-gray-900 dark:text-white">
                  ₹{b1.totalCost.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 font-extrabold text-base text-gray-900 dark:text-white">
                  ₹{b2.totalCost.toLocaleString('en-IN')}
                </td>
              </tr>

              {/* Overall Score */}
              <tr className="bg-indigo-50/40 dark:bg-indigo-950/20 font-bold">
                <td className="px-6 py-4 text-gray-900 dark:text-white">SpecCore Overall Score</td>
                <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 text-lg">
                  {b1.scores.overall} / 100
                </td>
                <td className="px-6 py-4 text-blue-600 dark:text-blue-400 text-lg">
                  {b2.scores.overall} / 100
                </td>
              </tr>

              {/* Performance Score */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Performance Index</td>
                <td className="px-6 py-4 font-semibold">{b1.scores.performance} / 100</td>
                <td className="px-6 py-4 font-semibold">{b2.scores.performance} / 100</td>
              </tr>

              {/* Value Score */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Value for Money</td>
                <td className="px-6 py-4 font-semibold">{b1.scores.value} / 100</td>
                <td className="px-6 py-4 font-semibold">{b2.scores.value} / 100</td>
              </tr>

              {/* Compatibility Score */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Compatibility Score</td>
                <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                  {b1.scores.compatibility} / 100
                </td>
                <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                  {b2.scores.compatibility} / 100
                </td>
              </tr>

              {/* Upgradeability */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Upgradeability Score</td>
                <td className="px-6 py-4 font-semibold">{b1.scores.upgradeability} / 100</td>
                <td className="px-6 py-4 font-semibold">{b2.scores.upgradeability} / 100</td>
              </tr>

              {/* CPU */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-6 py-4 font-medium text-gray-500">Processor (CPU)</td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {b1.components.cpu ? `${b1.components.cpu.brand} ${b1.components.cpu.model}` : 'None'}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {b2.components.cpu ? `${b2.components.cpu.brand} ${b2.components.cpu.model}` : 'None'}
                </td>
              </tr>

              {/* GPU */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-6 py-4 font-medium text-gray-500">Graphics (GPU)</td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {b1.components.gpu ? `${b1.components.gpu.brand} ${b1.components.gpu.model}` : 'Integrated Graphics'}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {b2.components.gpu ? `${b2.components.gpu.brand} ${b2.components.gpu.model}` : 'Integrated Graphics'}
                </td>
              </tr>

              {/* Motherboard */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-6 py-4 font-medium text-gray-500">Motherboard</td>
                <td className="px-6 py-4">{b1.components.motherboard?.model}</td>
                <td className="px-6 py-4">{b2.components.motherboard?.model}</td>
              </tr>

              {/* RAM */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-6 py-4 font-medium text-gray-500">Memory (RAM)</td>
                <td className="px-6 py-4">
                  {b1.components.ram ? `${b1.components.ram.capacity}GB ${b1.components.ram.generation}` : '-'}
                </td>
                <td className="px-6 py-4">
                  {b2.components.ram ? `${b2.components.ram.capacity}GB ${b2.components.ram.generation}` : '-'}
                </td>
              </tr>

              {/* Power Draw */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-6 py-4 font-medium text-gray-500">Estimated Power Draw</td>
                <td className="px-6 py-4">{b1.compatibilityReport.totalSystemPower}W</td>
                <td className="px-6 py-4">{b2.compatibilityReport.totalSystemPower}W</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
