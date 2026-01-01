<template>
  <div class="membership-config-form">
    <el-card v-loading="loading" shadow="never">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <!-- 基础配置 -->
        <el-divider content-position="left">基础配置</el-divider>

        <el-form-item label="会员年费" prop="price">
          <el-input-number
            v-model="formData.price"
            :min="0"
            :max="9999"
            :precision="2"
            :step="10"
          />
          <span class="form-tip">元/年</span>
        </el-form-item>

        <el-form-item label="会员时长" prop="duration">
          <el-input-number v-model="formData.duration" :min="1" :max="3650" />
          <span class="form-tip">天</span>
        </el-form-item>

        <el-form-item label="折扣比例" prop="discount">
          <el-input-number
            v-model="formData.discount"
            :min="0.01"
            :max="1"
            :precision="2"
            :step="0.01"
          />
          <span class="form-tip">如：0.95 表示 95 折</span>
        </el-form-item>

        <!-- 会员权益 -->
        <el-divider content-position="left">会员权益</el-divider>

        <el-form-item label="权益列表">
          <div class="benefits-list">
            <el-card
              v-for="(benefit, index) in formData.benefits"
              :key="index"
              class="benefit-card"
              shadow="hover"
            >
              <div class="benefit-header">
                <span class="benefit-index">权益 {{ index + 1 }}</span>
                <el-button link type="danger" :icon="Delete" @click="handleRemoveBenefit(index)">
                  删除
                </el-button>
              </div>

              <el-form-item
                label="权益名称"
                :prop="`benefits.${index}.name`"
                :rules="benefitRules.name"
              >
                <el-input v-model="benefit.name" placeholder="如：租车优惠" clearable />
              </el-form-item>

              <el-form-item
                label="权益描述"
                :prop="`benefits.${index}.description`"
                :rules="benefitRules.description"
              >
                <el-input
                  v-model="benefit.description"
                  type="textarea"
                  :rows="2"
                  placeholder="如：所有车型享95折优惠"
                  clearable
                />
              </el-form-item>

              <el-form-item
                label="图标名称"
                :prop="`benefits.${index}.icon`"
                :rules="benefitRules.icon"
              >
                <el-input v-model="benefit.icon" placeholder="如：discount" clearable>
                  <template #append>
                    <el-button :icon="View" @click="handlePreviewIcon(benefit.icon)">
                      预览
                    </el-button>
                  </template>
                </el-input>
                <div class="form-tip">
                  常用图标：discount（折扣）、medal（勋章）、gift（礼物）、service（客服）
                </div>
              </el-form-item>
            </el-card>

            <el-button
              class="add-benefit-btn"
              type="primary"
              plain
              :icon="Plus"
              @click="handleAddBenefit"
            >
              添加权益
            </el-button>
          </div>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="handleSave">
            保存配置
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图标预览对话框 -->
    <el-dialog v-model="iconPreviewVisible" title="图标预览" width="400px">
      <div class="icon-preview">
        <el-icon :size="80">
          <component :is="getIconComponent(previewIconName)" />
        </el-icon>
        <p class="icon-name">{{ previewIconName }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete, View, Discount, Medal, Present, Service } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getMembershipConfig, updateMembershipConfig } from '@/api/miniprogramResources'
import type { MembershipConfig } from '@/types/miniprogramResources'

// 数据
const loading = ref(false)
const submitLoading = ref(false)
const iconPreviewVisible = ref(false)
const previewIconName = ref('')
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<MembershipConfig>({
  price: 299,
  duration: 365,
  discount: 0.95,
  benefits: [],
})

// 原始数据备份（用于重置）
let originalData: MembershipConfig | null = null

// 表单验证规则
const formRules: FormRules = {
  price: [
    { required: true, message: '请输入会员年费', trigger: 'blur' },
    { type: 'number', min: 0, message: '年费不能为负数', trigger: 'blur' },
  ],
  duration: [
    { required: true, message: '请输入会员时长', trigger: 'blur' },
    { type: 'number', min: 1, message: '时长至少为1天', trigger: 'blur' },
  ],
  discount: [
    { required: true, message: '请输入折扣比例', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 1, message: '折扣比例范围：0.01-1', trigger: 'blur' },
  ],
}

// 权益验证规则
const benefitRules = {
  name: [{ required: true, message: '请输入权益名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入权益描述', trigger: 'blur' }],
  icon: [{ required: true, message: '请输入图标名称', trigger: 'blur' }],
}

// 图标映射
const iconMap: Record<string, any> = {
  discount: Discount,
  medal: Medal,
  gift: Present,
  service: Service,
}

// 获取图标组件
const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Discount
}

// 加载会员配置
const loadConfig = async () => {
  loading.value = true
  try {
    const res = await getMembershipConfig()
    const config = res.data
    originalData = JSON.parse(JSON.stringify(config))

    Object.assign(formData, {
      price: config.price,
      duration: config.duration,
      discount: config.discount,
      benefits: config.benefits || [],
    })
  } catch (error) {
    ElMessage.error('加载配置失败')
  } finally {
    loading.value = false
  }
}

// 添加权益
const handleAddBenefit = () => {
  formData.benefits.push({
    name: '',
    description: '',
    icon: 'discount',
  })
}

// 删除权益
const handleRemoveBenefit = (index: number) => {
  formData.benefits.splice(index, 1)
}

// 预览图标
const handlePreviewIcon = (iconName: string) => {
  previewIconName.value = iconName
  iconPreviewVisible.value = true
}

// 保存配置
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async valid => {
    if (!valid) return

    // 验证至少有一个权益
    if (formData.benefits.length === 0) {
      ElMessage.warning('请至少添加一个会员权益')
      return
    }

    submitLoading.value = true
    try {
      await updateMembershipConfig(formData)
      ElMessage.success('保存成功')
      loadConfig()
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 重置表单
const handleReset = () => {
  if (originalData) {
    Object.assign(formData, {
      price: originalData.price,
      duration: originalData.duration,
      discount: originalData.discount,
      benefits: JSON.parse(JSON.stringify(originalData.benefits)),
    })
    ElMessage.info('已重置为原始配置')
  }
}

onMounted(() => {
  loadConfig()
})
</script>

<style scoped lang="scss">
.membership-config-form {
  .form-tip {
    margin-left: 8px;
    font-size: 12px;
    color: #909399;
  }

  .benefits-list {
    width: 100%;

    .benefit-card {
      margin-bottom: 16px;

      .benefit-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ebeef5;

        .benefit-index {
          font-size: 14px;
          font-weight: 600;
          color: #303133;
        }
      }

      :deep(.el-form-item) {
        margin-bottom: 16px;
      }
    }

    .add-benefit-btn {
      width: 100%;
    }
  }

  .icon-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;

    .icon-name {
      margin-top: 16px;
      font-size: 16px;
      color: #606266;
    }
  }
}
</style>
