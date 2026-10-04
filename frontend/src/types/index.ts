export type ComponentCategory =
  | 'CPU'
  | 'GPU'
  | 'Motherboard'
  | 'RAM'
  | 'Storage'
  | 'PSU'
  | 'Cabinet'
  | 'Cooler'
  | 'Monitor'
  | 'Case Fan'
  | 'Keyboard'
  | 'Mouse'
  | 'Wi-Fi Adapter'
  | 'Operating System';

export interface BaseComponent {
  id: number;
  category: ComponentCategory;
  brand: string;
  model: string;
  productName: string;
  price: number; // in INR
  rating: number; // 0 - 5.0
  reviewCount: number;
  imageUrl: string;
  description: string;
  powerRequirement: number; // in Watts (TDP or draw)
  availability: boolean;
  performanceScore: number; // 0 - 100 relative
  advantages: string[];
  disadvantages: string[];
  recommendedUseCases: string[];
}

export interface CpuComponent extends BaseComponent {
  category: 'CPU';
  socket: string; // e.g. 'AM5', 'LGA1700', 'AM4'
  cores: number;
  threads: number;
  baseClock: string;
  boostClock: string;
  cache: string;
  tdp: number;
  integratedGraphics: boolean;
  architecture: string;
}

export interface GpuComponent extends BaseComponent {
  category: 'GPU';
  vram: number; // in GB
  memoryType: string; // 'GDDR6', 'GDDR6X'
  memoryBus: string;
  boostClock: string;
  tdp: number;
  length: number; // in mm
  width: number; // in mm
  slotCount: number;
  recommendedPsu: number; // in Watts
}

export interface MotherboardComponent extends BaseComponent {
  category: 'Motherboard';
  socket: string; // 'AM5', 'LGA1700', 'AM4'
  chipset: string; // 'B650', 'Z790', 'B760', 'B550'
  formFactor: 'ATX' | 'Micro-ATX' | 'Mini-ITX';
  ramType: 'DDR4' | 'DDR5';
  maxRam: number; // in GB
  ramSlots: number;
  m2Slots: number;
  sataPorts: number;
  pcieSlots: number;
  wifi: boolean;
  bluetooth: boolean;
}

export interface RamComponent extends BaseComponent {
  category: 'RAM';
  capacity: number; // in GB (e.g. 16, 32, 64)
  generation: 'DDR4' | 'DDR5';
  speed: number; // in MHz (e.g. 3200, 6000)
  latency: string; // e.g. 'CL30', 'CL16'
  voltage: number;
  moduleCount: number; // e.g. 2 for 2x16GB
}

export interface StorageComponent extends BaseComponent {
  category: 'Storage';
  storageType: 'NVMe SSD' | 'SATA SSD' | 'HDD';
  capacity: string; // e.g. '1TB', '2TB'
  interfaceType: 'PCIe 4.0 x4' | 'PCIe 3.0 x4' | 'SATA III';
  readSpeed: number; // in MB/s
  writeSpeed: number; // in MB/s
  formFactor: 'M.2 2280' | '2.5 inch' | '3.5 inch';
}

export interface PsuComponent extends BaseComponent {
  category: 'PSU';
  wattage: number; // e.g. 650, 750, 850
  efficiencyRating: '80+ Bronze' | '80+ Gold' | '80+ Platinum';
  modular: 'Non-Modular' | 'Semi-Modular' | 'Full-Modular';
  connectorInfo: string;
}

export interface CabinetComponent extends BaseComponent {
  category: 'Cabinet';
  supportedFormFactors: ('ATX' | 'Micro-ATX' | 'Mini-ITX')[];
  gpuClearance: number; // in mm
  cpuCoolerClearance: number; // in mm
  radiatorSupport: string;
  dimensions: string; // e.g. "450 x 210 x 480 mm"
  weight: string;
}

export interface CoolerComponent extends BaseComponent {
  category: 'Cooler';
  supportedSockets: string[]; // ['AM5', 'AM4', 'LGA1700']
  coolerType: 'Air Cooler' | 'AIO Liquid 240mm' | 'AIO Liquid 360mm';
  fanSize: string;
  height: number; // in mm
  tdpCapacity: number; // in Watts
}

export interface MonitorComponent extends BaseComponent {
  category: 'Monitor';
  screenSize: string; // e.g. '27 inch'
  resolution: '1080p' | '1440p' | '4K';
  refreshRate: number; // in Hz
  responseTime: string; // e.g. '1ms'
  panelType: 'IPS' | 'VA' | 'OLED';
  adaptiveSync: 'G-Sync Compatible' | 'FreeSync Premium';
}

export type AnyComponent =
  | CpuComponent
  | GpuComponent
  | MotherboardComponent
  | RamComponent
  | StorageComponent
  | PsuComponent
  | CabinetComponent
  | CoolerComponent
  | MonitorComponent
  | BaseComponent;

export interface BuildIssue {
  issueType: 'SOCKET_MISMATCH' | 'RAM_GEN_MISMATCH' | 'RAM_SLOT_EXCEEDED' | 'COOLER_HEIGHT_EXCEEDED' | 'GPU_LENGTH_EXCEEDED' | 'COOLER_SOCKET_UNSUPPORTED' | 'FORM_FACTOR_UNSUPPORTED' | 'INSUFFICIENT_PSU' | 'BUDGET_OVERRUN' | 'STORAGE_INTERFACE_WARNING' | 'BOTTLENECK_WARNING';
  severity: 'ERROR' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  recommendation: string;
}

export interface CompatibilityReport {
  isCompatible: boolean;
  score: number; // 0 - 100
  totalSystemPower: number; // estimated Watts
  recommendedPsuWattage: number; // recommended Watts
  psuHeadroomStatus: 'HEALTHY' | 'TIGHT' | 'INSUFFICIENT';
  issues: BuildIssue[];
}

export interface BuildScores {
  compatibility: number; // 0 - 100
  performance: number; // 0 - 100
  value: number; // 0 - 100
  upgradeability: number; // 0 - 100
  overall: number; // 0 - 100
}

export interface OptimizationSuggestion {
  originalComponent: AnyComponent;
  suggestedComponent: AnyComponent;
  costDifference: number; // negative means savings
  performanceImpact: string; // e.g. "-7%"
  reason: string;
}

export interface UserPreferences {
  budget: number;
  purposes: string[]; // 'Gaming', 'Programming', 'Video Editing', '3D Rendering', 'AI / Machine Learning', 'Office / Productivity', etc.
  targetResolution: '1080p' | '1440p' | '4K';
  refreshRate: string; // '60Hz', '144Hz', '165Hz', '240Hz+'
  performanceTarget: 'Basic' | 'Entry Level' | 'Mid Range' | 'High Performance' | 'Enthusiast';
  selectedSoftware: string[];
  priorityPreference: 'Maximum Performance' | 'Best Value' | 'Balanced' | 'Future Upgradeability' | 'Low Power Consumption';
  preferredBrand?: string;
  includeMonitor: boolean;
}

export interface PCBuild {
  id: string;
  name: string;
  createdAt: string;
  components: {
    cpu?: CpuComponent;
    gpu?: GpuComponent;
    motherboard?: MotherboardComponent;
    ram?: RamComponent;
    storage?: StorageComponent;
    psu?: PsuComponent;
    cabinet?: CabinetComponent;
    cooler?: CoolerComponent;
    monitor?: MonitorComponent;
    [key: string]: AnyComponent | undefined;
  };
  totalCost: number;
  targetBudget: number;
  scores: BuildScores;
  compatibilityReport: CompatibilityReport;
  optimizationSuggestions: OptimizationSuggestion[];
  explanation: string;
  userPreferences: UserPreferences;
}
