<template>
  <div class="config-management">
    <!-- 二级 Tab：按配置类型分类 -->
    <el-tabs v-model="configType" type="card">
      <el-tab-pane label="会员权益配置" name="membership">
        <MembershipConfigForm />
      </el-tab-pane>
      <el-tab-pane label="服务菜单配置" name="service-menu">
        <ServiceMenuConfigForm />
      </el-tab-pane>
      <el-tab-pane label="应用基础配置" name="app-config">
        <AppConfigForm />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MembershipConfigForm from './MembershipConfigForm.vue'
import ServiceMenuConfigForm from './ServiceMenuConfigForm.vue'
import AppConfigForm from './AppConfigForm.vue'

const configType = ref('membership')
</script>

<style scoped lang="scss">
.config-management {
  :deep(.el-tabs--card > .el-tabs__header) {
    border-bottom: 1px solid #e4e7ed;
  }
}
</style>
