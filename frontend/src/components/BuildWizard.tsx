import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Gauge,
  Gamepad2,
  Code,
  Sliders,
  Monitor
} from 'lucide-react';
import { UserPreferences, PCBuild } from '../types';
import { generateRecommendation } from '../utils/recommendationEngine';

interface BuildWizardProps {
  onBuildGenerated: (build: PCBuild) => void;
}

export const BuildWizard: React.FC<BuildWizardProps> = ({ onBuildGenerated }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 100000,
    purposes: ['Gaming', 'Programming'],
    targetResolution: '1440p',
    refreshRate: '165Hz',
    performanceTarget: 'High Performance',
    selectedSoftware: ['VS Code', 'Blender'],
    priorityPreference: 'Balanced',
    preferredBrand: 'No Preference',
    includeMonitor: false
  });

  const budgetPresets = [
    { label: '₹50,000', value: 50000, desc: 'Entry-level Gaming / Everyday' },
    { label: '₹75,000', value: 75000, desc: 'Solid 1080p Ultra Gaming' },
    { label: '₹1,00,000', value: 100000, desc: 'Sweet-spot 1440p High FPS' },
    { label: '₹1,50,000', value: 150000, desc: 'High-end Creator & 1440p/4K' },
    { label: '₹2,20,000', value: 220000, desc: 'Enthusiast 4K & Heavy AI/ML' }
  ];

  const purposeOptions = [
    { name: 'Gaming', icon: '🎮', desc: 'AAA Titles, esports & high framerates' },
    { name: 'Programming', icon: '💻', desc: 'Compiling code, Docker, VMs & IDEs' },
    { name: 'Video Editing', icon: '🎬', desc: '4K timelines, encoding, rendering' },
    { name: '3D Rendering', icon: '🧊', desc: 'Blender, Maya, Unreal Engine' },
    { name: 'AI / Machine Learning', icon: '🧠', desc: 'PyTorch, CUDA, local LLMs' },
    { name: 'Graphic Design', icon: '🎨', desc: 'Photoshop, Illustrator, vector work' },
    { name: 'Office / Productivity', icon: '📊', desc: 'Spreadsheets, browsing, meetings' },
    { name: 'Streaming', icon: '📡', desc: 'Twitch/YouTube OBS hardware encoding' },
    { name: 'CAD', icon: '📐', desc: 'AutoCAD, SolidWorks modeling' },
    { name: 'General Use', icon: '🌐', desc: 'Media consumption & home tasks' }
  ];

  const performanceTargets: UserPreferences['performanceTarget'][] = [
    'Basic',
    'Entry Level',
    'Mid Range',
    'High Performance',
    'Enthusiast'
  ];

  const softwareList = [
    'VS Code',
    'Visual Studio',
    'Android Studio',
    'Blender',
    'Premiere Pro',
    'After Effects',
    'Photoshop',
    'AutoCAD',
    'MATLAB',
    'OBS Studio',
    'Docker Desktop'
  ];

  const togglePurpose = (p: string) => {
    if (preferences.purposes.includes(p)) {
      if (preferences.purposes.length > 1) {
        setPreferences({
          ...preferences,
          purposes: preferences.purposes.filter(item => item !== p)
        });
      }
    } else {
      setPreferences({
        ...preferences,
        purposes: [...preferences.purposes, p]
      });
    }
  };

  const toggleSoftware = (s: string) => {
    if (preferences.selectedSoftware.includes(s)) {
      setPreferences({
        ...preferences,
        selectedSoftware: preferences.selectedSoftware.filter(item => item !== s)
      });
    } else {
      setPreferences({
        ...preferences,
        selectedSoftware: [...preferences.selectedSoftware, s]
      });
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateRecommendation(preferences);
      onBuildGenerated(generated);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Wizard Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3 border border-indigo-200/60 dark:border-indigo-800/60">
          <Sparkles className="h-3.5 w-3.5" />
          <span>SpecCore Intelligent Build Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Build Smarter. Spend Better.
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          SpecCore analyzes hardware compatibility, balances bottlenecks, and engineers the best PC configuration for your budget.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          <span>Step {step} of 6</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
            {step === 1 && 'Budget Definition'}
            {step === 2 && 'Primary Purposes'}
            {step === 3 && 'Performance Target'}
            {step === 4 && 'Resolution & Display'}
            {step === 5 && 'Software Applications'}
            {step === 6 && 'Build Preferences'}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Container Card */}
      <div className="bg-white dark:bg-gray-800/90 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700/80 transition-all">
        {/* STEP 1: Budget */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                What is your total target budget?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Select a recommended budget tier or specify your custom spending limit in Indian Rupees (₹).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {budgetPresets.map(preset => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, budget: preset.value })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    preferences.budget === preset.value
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-900/40'
                  }`}
                >
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{preset.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{preset.desc}</div>
                </button>
              ))}
            </div>

            {/* Custom Budget Slider */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Custom Budget Range
                </label>
                <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  ₹{preferences.budget.toLocaleString('en-IN')}
                </div>
              </div>
              <input
                type="range"
                min="40000"
                max="300000"
                step="5000"
                value={preferences.budget}
                onChange={e => setPreferences({ ...preferences, budget: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>₹40,000</span>
                <span>₹1,50,000</span>
                <span>₹3,00,000</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Purpose */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                What will you primarily use this PC for?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Choose one or more workloads. SpecCore reweights GPU vs. CPU budget priority based on these selections.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {purposeOptions.map(p => {
                const isSelected = preferences.purposes.includes(p.name);
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => togglePurpose(p.name)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-900/40'
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                          {p.name}
                        </span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Performance Target */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Gauge className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Select your Performance Tier Target
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                SpecCore uses this target to determine clock speeds, VRM cooling tier, and core counts.
              </p>
            </div>

            <div className="space-y-3">
              {performanceTargets.map(target => {
                const isSelected = preferences.performanceTarget === target;
                return (
                  <button
                    key={target}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, performanceTarget: target })}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-900/40'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{target}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {target === 'Basic' && 'Quiet, efficient daily productivity and casual web tasks.'}
                        {target === 'Entry Level' && 'High value 1080p esports and budget workstation computing.'}
                        {target === 'Mid Range' && 'Fluid 1080p Ultra & entry 1440p with strong multi-tasking.'}
                        {target === 'High Performance' && 'High refresh 1440p gaming, quick 4K exports and Blender renders.'}
                        {target === 'Enthusiast' && 'Maximum fidelity 4K gaming, local LLMs, and uncompromising parts.'}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Resolution & Refresh Rate */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Display & Gaming Requirements
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Target resolution directly governs whether budget shifts to high VRAM graphics cards.
              </p>
            </div>

            {/* Resolution Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Target Resolution
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['1080p', '1440p', '4K'] as const).map(res => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, targetResolution: res })}
                    className={`py-3 px-4 rounded-xl border text-center font-bold transition-all ${
                      preferences.targetResolution === res
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Refresh Rate Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Target Refresh Rate
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['60Hz', '144Hz', '165Hz', '240Hz+'].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, refreshRate: rate })}
                    className={`py-2.5 px-3 rounded-xl border text-center font-medium text-sm transition-all ${
                      preferences.refreshRate === rate
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>

            {/* Include Monitor Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.includeMonitor}
                  onChange={e => setPreferences({ ...preferences, includeMonitor: e.target.checked })}
                  className="h-4 w-4 rounded accent-indigo-600 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Include Dedicated Gaming/Creator Monitor in Budget
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Allocates ₹11,000 - ₹17,000 for a matched Fast-IPS high-refresh display.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 5: Software Requirements */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Select Software & Toolchains You Use
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                SpecCore verifies hardware instruction sets, CUDA requirements, and RAM minimums for selected applications.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {softwareList.map(app => {
                const isSelected = preferences.selectedSoftware.includes(app);
                return (
                  <button
                    key={app}
                    type="button"
                    onClick={() => toggleSoftware(app)}
                    className={`p-3 rounded-xl border text-left text-sm font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    <span>{app}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Preferences */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sliders className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Optimization Priority & Brand Preferences
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Guide the algorithmic recommendation engine toward what matters most to you.
              </p>
            </div>

            {/* Priority Preference */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Primary Goal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Maximum Performance', desc: 'Push hardware limits' },
                  { label: 'Best Value', desc: 'Maximize FPS per Rupee' },
                  { label: 'Balanced', desc: 'Optimal stability & thermals' },
                  { label: 'Future Upgradeability', desc: 'AM5 & high-headroom PSU' },
                  { label: 'Low Power Consumption', desc: 'Cool, quiet, efficient' }
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, priorityPreference: p.label as any })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      preferences.priorityPreference === p.label
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    <div className="font-bold text-sm">{p.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Preference */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Preferred Processor Ecosystem
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['No Preference', 'AMD', 'Intel'].map(brand => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, preferredBrand: brand })}
                    className={`py-2.5 px-3 rounded-xl border text-center font-medium text-sm transition-all ${
                      preferences.preferredBrand === brand
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing & Engineering Build...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate SpecCore Build</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
