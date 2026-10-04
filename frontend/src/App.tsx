import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BuildWizard } from './components/BuildWizard';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { CatalogPage } from './components/CatalogPage';
import { SavedBuildsPage } from './components/SavedBuildsPage';
import { BuildComparePage } from './components/BuildComparePage';
import { AdminPage } from './components/AdminPage';
import { ComponentDetailsModal } from './components/ComponentDetailsModal';
import { ReplaceComponentModal } from './components/ReplaceComponentModal';
import { PCBuild, AnyComponent } from './types';
import { generateRecommendation } from './utils/recommendationEngine';
import { runCompatibilityCheck } from './utils/compatibilityEngine';

function App() {
  const [currentTab, setCurrentTab] = useState<'wizard' | 'dashboard' | 'catalog' | 'saved' | 'compare' | 'admin'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Initialize demo builds for immediate testing
  const [activeBuild, setActiveBuild] = useState<PCBuild>(() => {
    return generateRecommendation({
      budget: 100000,
      purposes: ['Gaming', 'Programming'],
      targetResolution: '1440p',
      refreshRate: '165Hz',
      performanceTarget: 'High Performance',
      selectedSoftware: ['VS Code', 'Blender'],
      priorityPreference: 'Balanced',
      includeMonitor: false
    });
  });

  const [savedBuilds, setSavedBuilds] = useState<PCBuild[]>(() => {
    const defaultBuild1 = generateRecommendation({
      budget: 100000,
      purposes: ['Gaming', 'Programming'],
      targetResolution: '1440p',
      refreshRate: '165Hz',
      performanceTarget: 'High Performance',
      selectedSoftware: ['VS Code', 'Blender'],
      priorityPreference: 'Balanced',
      includeMonitor: false
    });

    const defaultBuild2 = generateRecommendation({
      budget: 160000,
      purposes: ['Video Editing', 'AI / Machine Learning'],
      targetResolution: '4K',
      refreshRate: '144Hz',
      performanceTarget: 'Enthusiast',
      selectedSoftware: ['Premiere Pro', 'PyTorch'],
      priorityPreference: 'Maximum Performance',
      preferredBrand: 'Intel',
      includeMonitor: true
    });

    return [defaultBuild1, defaultBuild2];
  });

  // Compare states
  const [compareBuildA, setCompareBuildA] = useState<PCBuild | null>(null);
  const [compareBuildB, setCompareBuildB] = useState<PCBuild | null>(null);

  // Modal states
  const [detailComponent, setDetailComponent] = useState<AnyComponent | null>(null);
  const [replaceComponent, setReplaceComponent] = useState<AnyComponent | null>(null);

  // Alert notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync dark mode class with html element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle build generated from wizard
  const handleBuildGenerated = (build: PCBuild) => {
    setActiveBuild(build);
    setCurrentTab('dashboard');
    showToast(`SpecCore engineered "${build.name}" successfully!`);
  };

  // Handle saving build
  const handleSaveBuild = (build: PCBuild) => {
    const exists = savedBuilds.some(b => b.id === build.id);
    if (!exists) {
      setSavedBuilds([build, ...savedBuilds]);
    }
    showToast(`Build "${build.name}" saved to your profile!`);
  };

  // Handle delete build
  const handleDeleteBuild = (id: string) => {
    setSavedBuilds(savedBuilds.filter(b => b.id !== id));
    showToast('Build removed from saved list.');
  };

  // Handle replacing a component
  const handleSelectReplacement = (_oldComp: AnyComponent, newComp: AnyComponent) => {
    const slotKey = newComp.category.toLowerCase();
    const updatedComponents = {
      ...activeBuild.components,
      [slotKey]: newComp
    };
    const newTotalCost = Object.values(updatedComponents).reduce(
      (sum, item) => sum + (item?.price || 0),
      0
    );

    const newCompReport = runCompatibilityCheck(updatedComponents as any, activeBuild.targetBudget);

    const updatedBuild: PCBuild = {
      ...activeBuild,
      components: updatedComponents as any,
      totalCost: newTotalCost,
      compatibilityReport: newCompReport,
      scores: {
        ...activeBuild.scores,
        compatibility: newCompReport.score
      }
    };

    setActiveBuild(updatedBuild);
    showToast(`Swapped with ${newComp.brand} ${newComp.model}. Recalculated compatibility.`);
  };

  // Handle applying optimization recommendation
  const handleApplyOptimization = (orig: AnyComponent, suggested: AnyComponent) => {
    handleSelectReplacement(orig, suggested);
  };

  // Trigger side-by-side comparison from saved builds
  const handleCompareBuilds = (b1: PCBuild, b2?: PCBuild) => {
    setCompareBuildA(b1);
    setCompareBuildB(b2 || savedBuilds[1] || savedBuilds[0]);
    setCurrentTab('compare');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom-5">
          <span>✓ {toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        hasActiveBuild={!!activeBuild}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {currentTab === 'wizard' && (
          <BuildWizard onBuildGenerated={handleBuildGenerated} />
        )}

        {currentTab === 'dashboard' && activeBuild && (
          <AnalysisDashboard
            build={activeBuild}
            onViewDetails={comp => setDetailComponent(comp)}
            onReplaceComponent={comp => setReplaceComponent(comp)}
            onSaveBuild={handleSaveBuild}
            onApplyOptimization={handleApplyOptimization}
            onRerunWizard={() => setCurrentTab('wizard')}
          />
        )}

        {currentTab === 'catalog' && (
          <CatalogPage onViewDetails={comp => setDetailComponent(comp)} />
        )}

        {currentTab === 'saved' && (
          <SavedBuildsPage
            savedBuilds={savedBuilds}
            onLoadBuild={b => {
              setActiveBuild(b);
              setCurrentTab('dashboard');
            }}
            onDeleteBuild={handleDeleteBuild}
            onCompareBuilds={handleCompareBuilds}
          />
        )}

        {currentTab === 'compare' && (
          <BuildComparePage
            buildA={compareBuildA}
            buildB={compareBuildB}
            allBuilds={savedBuilds}
            onSelectBuildA={b => setCompareBuildA(b)}
            onSelectBuildB={b => setCompareBuildB(b)}
          />
        )}

        {currentTab === 'admin' && <AdminPage />}
      </main>

      {/* Modals */}
      <ComponentDetailsModal
        component={detailComponent}
        onClose={() => setDetailComponent(null)}
        onReplace={comp => {
          setDetailComponent(null);
          setReplaceComponent(comp);
        }}
      />

      <ReplaceComponentModal
        currentComponent={replaceComponent}
        activeBuild={activeBuild}
        onClose={() => setReplaceComponent(null)}
        onSelectReplacement={handleSelectReplacement}
      />

      {/* Modern Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 py-8 text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900 dark:text-white">SpecCore</span>
            <span>— Intelligent PC Specification Analysis & Build Optimization</span>
          </div>
          <div className="text-gray-400">
            Rule-Based Compatibility & Scoring Engine • Estimated Market Pricing
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
