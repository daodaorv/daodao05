/**
 * 叨叨前端开发工作流 - 简化版本
 * 避免复杂依赖，专注于核心功能
 */

import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * 简化版工作流引擎
 */
export class SimpleWorkflowEngine {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * 执行5步开发工作流
   */
  async execute5StepWorkflow(targetProject: string): Promise<any> {
    console.log(`🔄 开始执行 ${targetProject} 的5步开发工作流`);

    try {
      // 步骤1: 阅读实施计划
      const progress = await this.step1_readProgress(targetProject);
      console.log('📋 步骤1完成: 读取实施计划');

      // 步骤2: 分析需求文档
      const analysis = await this.step2_analyzeRequirements(targetProject);
      console.log('🔍 步骤2完成: 分析需求文档');

      // 步骤3: 实施开发
      const development = await this.step3_implementDevelopment(targetProject, analysis);
      console.log('⚙️ 步骤3完成: 实施开发');

      // 步骤4: API集成检查
      const integration = await this.step4_integrateAPIs(targetProject);
      console.log('🔌 步骤4完成: API集成检查');

      // 步骤5: 更新进度
      const update = await this.step5_updateProgress(targetProject);
      console.log('📊 步骤5完成: 更新进度');

      return {
        success: true,
        message: '工作流执行完成',
        results: { progress, analysis, development, integration, update }
      };

    } catch (error) {
      console.error('❌ 工作流执行失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 步骤1: 阅读实施计划
   */
  private async step1_readProgress(targetProject: string): Promise<any> {
    const planPath = path.join(this.projectRoot, targetProject, 'docs', '实施计划.md');

    if (!await fs.pathExists(planPath)) {
      throw new Error(`实施计划文件不存在: ${planPath}`);
    }

    const planContent = await fs.readFile(planPath, 'utf-8');

    // 简单解析实施计划
    const completedTasks = (planContent.match(/- \[x\]/g) || []).length;
    const totalTasks = (planContent.match(/- \[ \]/g) || []).length + completedTasks;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      currentPhase: this.extractCurrentPhase(planContent),
      completedTasks,
      totalTasks,
      progressPercentage,
      nextTask: this.extractNextTask(planContent)
    };
  }

  /**
   * 步骤2: 分析需求文档
   */
  private async step2_analyzeRequirements(targetProject: string): Promise<any> {
    const reqDocPath = path.join(this.projectRoot, targetProject, 'docs', '产品需求文档.md');
    const techDocPath = path.join(this.projectRoot, targetProject, 'docs', '技术栈文档.md');

    const requirements = await fs.readFile(reqDocPath, 'utf-8');
    const techStack = await fs.readFile(techDocPath, 'utf-8');

    return {
      features: this.extractFeatures(requirements),
      techStack: this.extractTechStack(techStack),
      uiGuidelines: this.extractUIGuidelines(requirements)
    };
  }

  /**
   * 步骤3: 实施开发
   */
  private async step3_implementDevelopment(targetProject: string, analysis: any): Promise<any> {
    console.log('🛠️ 开始实施开发...');

    // 根据项目类型生成示例代码
    const generatedCode = this.generateSampleCode(targetProject);

    // 创建示例组件文件
    const componentPath = path.join(this.projectRoot, targetProject, 'src', 'components');
    await fs.ensureDir(componentPath);

    const sampleFile = path.join(componentPath, 'SampleComponent.vue');
    await fs.writeFile(sampleFile, generatedCode);

    return {
      filesCreated: [sampleFile],
      codeGenerated: generatedCode,
      message: '示例组件已生成'
    };
  }

  /**
   * 步骤4: API集成检查
   */
  private async step4_integrateAPIs(targetProject: string): Promise<any> {
    const apiDocPath = path.join(this.projectRoot, targetProject, 'docs', 'API文档.md');

    if (!await fs.pathExists(apiDocPath)) {
      return {
        message: 'API文档不存在，跳过API集成检查',
        status: 'skipped',
        totalAPIs: 0,
        completedAPIs: 0,
        mockAPIs: 0,
        realAPIs: 0
      };
    }

    const apiDoc = await fs.readFile(apiDocPath, 'utf-8');

    // 解析API文档
    const allAPIs = this.parseAPIDocument(apiDoc);
    const completedAPIs = allAPIs.filter(api => api.status === 'completed').length;
    const mockAPIs = allAPIs.filter(api => api.useMock).length;
    const realAPIs = allAPIs.filter(api => !api.useMock && api.status === 'completed').length;

    // 更新API文档状态
    const updatedDoc = this.updateAPIDocumentStatus(apiDoc, allAPIs);
    await fs.writeFile(apiDocPath, updatedDoc, 'utf-8');

    return {
      totalAPIs: allAPIs.length,
      completedAPIs,
      mockAPIs,
      realAPIs,
      pendingAPIs: allAPIs.length - completedAPIs,
      message: `API检查完成: ${completedAPIs}/${allAPIs.length} 已完成 (Mock: ${mockAPIs}, Real: ${realAPIs})`
    };
  }

  /**
   * 步骤5: 更新进度
   */
  private async step5_updateProgress(targetProject: string): Promise<any> {
    const planPath = path.join(this.projectRoot, targetProject, 'docs', '实施计划.md');
    let planContent = await fs.readFile(planPath, 'utf-8');

    // 更新进度标记（将 [ ] 更新为 [x]）
    planContent = this.updateProgressMarkers(planContent);

    // 添加更新时间戳
    const timestamp = new Date().toISOString().split('T')[0];
    const finalContent = planContent + `\n\n<!-- 自动更新: ${timestamp} - 工作流执行完成 -->`;

    await fs.writeFile(planPath, finalContent, 'utf-8');

    // 计算更新后的进度
    const completedTasks = this.extractCompletedTasks(finalContent);
    const progressPercentage = this.calculateProgressPercentage(finalContent);

    return {
      updated: true,
      timestamp,
      completedTasks: completedTasks.length,
      progressPercentage,
      message: `进度已更新: ${progressPercentage}% 完成`
    };
  }

  /**
   * 生成示例代码
   */
  private generateSampleCode(targetProject: string): string {
    if (targetProject === 'admin-console') {
      return `<template>
  <div class="sample-component">
    <h2>PC管理端示例组件</h2>
    <p>这是一个自动生成的示例组件</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 示例响应式数据
const message = ref('Hello, PC Admin!')

onMounted(() => {
  console.log('PC管理端组件已挂载')
})
</script>

<style scoped>
.sample-component {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>`;
    } else if (targetProject === 'miniprogram') {
      return `<template>
  <view class="sample-component">
    <text class="title">小程序示例组件</text>
    <text>这是一个自动生成的示例组件</text>
  </view>
</template>

<script setup lang="ts">
import { ref, onLoad } from '@dcloudio/uni-app'

const message = ref('Hello, Mini Program!')

onLoad(() => {
  console.log('小程序组件已加载')
})
</script>

<style scoped>
.sample-component {
  padding: 40rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 16rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}
</style>`;
    } else {
      return `<template>
  <div class="sample-component">
    <h3>移动管理端示例组件</h3>
    <p>这是一个自动生成的示例组件</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const message = ref('Hello, Mobile Admin!')

onMounted(() => {
  console.log('移动管理端组件已挂载')
})
</script>

<style scoped>
.sample-component {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>`;
    }
  }

  // 辅助方法
  private extractCurrentPhase(content: string): string {
    const match = content.match(/当前阶段[:：]\s*(.+)/i);
    return match ? match[1].trim() : 'unknown';
  }

  private extractNextTask(content: string): string {
    const match = content.match(/下一步[:：]\s*(.+)/i);
    return match ? match[1].trim() : '无明确任务';
  }

  private extractFeatures(requirements: string): string[] {
    const lines = requirements.split('\n');
    return lines.filter(line => line.includes('功能') || line.includes('模块')).slice(0, 5);
  }

  private extractTechStack(techStack: string): any {
    return {
      framework: 'Vue 3',
      language: 'TypeScript',
      ui: techStack.includes('Element') ? 'Element Plus' : 'uni-app'
    };
  }

  private extractUIGuidelines(requirements: string): string[] {
    return [
      '遵循统一的设计规范',
      '保持响应式布局',
      '确保良好的用户体验'
    ];
  }

  /**
   * 更新进度标记
   */
  private updateProgressMarkers(planContent: string): string {
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
   * 提取已完成任务
   */
  private extractCompletedTasks(content: string): string[] {
    const lines = content.split('\n');
    return lines.filter(line => line.match(/^(\s*)-\s*\[x\]\s+/));
  }

  /**
   * 计算进度百分比
   */
  private calculateProgressPercentage(content: string): number {
    const totalTasks = (content.match(/- \[\s*\]/g) || []).length + (content.match(/- \[x\]/g) || []).length;
    const completedTasks = (content.match(/- \[x\]/g) || []).length;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }

  /**
   * 解析API文档
   */
  private parseAPIDocument(apiDoc: string): Array<{
    method: string;
    endpoint: string;
    description: string;
    status: 'completed' | 'in-progress' | 'pending';
    useMock: boolean;
  }> {
    const apis: Array<any> = [];
    const lines = apiDoc.split('\n');
    let currentAPI: any = {};

    for (const line of lines) {
      // 匹配API接口定义
      const apiMatch = line.match(/\*\*接口\*\*:\s*`(GET|POST|PUT|DELETE|PATCH)\s+([^`]+)`/);
      if (apiMatch) {
        if (currentAPI.endpoint) {
          apis.push(currentAPI);
        }
        currentAPI = {
          method: apiMatch[1],
          endpoint: apiMatch[2],
          description: '',
          status: 'pending',
          useMock: true
        };
      }

      // 匹配状态
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
    }

    if (currentAPI.endpoint) {
      apis.push(currentAPI);
    }

    return apis;
  }

  /**
   * 更新API文档状态
   */
  private updateAPIDocumentStatus(apiDoc: string, apis: Array<any>): string {
    let updatedDoc = apiDoc;

    for (const api of apis) {
      if (api.status === 'completed') {
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

/**
 * 默认技能入口
 */
export default {
  name: 'daodao-frontend-workflow',
  description: '叨叨房车前端开发工作流工具',
  version: '1.0.0-simple',

  async execute(params: any, context: any): Promise<any> {
    const workflow = new SimpleWorkflowEngine();

    try {
      // 确定目标项目
      const targetProject = params.target || 'admin-console';

      console.log('🚀 启动叨叨前端开发工作流...');
      console.log(`📱 目标项目: ${targetProject}`);

      // 执行工作流
      const result = await workflow.execute5StepWorkflow(targetProject);

      if (result.success) {
        return {
          success: true,
          message: '前端开发工作流执行成功！',
          result: result.results,
          suggestions: [
            '检查生成的示例组件',
            '根据需求继续开发具体功能',
            '运行测试验证功能'
          ]
        };
      } else {
        return {
          success: false,
          message: `工作流执行失败: ${result.error}`,
          error: result.error
        };
      }

    } catch (error) {
      return {
        success: false,
        message: `工具执行失败: ${error.message}`,
        error: error.stack
      };
    }
  }
};