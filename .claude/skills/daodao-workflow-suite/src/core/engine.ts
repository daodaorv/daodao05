import * as fs from 'fs-extra';
import * as path from 'path';
import { WorkflowState, ProgressInfo, RequirementAnalysis, WorkflowResult, DevelopmentResult, APIIntegration } from './types';
import { FileUtils, SystemUtils, GitUtils, Logger } from './utils';
import { RecoveryModule } from './recovery';
import { TechDocumentQuery } from '../tech-docs/query';

/**
 * 核心工作流引擎
 */
export class CoreWorkflowEngine {
  private recoveryModule: RecoveryModule;
  private techDocQuery: TechDocumentQuery;
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.recoveryModule = new RecoveryModule();
    this.techDocQuery = new TechDocumentQuery();
  }

  /**
   * 执行5步开发工作流
   */
  async execute5StepWorkflow(targetProject: string): Promise<WorkflowResult> {
    Logger.info(`开始执行 ${targetProject} 的5步开发工作流`);

    // 检查是否有未完成的任务
    const recoveryResult = await this.recoveryModule.recoverWorkflow();
    if (recoveryResult.hasCheckpoint && recoveryResult.canRecover) {
      Logger.info('检测到未完成的任务，准备恢复');
      return await this.resumeWorkflow(recoveryResult.checkpoint!);
    }

    const results = [];
    const steps = [
      this.step1_readProgress.bind(this),
      this.step2_analyzeRequirements.bind(this),
      this.step3_implementDevelopment.bind(this),
      this.step4_integrateAPIs.bind(this),
      this.step5_updateProgress.bind(this)
    ];

    for (let i = 0; i < steps.length; i++) {
      try {
        Logger.info(`执行步骤 ${i + 1}: ${this.getStepName(i + 1)}`);
        const result = await steps[i](targetProject);
        results.push(result);

        // 自动保存检查点
        await this.saveCheckpoint(i + 1, result, targetProject);
        Logger.info(`步骤 ${i + 1} 完成`);

      } catch (error) {
        Logger.error(`步骤 ${i + 1} 执行失败:`, error);
        return await this.handleStepError(i + 1, error as Error, results, targetProject);
      }
    }

    Logger.info('工作流执行完成');
    return { success: true, results };
  }

  /**
   * 恢复工作流
   */
  private async resumeWorkflow(checkpoint: any): Promise<WorkflowResult> {
    Logger.info(`从检查点恢复工作流: ${checkpoint.id}`);

    const targetProject = checkpoint.state.developmentContext.targetProject;
    const currentPhase = checkpoint.state.currentTask.phase;

    // 从断点继续执行
    const remainingSteps = [
      this.step1_readProgress.bind(this),
      this.step2_analyzeRequirements.bind(this),
      this.step3_implementDevelopment.bind(this),
      this.step4_integrateAPIs.bind(this),
      this.step5_updateProgress.bind(this)
    ].slice(currentPhase);

    const results = checkpoint.state.results || [];

    for (let i = 0; i < remainingSteps.length; i++) {
      try {
        const stepNumber = currentPhase + i + 1;
        Logger.info(`恢复执行步骤 ${stepNumber}: ${this.getStepName(stepNumber)}`);
        const result = await remainingSteps[i](targetProject);
        results.push(result);
        await this.saveCheckpoint(stepNumber, result, targetProject);
      } catch (error) {
        Logger.error(`恢复步骤执行失败:`, error);
        return await this.handleStepError(currentPhase + i + 1, error as Error, results, targetProject);
      }
    }

    return { success: true, results };
  }

  /**
   * 步骤1: 阅读实施计划
   */
  private async step1_readProgress(targetProject: string): Promise<ProgressInfo> {
    const planPath = path.join(this.projectRoot, targetProject, 'docs', '实施计划.md');

    if (!await FileUtils.exists(planPath)) {
      throw new Error(`实施计划文件不存在: ${planPath}`);
    }

    const planContent = await FileUtils.readFile(planPath);

    return {
      currentPhase: this.extractCurrentPhase(planContent),
      completedTasks: this.extractCompletedTasks(planContent),
      nextTask: this.extractNextTask(planContent),
      progressPercentage: this.calculateProgress(planContent)
    };
  }

  /**
   * 步骤2: 分析需求文档
   */
  private async step2_analyzeRequirements(targetProject: string): Promise<RequirementAnalysis> {
    const reqDocPath = path.join(this.projectRoot, targetProject, 'docs', '产品需求文档.md');
    const techDocPath = path.join(this.projectRoot, targetProject, 'docs', '技术栈文档.md');

    const [requirements, techStack] = await Promise.all([
      FileUtils.readFile(reqDocPath),
      FileUtils.readFile(techDocPath)
    ]);

    return {
      features: this.parseFeatures(requirements),
      techRequirements: this.parseTechRequirements(techStack),
      uiGuidelines: this.parseUIGuidelines(requirements),
      clarifications: this.generateClarifications(requirements, techStack)
    };
  }

  /**
   * 步骤3: 实施开发
   */
  private async step3_implementDevelopment(targetProject: string, analysis?: RequirementAnalysis): Promise<DevelopmentResult> {
    // 根据项目类型获取对应的工作流实例
    const workflow = this.getWorkflow(targetProject);
    return await workflow.develop(analysis);
  }

  /**
   * 步骤4: API集成
   */
  private async step4_integrateAPIs(targetProject: string): Promise<APIIntegration> {
    const apiDocPath = path.join(this.projectRoot, targetProject, 'docs', 'API文档.md');

    if (!await FileUtils.exists(apiDocPath)) {
      return {
        integrationStatus: {},
        pendingAPIs: [],
        readyForTesting: [],
        mockAPIs: [],
        realAPIs: [],
        totalAPIs: 0,
        completedAPIs: 0
      };
    }

    const apiDoc = await FileUtils.readFile(apiDocPath);

    // 解析API文档，提取所有API信息
    const allAPIs = this.parseAPIDocument(apiDoc);
    const mockAPIs = allAPIs.filter(api => api.useMock);
    const realAPIs = allAPIs.filter(api => !api.useMock && api.status === 'completed');
    const pendingAPIs = allAPIs.filter(api => api.status === 'pending');
    const readyForTesting = allAPIs.filter(api => api.status === 'completed');

    // 更新API文档状态
    const updatedDoc = await this.updateAPIDocumentStatus(apiDoc, allAPIs);
    await FileUtils.writeFile(apiDocPath, updatedDoc);

    return {
      integrationStatus: await this.checkAPIIntegration(apiDoc),
      pendingAPIs,
      readyForTesting,
      mockAPIs,
      realAPIs,
      totalAPIs: allAPIs.length,
      completedAPIs: readyForTesting.length
    };
  }

  /**
   * 步骤5: 更新进度
   */
  private async step5_updateProgress(targetProject: string): Promise<{ updated: boolean; nextTask: string; completedTasks: string[]; progressPercentage: number }> {
    const planPath = path.join(this.projectRoot, targetProject, 'docs', '实施计划.md');
    const planContent = await FileUtils.readFile(planPath);

    // 更新进度标记（将 [ ] 更新为 [x]）
    const updatedContent = this.updateProgressMarkers(planContent);

    // 添加更新时间戳
    const timestamp = new Date().toISOString().split('T')[0];
    const finalContent = updatedContent + `\n\n<!-- 自动更新: ${timestamp} - 工作流执行完成 -->`;

    await FileUtils.writeFile(planPath, finalContent);

    // 计算更新后的进度
    const completedTasks = this.extractCompletedTasks(finalContent);
    const progressPercentage = this.calculateProgress(finalContent);

    return {
      updated: true,
      nextTask: this.extractNextTask(finalContent),
      completedTasks,
      progressPercentage
    };
  }

  /**
   * 保存检查点
   */
  private async saveCheckpoint(phase: number, result: any, targetProject: string): Promise<void> {
    const state: Partial<WorkflowState> = {
      currentTask: {
        phase,
        step: phase,
        taskDescription: this.getStepName(phase),
        startTime: new Date()
      },
      developmentContext: {
        targetProject,
        currentFiles: [],
        modifiedFiles: await GitUtils.getModifiedFiles(path.join(this.projectRoot, targetProject)),
        pendingTasks: []
      },
      environmentState: {
        nodeVersion: await SystemUtils.getNodeVersion(),
        dependencies: await this.getProjectDependencies(targetProject),
        gitBranch: await GitUtils.getCurrentBranch(path.join(this.projectRoot, targetProject)),
        gitStatus: await GitUtils.getGitStatus(path.join(this.projectRoot, targetProject))
      },
      errorHistory: []
    };

    await this.recoveryModule.saveCheckpoint(state as WorkflowState);
  }

  /**
   * 处理步骤错误
   */
  private async handleStepError(step: number, error: Error, results: any[], targetProject: string): Promise<WorkflowResult> {
    Logger.error(`步骤 ${step} 执行失败:`, error.message);

    // 尝试错误恢复
    const recoveryAction = await this.recoveryModule.handleInterruption({
      type: 'COMPILATION_ERROR',
      message: error.message,
      details: error.stack
    });

    if (recoveryAction.action === 'SAVE_AND_PAUSE') {
      await this.saveCheckpoint(step, { error: error.message }, targetProject);
    }

    return {
      success: false,
      results,
      error: `步骤 ${step} 失败: ${error.message}`
    };
  }

  /**
   * 获取项目依赖
   */
  private async getProjectDependencies(targetProject: string): Promise<Record<string, string>> {
    const packageJsonPath = path.join(this.projectRoot, targetProject, 'package.json');
    if (await FileUtils.exists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      return {
        ...packageJson.dependencies || {},
        ...packageJson.devDependencies || {}
      };
    }
    return {};
  }

  // 工具方法
  private getStepName(step: number): string {
    const stepNames = ['读取实施计划', '分析需求文档', '实施开发', 'API集成', '更新进度'];
    return stepNames[step - 1] || `步骤${step}`;
  }

  private getWorkflow(targetProject: string): any {
    // 这里会根据项目类型返回对应的工作流实例
    // 暂时返回一个基础实例
    return {
      async develop(analysis?: RequirementAnalysis): Promise<DevelopmentResult> {
        return {
          success: true,
          filesCreated: [],
          filesModified: [],
          codeGenerated: '// 开发代码占位符',
          mockData: {},
          testResults: []
        };
      }
    };
  }

  // 以下方法需要根据实际文档格式实现
  private extractCurrentPhase(planContent: string): string {
    const match = planContent.match(/当前阶段[:：]\s*(.+)/i);
    return match ? match[1].trim() : 'unknown';
  }

  private extractCompletedTasks(planContent: string): string[] {
    const lines = planContent.split('\n');
    return lines.filter(line => line.includes('✅')).map(line => line.trim());
  }

  private extractNextTask(planContent: string): string {
    const match = planContent.match(/下一步[:：]\s*(.+)/i);
    return match ? match[1].trim() : '无明确任务';
  }

  private calculateProgress(planContent: string): number {
    const totalTasks = (planContent.match(/- \[ \]/g) || []).length;
    const completedTasks = (planContent.match(/- \[x\]/g) || []).length;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }

  private parseFeatures(requirements: string): any[] {
    // 解析功能需求的实现
    return [];
  }

  private parseTechRequirements(techStack: string): any[] {
    // 解析技术栈需求的实现
    return [];
  }

  private parseUIGuidelines(requirements: string): any[] {
    // 解析UI指导原则的实现
    return [];
  }

  private generateClarifications(requirements: string, techStack: string): string[] {
    // 生成需要澄清的问题列表
    return [];
  }

  private async checkAPIIntegration(apiDoc: string): Promise<Record<string, any>> {
    // 检查API集成状态的实现
    return {};
  }

  private extractPendingAPIs(apiDoc: string): any[] {
    // 提取待开发API的实现
    return [];
  }

  private identifyReadyAPIs(apiDoc: string): any[] {
    // 识别可测试API的实现
    return [];
  }

  private updateProgressMarkers(planContent: string): string {
    // 找到最近未完成的任务并标记为完成
    // 匹配模式: - [ ] 任务描述
    const lines = planContent.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      // 找到第一个未完成的任务
      if (!updated && lines[i].match(/^(\s*)-\s*\[\s*\]\s+/)) {
        lines[i] = lines[i].replace(/\[\s*\]/, '[x]');
        updated = true;
      }
    }

    return lines.join('\n');
  }

  /**
   * 解析API文档，提取所有API信息
   */
  private parseAPIDocument(apiDoc: string): APIInfo[] {
    const apis: APIInfo[] = [];
    const lines = apiDoc.split('\n');

    let currentAPI: Partial<APIInfo> = {};

    for (const line of lines) {
      // 匹配API接口定义: **接口**: `POST /api/v1/admin/xxx`
      const apiMatch = line.match(/\*\*接口\*\*:\s*`(GET|POST|PUT|DELETE|PATCH)\s+([^`]+)`/);
      if (apiMatch) {
        if (currentAPI.endpoint) {
          apis.push(currentAPI as APIInfo);
        }
        currentAPI = {
          method: apiMatch[1],
          endpoint: apiMatch[2],
          description: '',
          status: 'pending',
          useMock: true
        };
      }

      // 匹配状态: **状态**: 待开发 | 开发中 | 已完成
      const statusMatch = line.match(/\*\*状态\*\*:\s*(待开发|开发中|已完成|✅)/);
      if (statusMatch && currentAPI.endpoint) {
        if (statusMatch[1] === '已完成' || statusMatch[1] === '✅') {
          currentAPI.status = 'completed';
        } else if (statusMatch[1] === '开发中') {
          currentAPI.status = 'in-progress';
        } else {
          currentAPI.status = 'pending';
        }
      }

      // 匹配描述
      const descMatch = line.match(/\*\*描述\*\*:\s*(.+)/);
      if (descMatch && currentAPI.endpoint) {
        currentAPI.description = descMatch[1];
      }
    }

    // 添加最后一个API
    if (currentAPI.endpoint) {
      apis.push(currentAPI as APIInfo);
    }

    return apis;
  }

  /**
   * 更新API文档状态
   */
  private async updateAPIDocumentStatus(apiDoc: string, apis: APIInfo[]): Promise<string> {
    let updatedDoc = apiDoc;

    // 为每个已完成的API更新状态标记
    for (const api of apis) {
      if (api.status === 'completed') {
        // 将 **状态**: 待开发 替换为 **状态**: ✅ 已完成
        const pattern = new RegExp(
          `(${api.method}\\s+${api.endpoint.replace(/\//g, '\\/')}[\\s\\S]*?\\*\\*状态\\*\\*:)\\s*待开发`,
          'g'
        );
        updatedDoc = updatedDoc.replace(pattern, '$1 ✅ 已完成');
      }
    }

    return updatedDoc;
  }
}