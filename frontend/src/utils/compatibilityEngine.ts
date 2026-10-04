import {
  PCBuild,
  CompatibilityReport,
  BuildIssue,
  CpuComponent,
  GpuComponent,
  MotherboardComponent,
  RamComponent,
  StorageComponent,
  PsuComponent,
  CabinetComponent,
  CoolerComponent
} from '../types';

export function runCompatibilityCheck(
  components: PCBuild['components'],
  budget?: number
): CompatibilityReport {
  const issues: BuildIssue[] = [];
  let deduction = 0;

  const cpu = components.cpu as CpuComponent | undefined;
  const gpu = components.gpu as GpuComponent | undefined;
  const mobo = components.motherboard as MotherboardComponent | undefined;
  const ram = components.ram as RamComponent | undefined;
  const storage = components.storage as StorageComponent | undefined;
  const psu = components.psu as PsuComponent | undefined;
  const cabinet = components.cabinet as CabinetComponent | undefined;
  const cooler = components.cooler as CoolerComponent | undefined;

  // 1. CPU <-> Motherboard Socket Check
  if (cpu && mobo) {
    if (cpu.socket !== mobo.socket) {
      issues.push({
        issueType: 'SOCKET_MISMATCH',
        severity: 'ERROR',
        title: 'CPU & Motherboard Socket Incompatibility',
        message: `CPU uses socket ${cpu.socket} but motherboard has socket ${mobo.socket}. They cannot physically connect.`,
        recommendation: `Choose a motherboard with socket ${cpu.socket} or change your CPU.`
      });
      deduction += 35;
    }
  }

  // 2. RAM <-> Motherboard Generation & Slots Check
  if (ram && mobo) {
    if (ram.generation !== mobo.ramType) {
      issues.push({
        issueType: 'RAM_GEN_MISMATCH',
        severity: 'ERROR',
        title: 'RAM Generation Mismatch',
        message: `Motherboard requires ${mobo.ramType} memory, but selected RAM is ${ram.generation}. RAM slots are keyed differently.`,
        recommendation: `Switch to a ${mobo.ramType} RAM kit or select a ${ram.generation} compatible motherboard.`
      });
      deduction += 30;
    }

    if (ram.moduleCount > mobo.ramSlots) {
      issues.push({
        issueType: 'RAM_SLOT_EXCEEDED',
        severity: 'ERROR',
        title: 'RAM Slots Exceeded',
        message: `RAM kit has ${ram.moduleCount} modules, but motherboard only features ${mobo.ramSlots} slot(s).`,
        recommendation: `Choose a RAM kit with ${mobo.ramSlots} or fewer modules.`
      });
      deduction += 20;
    }

    if (ram.capacity > mobo.maxRam) {
      issues.push({
        issueType: 'RAM_SLOT_EXCEEDED',
        severity: 'WARNING',
        title: 'RAM Capacity Exceeds Motherboard Maximum',
        message: `RAM capacity (${ram.capacity}GB) exceeds motherboard's max rated capacity of ${mobo.maxRam}GB.`,
        recommendation: `Verify motherboard memory support list.`
      });
      deduction += 10;
    }
  }

  // 3. GPU <-> Cabinet Length Clearance Check
  if (gpu && cabinet) {
    if (gpu.length > cabinet.gpuClearance) {
      issues.push({
        issueType: 'GPU_LENGTH_EXCEEDED',
        severity: 'ERROR',
        title: 'GPU Length Exceeds Case Clearance',
        message: `GPU length is ${gpu.length}mm, but cabinet only accommodates up to ${cabinet.gpuClearance}mm. The graphics card will hit the front fans or chassis.`,
        recommendation: `Select a larger cabinet with at least ${gpu.length + 15}mm clearance or pick a more compact dual-fan GPU.`
      });
      deduction += 25;
    } else if (cabinet.gpuClearance - gpu.length < 15) {
      issues.push({
        issueType: 'GPU_LENGTH_EXCEEDED',
        severity: 'WARNING',
        title: 'Tight GPU Clearance',
        message: `GPU has only ${cabinet.gpuClearance - gpu.length}mm of clearance remaining in the case. Installation might be tricky with front radiators.`,
        recommendation: `Double check front radiator and fan mounting thickness.`
      });
      deduction += 5;
    }
  }

  // 4. CPU Cooler <-> CPU Socket Check
  if (cooler && cpu) {
    if (!cooler.supportedSockets.includes(cpu.socket)) {
      issues.push({
        issueType: 'COOLER_SOCKET_UNSUPPORTED',
        severity: 'ERROR',
        title: 'Cooler Mounting Bracket Incompatible',
        message: `Cooler does not support socket ${cpu.socket}. Mounting brackets will not align with motherboard mounting holes.`,
        recommendation: `Pick a cooler that natively supports ${cpu.socket} mounting.`
      });
      deduction += 25;
    }

    if (cooler.coolerType === 'Air Cooler' && cpu.tdp > cooler.tdpCapacity) {
      issues.push({
        issueType: 'BOTTLENECK_WARNING',
        severity: 'WARNING',
        title: 'Cooler TDP Capacity Below CPU Maximum',
        message: `CPU TDP is ${cpu.tdp}W, but cooler is rated for ${cooler.tdpCapacity}W. CPU may thermal throttle under sustained workloads.`,
        recommendation: `Upgrade to a 240mm/360mm AIO liquid cooler or dual-tower air cooler.`
      });
      deduction += 10;
    }
  }

  // 5. Cooler <-> Cabinet Height Clearance Check
  if (cooler && cabinet && cooler.coolerType === 'Air Cooler') {
    if (cooler.height > cabinet.cpuCoolerClearance) {
      issues.push({
        issueType: 'COOLER_HEIGHT_EXCEEDED',
        severity: 'ERROR',
        title: 'Cooler Height Exceeds Case Clearance',
        message: `Air cooler is ${cooler.height}mm tall, but cabinet only permits coolers up to ${cabinet.cpuCoolerClearance}mm. Side glass panel will not close.`,
        recommendation: `Select a low-profile cooler or a wider cabinet.`
      });
      deduction += 25;
    }
  }

  // 6. Motherboard <-> Cabinet Form Factor Check
  if (mobo && cabinet) {
    if (!cabinet.supportedFormFactors.includes(mobo.formFactor)) {
      issues.push({
        issueType: 'FORM_FACTOR_UNSUPPORTED',
        severity: 'ERROR',
        title: 'Motherboard Form Factor Unsupported by Case',
        message: `Motherboard is ${mobo.formFactor}, but cabinet only supports ${cabinet.supportedFormFactors.join(', ')}. Standoffs will not fit.`,
        recommendation: `Choose an ATX-compatible cabinet or a ${cabinet.supportedFormFactors[0]} motherboard.`
      });
      deduction += 25;
    }
  }

  // 7. Power Calculation & PSU Headroom Check
  let estimatedPower = 65; // baseline motherboard + fans + chipset + SSD
  if (cpu) estimatedPower += cpu.tdp;
  if (gpu) estimatedPower += gpu.tdp;
  if (cooler && cooler.coolerType.includes('AIO')) estimatedPower += 15;

  const recommendedPsu = Math.ceil((estimatedPower * 1.35) / 50) * 50; // 35% safety headroom rounded to 50W

  let psuHeadroomStatus: 'HEALTHY' | 'TIGHT' | 'INSUFFICIENT' = 'HEALTHY';

  if (psu) {
    if (psu.wattage < estimatedPower) {
      psuHeadroomStatus = 'INSUFFICIENT';
      issues.push({
        issueType: 'INSUFFICIENT_PSU',
        severity: 'ERROR',
        title: 'Insufficient Power Supply Wattage',
        message: `Estimated system draw is ~${estimatedPower}W, but selected PSU is only ${psu.wattage}W. The system will crash or shut down under gaming/rendering load.`,
        recommendation: `Upgrade to at least a ${recommendedPsu}W power supply.`
      });
      deduction += 35;
    } else if (psu.wattage < recommendedPsu) {
      psuHeadroomStatus = 'TIGHT';
      issues.push({
        issueType: 'INSUFFICIENT_PSU',
        severity: 'WARNING',
        title: 'Tight Power Supply Headroom',
        message: `System draws ~${estimatedPower}W. The ${psu.wattage}W PSU works, but leaves under 25% safety margin for transient power spikes.`,
        recommendation: `A ${recommendedPsu}W 80+ Gold PSU is recommended for optimal efficiency and transient spike protection.`
      });
      deduction += 8;
    }
  }

  // 8. Storage M.2 Slot Check
  if (storage && mobo) {
    if (storage.storageType === 'NVMe SSD' && mobo.m2Slots < 1) {
      issues.push({
        issueType: 'STORAGE_INTERFACE_WARNING',
        severity: 'ERROR',
        title: 'No M.2 Slot on Motherboard',
        message: `Selected M.2 NVMe SSD cannot be mounted because motherboard lacks an M.2 slot.`,
        recommendation: `Select a modern motherboard with PCIe M.2 slots.`
      });
      deduction += 20;
    }
  }

  // 9. Budget Overrun check
  if (budget) {
    const totalCost = Object.values(components).reduce((sum, item) => sum + (item?.price || 0), 0);
    if (totalCost > budget) {
      const overBy = totalCost - budget;
      issues.push({
        issueType: 'BUDGET_OVERRUN',
        severity: 'WARNING',
        title: 'Build Exceeds Target Budget',
        message: `Total cost of ₹${totalCost.toLocaleString('en-IN')} exceeds your budget of ₹${budget.toLocaleString('en-IN')} by ₹${overBy.toLocaleString('en-IN')}.`,
        recommendation: `Check the Budget Optimization suggestions below to save money without sacrificing core performance.`
      });
    }
  }

  const hasErrors = issues.some(i => i.severity === 'ERROR');
  const finalScore = Math.max(0, Math.min(100, 100 - deduction));

  return {
    isCompatible: !hasErrors,
    score: hasErrors ? Math.min(finalScore, 50) : finalScore,
    totalSystemPower: estimatedPower,
    recommendedPsuWattage: recommendedPsu,
    psuHeadroomStatus,
    issues
  };
}
