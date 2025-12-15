<template>
  <div class="coming-soon">
    <div class="coming-soon-content">
      <el-icon :size="120" color="#409eff">
        <Tools />
      </el-icon>
      <h2>功能开发中</h2>
      <p>该功能正在开发中，敬请期待...</p>
      <el-button type="primary" @click="goBack">返回上一页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.coming-soon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;

  .coming-soon-content {
    text-align: center;

    h2 {
      margin: 24px 0 12px;
      font-size: 28px;
      font-weight: 600;
      color: #303133;
    }

    p {
      margin: 0 0 32px;
      font-size: 16px;
      color: #909399;
    }
  }
}
</style>
