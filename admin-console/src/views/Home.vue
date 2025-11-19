<template>
  <div class="page-container">
    <div class="card-container">
      <h1>欢迎使用叨叨房车管理后台</h1>
      <p>系统初始化完成，一切正常！</p>
      <el-button type="primary" @click="goToLogin">
        前往登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.card-container {
  text-align: center;
  max-width: 600px;
  margin: 50px auto;
}

h1 {
  color: $primary-color;
  margin-bottom: 20px;
}
</style>