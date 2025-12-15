<!-- 分润配置管理页面 -->
<template>
  <div class="profit-sharing-config-container">
    <PageHeader title="分润配置" description="管理各类分润比例和规则配置" />

    <!-- 配置列表 -->
    <el-card v-for="config in configList" :key="config.id" class="config-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="config-name">{{ config.configName }}</span>
          <el-switch
            v-model="config.enabled"
            @change="handleToggleEnabled(config)"
            active-text="启用"
            inactive-text="禁用"
          />
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="配置类型">
          <el-tag v-if="config.configType === 'hosting'" type="primary">托管分润</el-tag>
          <el-tag v-else-if="config.configType === 'cooperation'" type="success">差价分润</el-tag>
          <el-tag v-else-if="config.configType === 'staff'" type="warning">员工激励</el-tag>
          <el-tag v-else-if="config.configType === 'promotion'" type="info">推广分润</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="分成比例">
          <span class="ratio-value">{{ config.shareRatio }}%</span>
        </el-descriptions-item>
        <el-descriptions-item label="最小金额">
          ¥{{ config.minAmount.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="最大金额">
          ¥{{ config.maxAmount.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="适用用户标签" :span="2">
          <el-tag v-for="tagId in config.targetUserTags" :key="tagId" size="small" style="margin-right: 8px">
            {{ getTagName(tagId) }}
          </el-tag>
          <span v-if="!config.targetUserTags || config.targetUserTags.length === 0" style="color: #909399">
            全部用户
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="配置说明" :span="2">
          {{ config.description }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">
          {{ config.updatedAt }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="card-actions">
        <el-button type="primary" @click="handleEdit(config)">编辑配置</el-button>
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="配置名称">
          <el-input v-model="formData.configName" disabled />
        </el-form-item>
        <el-form-item label="分成比例" prop="shareRatio">
          <el-input-number
            v-model="formData.shareRatio"
            :min="0"
            :max="100"
            :precision="2"
            controls-position="right"
          />
          <span style="margin-left: 10px">%</span>
        </el-form-item>
        <el-form-item label="最小金额" prop="minAmount">
          <el-input-number
            v-model="formData.minAmount"
            :min="0"
            :precision="2"
            controls-position="right"
          />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="最大金额" prop="maxAmount">
          <el-input-number
            v-model="formData.maxAmount"
            :min="0"
            :precision="2"
            controls-position="right"
          />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="适用用户标签">
          <el-select
            v-model="formData.targetUserTags"
            multiple
            placeholder="请选择适用用户标签（不选则全部用户适用）"
            style="width: 100%"
          >
            <el-option
              v-for="tag in tagList"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            />
          </el-select>
          <div style="color: #909399; font-size: 12px; margin-top: 4px">
            选择可享受此分润规则的用户标签，不选则全部用户适用
          </div>
        </el-form-item>
        <el-form-item label="配置说明" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入配置说明"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-switch v-model="formData.enabled" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import { profitSharingApi } from '@/api/profitSharing'
import type { ProfitConfig } from '@/api/profitSharing'
import { tagApi, type Tag } from '@/api/user'

// 标签列表
const tagList = ref<Tag[]>([])
const tagOptions = computed(() =>
  tagList.value.map(tag => ({
    label: tag.name,
    value: tag.id
  }))
)

// 配置列表
const configList = ref<ProfitConfig[]>([])
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('编辑配置')
const submitLoading = ref(false)

// 表单
const formRef = ref<FormInstance>()
const formData = reactive({
  id: 0,
  configName: '',
  shareRatio: 0,
  minAmount: 0,
  maxAmount: 0,
  targetUserTags: [] as number[],
  description: '',
  enabled: true,
})

const formRules: FormRules = {
  shareRatio: [
    { required: true, message: '请输入分成比例', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '分成比例必须在0-100之间', trigger: 'blur' },
  ],
  minAmount: [
    { required: true, message: '请输入最小金额', trigger: 'blur' },
  ],
  maxAmount: [
    { required: true, message: '请输入最大金额', trigger: 'blur' },
  ],
}

// 获取配置列表
const fetchConfigList = async () => {
  loading.value = true
  try {
    const res = await profitSharingApi.getProfitConfig()
    if (res.code === 200) {
      configList.value = res.data
    }
  } catch (error) {
    console.error('获取配置列表失败:', error)
    ElMessage.error('获取配置列表失败')
  } finally {
    loading.value = false
  }
}

// 切换启用状态
const handleToggleEnabled = async (config: ProfitConfig) => {
  try {
    await profitSharingApi.updateProfitConfig({
      id: config.id,
      enabled: config.enabled,
    })
    ElMessage.success('更新成功')
    fetchConfigList()
  } catch (error) {
    console.error('更新失败:', error)
    ElMessage.error('更新失败')
    config.enabled = !config.enabled
  }
}

// 编辑配置
const handleEdit = (config: ProfitConfig) => {
  Object.assign(formData, {
    id: config.id,
    configName: config.configName,
    shareRatio: config.shareRatio,
    minAmount: config.minAmount,
    maxAmount: config.maxAmount,
    targetUserTags: config.targetUserTags ? [...config.targetUserTags] : [],
    description: config.description,
    enabled: config.enabled,
  })
  dialogTitle.value = '编辑配置'
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      await profitSharingApi.updateProfitConfig({
        id: formData.id,
        shareRatio: formData.shareRatio,
        minAmount: formData.minAmount,
        maxAmount: formData.maxAmount,
        targetUserTags: formData.targetUserTags,
        description: formData.description,
        enabled: formData.enabled,
      })
      ElMessage.success('保存成功')
      dialogVisible.value = false
      fetchConfigList()
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error('保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 获取标签名称
const getTagName = (tagId: number) => {
  const tag = tagList.value.find(t => t.id === tagId)
  return tag ? tag.name : `标签${tagId}`
}

// 加载标签列表
const loadTagList = async () => {
  try {
    const res = await tagApi.getTagList({
      page: 1,
      pageSize: 100,
      status: 'active'
    }) as any
    tagList.value = res.data.list
  } catch (error) {
    console.error('加载标签列表失败:', error)
  }
}

// 初始化
onMounted(() => {
  loadTagList()
  fetchConfigList()
})
</script>

<style scoped lang="scss">
.profit-sharing-config-container {
  padding: 20px;

  .config-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .config-name {
        font-size: 16px;
        font-weight: bold;
      }
    }

    .ratio-value {
      font-size: 18px;
      font-weight: bold;
      color: #409eff;
    }

    .card-actions {
      margin-top: 16px;
      text-align: right;
    }
  }
}
</style>
