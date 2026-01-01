<template>
  <div class="text-contents">
    <!-- 二级 Tab：按文本类型分类 -->
    <el-tabs v-model="textType" type="card">
      <el-tab-pane label="首页公告" name="notices">
        <NoticeManager />
      </el-tab-pane>
      <el-tab-pane label="用户协议" name="agreements">
        <AgreementManager />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NoticeManager from './NoticeManager.vue'
import AgreementManager from './AgreementManager.vue'

const textType = ref('notices')
</script>

<style scoped lang="scss">
.text-contents {
  :deep(.el-tabs--card > .el-tabs__header) {
    border-bottom: 1px solid #e4e7ed;
  }
}
</style>
