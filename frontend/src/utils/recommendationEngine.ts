import {
  UserPreferences,
  PCBuild,
  BuildScores,
  CpuComponent,
  GpuComponent,
  MotherboardComponent,
  RamComponent,
  StorageComponent,
  PsuComponent,
  CabinetComponent,
  CoolerComponent,
  MonitorComponent,
  OptimizationSuggestion
} from '../types';
import {
  CPUS,
  GPUS,
  MOTHERBOARDS,
  RAM_MODULES,
  STORAGES,
  PSUS,
  CABINETS,
  COOLERS,
  MONITORS
} from '../data/componentsData';
import { runCompatibilityCheck } from './compatibilityEngine';

export function generateRecommendation(prefs: UserPreferences): PCBuild {
  const isGaming = prefs.purposes.includes('Gaming');
  const isAIML = prefs.purposes.includes('AI / Machine Learning');
  const isVideoEditing = prefs.purposes.includes('Video Editing') || prefs.purposes.includes('3D Rendering');
  const isProgramming = prefs.purposes.includes('Programming');
  const isOffice = prefs.purposes.includes('Office / Productivity') || prefs.purposes.includes('General Use');

  const effectiveBudget = prefs.includeMonitor ? Math.max(35000, prefs.budget - 12000) : prefs.budget;

  // 1. Choose CPU
  let selectedCpu: CpuComponent;
  if (effectiveBudget < 55000) {
    selectedCpu = CPUS.find(c => c.model.includes('5600')) || CPUS[4];
  } else if (effectiveBudget < 90000) {
    if (prefs.preferredBrand === 'Intel') {
      selectedCpu = CPUS.find(c => c.brand === 'Intel' && c.model.includes('13400')) || CPUS[2];
    } else {
      selectedCpu = CPUS.find(c => c.model.includes('7600')) || CPUS[0];
    }
  } else if (effectiveBudget < 140000) {
    if (isVideoEditing || isAIML) {
      selectedCpu = (prefs.preferredBrand === 'Intel')
        ? (CPUS.find(c => c.brand === 'Intel' && c.model.includes('14700K')) || CPUS[3])
        : (CPUS.find(c => c.model.includes('7700X')) || CPUS[1]);
    } else {
      selectedCpu = CPUS.find(c => c.model.includes('7600')) || CPUS[0];
    }
  } else {
    selectedCpu = (prefs.preferredBrand === 'AMD')
      ? (CPUS.find(c => c.model.includes('7700X')) || CPUS[1])
      : (CPUS.find(c => c.model.includes('14700K')) || CPUS[3]);
  }

  // 2. Choose Motherboard matching CPU socket and budget
  let selectedMobo: MotherboardComponent;
  const compatibleMobos = MOTHERBOARDS.filter(m => m.socket === selectedCpu.socket);
  if (effectiveBudget < 70000 || prefs.priorityPreference === 'Best Value') {
    selectedMobo = compatibleMobos.reduce((prev, curr) => curr.price < prev.price ? curr : prev, compatibleMobos[0]);
  } else {
    // Prefer higher tier feature set (ATX / Wi-Fi)
    selectedMobo = compatibleMobos.find(m => m.wifi && m.formFactor === 'ATX') || compatibleMobos[0];
  }

  // 3. Choose RAM matching Motherboard ramType and Purpose
  let selectedRam: RamComponent;
  const compatibleRams = RAM_MODULES.filter(r => r.generation === selectedMobo.ramType);
  if (isAIML || (isVideoEditing && effectiveBudget >= 120000)) {
    selectedRam = compatibleRams.find(r => r.capacity >= 32) || compatibleRams[0];
  } else if (effectiveBudget >= 80000) {
    selectedRam = compatibleRams.find(r => r.capacity === 32) || compatibleRams[0];
  } else {
    selectedRam = compatibleRams.find(r => r.capacity === 16) || compatibleRams[0];
  }

  // 4. Choose GPU matching Budget and Purpose
  let selectedGpu: GpuComponent | undefined;
  if (isOffice && !isGaming && !isAIML && !isVideoEditing && selectedCpu.integratedGraphics) {
    selectedGpu = undefined; // Integrated graphics handles office easily
  } else if (effectiveBudget < 60000) {
    selectedGpu = GPUS.find(g => g.model.includes('RX 7600')) || GPUS[2];
  } else if (effectiveBudget < 110000) {
    if (prefs.targetResolution === '1440p' && effectiveBudget >= 95000 && !prefs.includeMonitor) {
      selectedGpu = GPUS.find(g => g.model.includes('4070')) || GPUS[1];
    } else {
      selectedGpu = GPUS.find(g => g.model.includes('4060')) || GPUS[0];
    }
  } else if (effectiveBudget < 180000) {
    selectedGpu = GPUS.find(g => g.model.includes('4070')) || GPUS[1];
  } else {
    selectedGpu = GPUS.find(g => g.model.includes('4080')) || GPUS[3];
  }

  // 5. Choose Storage
  let selectedStorage: StorageComponent;
  if (isVideoEditing || effectiveBudget >= 130000) {
    selectedStorage = STORAGES.find(s => s.capacity === '2TB') || STORAGES[1];
  } else if (effectiveBudget < 55000) {
    selectedStorage = STORAGES.find(s => s.capacity === '500GB') || STORAGES[2];
  } else {
    selectedStorage = STORAGES.find(s => s.capacity === '1TB') || STORAGES[0];
  }

  // 6. Calculate System Power and pick PSU
  const baseTdp = selectedCpu.tdp + (selectedGpu ? selectedGpu.tdp : 0) + 70;
  const targetWattage = Math.ceil((baseTdp * 1.35) / 50) * 50;

  let selectedPsu: PsuComponent;
  const validPsus = PSUS.filter(p => p.wattage >= targetWattage);
  if (validPsus.length > 0) {
    selectedPsu = validPsus.reduce((prev, curr) => curr.price < prev.price ? curr : prev, validPsus[0]);
  } else {
    selectedPsu = PSUS.reduce((prev, curr) => curr.wattage > prev.wattage ? curr : prev, PSUS[0]);
  }

  // 7. Choose Cooler compatible with CPU socket
  let selectedCooler: CoolerComponent;
  const compatibleCoolers = COOLERS.filter(c => c.supportedSockets.includes(selectedCpu.socket));
  if (selectedCpu.tdp >= 200) {
    selectedCooler = compatibleCoolers.find(c => c.coolerType === 'AIO Liquid 360mm') || compatibleCoolers[compatibleCoolers.length - 1];
  } else if (selectedCpu.tdp >= 100 || effectiveBudget >= 100000) {
    selectedCooler = compatibleCoolers.find(c => c.coolerType.includes('AIO') || c.tdpCapacity >= 220) || compatibleCoolers[0];
  } else {
    selectedCooler = compatibleCoolers.find(c => c.coolerType === 'Air Cooler') || compatibleCoolers[0];
  }

  // 8. Choose Cabinet compatible with Motherboard and GPU
  let selectedCabinet: CabinetComponent;
  const compatibleCabinets = CABINETS.filter(c =>
    c.supportedFormFactors.includes(selectedMobo.formFactor) &&
    (!selectedGpu || c.gpuClearance >= selectedGpu.length) &&
    (selectedCooler.coolerType !== 'Air Cooler' || c.cpuCoolerClearance >= selectedCooler.height)
  );

  if (effectiveBudget >= 120000) {
    selectedCabinet = compatibleCabinets.find(c => c.brand === 'Lian Li' || c.brand === 'NZXT') || compatibleCabinets[0];
  } else {
    selectedCabinet = compatibleCabinets[0] || CABINETS[0];
  }

  // 9. Choose Monitor if requested
  let selectedMonitor: MonitorComponent | undefined;
  if (prefs.includeMonitor) {
    if (prefs.targetResolution === '1440p' || effectiveBudget > 90000) {
      selectedMonitor = MONITORS.find(m => m.resolution === '1440p') || MONITORS[0];
    } else {
      selectedMonitor = MONITORS.find(m => m.resolution === '1080p') || MONITORS[1];
    }
  }

  const initialComponents = {
    cpu: selectedCpu,
    gpu: selectedGpu,
    motherboard: selectedMobo,
    ram: selectedRam,
    storage: selectedStorage,
    psu: selectedPsu,
    cabinet: selectedCabinet,
    cooler: selectedCooler,
    monitor: selectedMonitor
  };

  const totalCost = Object.values(initialComponents).reduce((sum, item) => sum + (item?.price || 0), 0);

  // Run Compatibility Check
  const compatibilityReport = runCompatibilityCheck(initialComponents, prefs.budget);

  // Calculate Scores
  const scores = calculateScores(initialComponents, prefs, totalCost);

  // Budget Optimization Check
  const optimizationSuggestions = generateOptimizationSuggestions(initialComponents, totalCost, prefs.budget);

  // Generate plain English explanation
  const explanation = generateBuildExplanation(initialComponents, prefs, totalCost);

  const buildId = `build-${Date.now()}`;
  return {
    id: buildId,
    name: `${prefs.performanceTarget} ${prefs.purposes[0] || 'Custom'} Build`,
    createdAt: new Date().toISOString(),
    components: initialComponents,
    totalCost,
    targetBudget: prefs.budget,
    scores,
    compatibilityReport,
    optimizationSuggestions,
    explanation,
    userPreferences: prefs
  };
}

function calculateScores(
  components: PCBuild['components'],
  prefs: UserPreferences,
  totalCost: number
): BuildScores {
  const cpu = components.cpu;
  const gpu = components.gpu;
  const ram = components.ram;
  const storage = components.storage;
  const mobo = components.motherboard;

  // Performance Score (0 - 100)
  let perfBase = 0;
  if (cpu) perfBase += cpu.performanceScore * 0.35;
  if (gpu) {
    perfBase += gpu.performanceScore * 0.45;
  } else {
    // If office build without dGPU, don't penalize harshly
    perfBase += 70 * 0.45;
  }
  if (ram) perfBase += ram.performanceScore * 0.10;
  if (storage) perfBase += storage.performanceScore * 0.10;
  const performanceScore = Math.min(100, Math.round(perfBase));

  // Compatibility Score from engine
  const compReport = runCompatibilityCheck(components, prefs.budget);
  const compatibilityScore = compReport.score;

  // Value Score (Ratio of Performance to normalized cost)
  const budgetRatio = totalCost / (prefs.budget || totalCost);
  let valueScore = Math.round(performanceScore / Math.max(0.7, budgetRatio));
  if (totalCost <= prefs.budget) valueScore += 5;
  valueScore = Math.min(99, Math.max(60, valueScore));

  // Upgradeability Score
  let upgradeScore = 70;
  if (mobo) {
    if (mobo.socket === 'AM5') upgradeScore += 15; // AMD long socket promise
    if (mobo.ramSlots >= 4) upgradeScore += 5;
    if (mobo.m2Slots >= 3) upgradeScore += 5;
  }
  if (ram && ram.moduleCount === 1) upgradeScore += 5; // Empty slot
  if (components.psu && components.psu.wattage >= 750) upgradeScore += 5;
  upgradeScore = Math.min(100, upgradeScore);

  // Overall Score (Weighted combination)
  const overall = Math.round(
    compatibilityScore * 0.30 +
    performanceScore * 0.35 +
    valueScore * 0.20 +
    upgradeScore * 0.15
  );

  return {
    compatibility: compatibilityScore,
    performance: performanceScore,
    value: valueScore,
    upgradeability: upgradeScore,
    overall: Math.min(99, overall)
  };
}

function generateOptimizationSuggestions(
  components: PCBuild['components'],
  totalCost: number,
  targetBudget: number
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  const overBudget = totalCost > targetBudget;

  const gpu = components.gpu as GpuComponent | undefined;
  const mobo = components.motherboard as MotherboardComponent | undefined;
  const ram = components.ram as RamComponent | undefined;

  // Suggestion 1: GPU optimization if over budget
  if (gpu && gpu.model.includes('4070') && overBudget) {
    const altGpu = GPUS.find(g => g.model.includes('4060'));
    if (altGpu) {
      const diff = altGpu.price - gpu.price;
      suggestions.push({
        originalComponent: gpu,
        suggestedComponent: altGpu,
        costDifference: diff,
        performanceImpact: '-18%',
        reason: `Switching from ${gpu.model} to ${altGpu.model} saves ₹${Math.abs(diff).toLocaleString('en-IN')}, bringing your configuration back into budget while maintaining excellent 1080p and DLSS 1440p framerates.`
      });
    }
  } else if (gpu && gpu.model.includes('4060') && overBudget) {
    const altGpu = GPUS.find(g => g.model.includes('RX 7600'));
    if (altGpu) {
      const diff = altGpu.price - gpu.price;
      suggestions.push({
        originalComponent: gpu,
        suggestedComponent: altGpu,
        costDifference: diff,
        performanceImpact: '-4%',
        reason: `Switching to ${altGpu.model} saves ₹${Math.abs(diff).toLocaleString('en-IN')} with minimal difference in standard rasterized gaming.`
      });
    }
  }

  // Suggestion 2: Motherboard optimization
  if (mobo && mobo.model.includes('TOMAHAWK') && overBudget) {
    const altMobo = MOTHERBOARDS.find(m => m.socket === mobo.socket && m.model.includes('HDV'));
    if (altMobo) {
      const diff = altMobo.price - mobo.price;
      suggestions.push({
        originalComponent: mobo,
        suggestedComponent: altMobo,
        costDifference: diff,
        performanceImpact: '0%',
        reason: `Adopting the compact Micro-ATX ${altMobo.model} preserves identical CPU processing speed and PCIe 5.0 M.2 support while saving ₹${Math.abs(diff).toLocaleString('en-IN')}.`
      });
    }
  }

  // Suggestion 3: RAM step down if overkill
  if (ram && ram.capacity === 64 && overBudget) {
    const altRam = RAM_MODULES.find(r => r.generation === ram.generation && r.capacity === 32);
    if (altRam) {
      const diff = altRam.price - ram.price;
      suggestions.push({
        originalComponent: ram,
        suggestedComponent: altRam,
        costDifference: diff,
        performanceImpact: '0% in games (-5% in giant renders)',
        reason: `Stepping down from 64GB to 32GB saves ₹${Math.abs(diff).toLocaleString('en-IN')}, which remains optimal for gaming and modern productivity.`
      });
    }
  }

  return suggestions;
}

function generateBuildExplanation(
  components: PCBuild['components'],
  prefs: UserPreferences,
  totalCost: number
): string {
  const parts: string[] = [];
  const primaryPurpose = prefs.purposes[0] || 'General Computing';
  const cpu = components.cpu;
  const gpu = components.gpu;

  parts.push(`SpecCore engineered this configuration specifically targeting **${primaryPurpose}** at **${prefs.targetResolution}** within an envelope of ₹${totalCost.toLocaleString('en-IN')}.`);

  if (gpu) {
    parts.push(`The **${gpu.brand} ${gpu.model}** was prioritized with the largest budget allocation because ${primaryPurpose.toLowerCase().includes('game') ? `${prefs.targetResolution} gaming relies heavily on GPU rasterization and VRAM bandwidth` : 'it accelerates compute and graphical parallel pipelines'}.`);
  } else {
    parts.push(`No discrete GPU was included to avoid unnecessary expense, capitalizing on the processor's capable integrated graphics for office workloads.`);
  }

  if (cpu) {
    parts.push(`The **${cpu.brand} ${cpu.model}** was paired to prevent graphical bottlenecks while delivering responsive performance in selected software (${prefs.selectedSoftware.slice(0, 3).join(', ') || 'multitasking'}).`);
  }

  if (components.motherboard) {
    parts.push(`The **${components.motherboard.brand} ${components.motherboard.model}** provides an optimal VRM foundation, matching the ${components.motherboard.socket} socket and ${components.motherboard.ramType} architecture for straightforward future upgrades.`);
  }

  return parts.join(' ');
}
