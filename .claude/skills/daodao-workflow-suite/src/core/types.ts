/**
 * 工作流状态接口定义
 */
export interface WorkflowState {
  // 当前任务信息
  currentTask: {
    phase: number;           // 当前阶段 (1-5)
    step: number;            // 当前步骤
    taskDescription: string; // 任务描述
    startTime: Date;         // 开始时间
  };

  // 开发上下文
  developmentContext: {
    targetProject: string;   // 目标项目 (admin/miniprogram/mobile)
    currentFiles: string[];  // 正在处理的文件
    modifiedFiles: string[]; // 已修改的文件
    pendingTasks: string[];  // 待完成任务
  };

  // 环境状态
  environmentState: {
    nodeVersion: string;     // Node版本
    dependencies: Record<string, string>; // 依赖版本
    gitBranch: string;       // Git分支
    gitStatus: string;       // Git状态
  };

  // 错误和修复记录
  errorHistory: {
    error: string;
    fix: string;
    timestamp: Date;
  }[];
}

/**
 * 进度信息接口
 */
export interface ProgressInfo {
  currentPhase: string;
  completedTasks: string[];
  nextTask: string;
  progressPercentage: number;
}

/**
 * 需求分析结果接口
 */
export interface RequirementAnalysis {
  features: FeatureInfo[];
  techRequirements: TechRequirement[];
  uiGuidelines: UIGuideline[];
  clarifications: string[];
}

export interface FeatureInfo {
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
}

export interface TechRequirement {
  framework: string;
  version: string;
  components: string[];
  configurations: Record<string, any>;
}

export interface UIGuideline {
  component: string;
  guidelines: string[];
  examples: string[];
}

/**
 * 开发结果接口
 */
export interface DevelopmentResult {
  success: boolean;
  filesCreated: string[];
  filesModified: string[];
  codeGenerated: string;
  mockData: any;
  testResults: TestResult[];
}

export interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  duration: number;
}

/**
 * API集成结果接口
 */
export interface APIIntegration {
  integrationStatus: Record<string, 'completed' | 'in-progress' | 'pending'>;
  pendingAPIs: APIInfo[];
  readyForTesting: APIInfo[];
  mockAPIs: APIInfo[];
  realAPIs: APIInfo[];
  totalAPIs: number;
  completedAPIs: number;
}

export interface APIInfo {
  endpoint: string;
  method: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  useMock: boolean;
}

/**
 * Mock数据生成结果接口
 */
export interface MockDataResult {
  mockFilesCreated: string[];
  mockDataCount: number;
  mockServiceConfigured: boolean;
  mockSwitchEnabled: boolean;
}

/**
 * 工作流结果接口
 */
export interface WorkflowResult {
  success: boolean;
  results: any[];
  error?: string;
}

/**
 * 错误处理接口
 */
export interface WorkflowError {
  type: 'NETWORK_ERROR' | 'COMPILATION_ERROR' | 'DEPENDENCY_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  details?: any;
}

/**
 * 恢复相关接口
 */
export interface Checkpoint {
  id: string;
  timestamp: Date;
  state: WorkflowState;
  environment: EnvironmentSnapshot;
  gitStatus: string;
}

export interface EnvironmentSnapshot {
  nodeVersion: string;
  platform: string;
  dependencies: Record<string, string>;
  envVars: Record<string, string>;
}

export interface RecoveryResult {
  hasCheckpoint: boolean;
  checkpoint?: Checkpoint;
  canRecover?: boolean;
  integrityIssues?: string[];
  recommendations?: string[];
}

export interface IntegrityResult {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}

export interface RecoveryAction {
  action: 'SWITCH_TO_OFFLINE' | 'PAUSE_AND_SUGGEST_FIX' | 'RESOLVE_DEPENDENCIES' | 'SAVE_AND_PAUSE';
  message: string;
  offlineCapabilities?: string[];
  suggestions?: string[];
  commands?: string[];
}