<!-- @ts-nocheck -->
<template>
  <div class="partner-stores-container">
    <PageHeader title="合作商门店" description="查看和管理合作商的门店信息" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="storeList"
      :columns="tableColumns"
      :loading="loading"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
          {{ row.status === 'active' ? '营业中' : '已停业' }}
        </el-tag>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, ToolbarButton } from '@/components/common/DataTable.vue'
import { getPartnerList, getPartnerStores, type PartnerStore } from '@/api/partner'
import { exportToCSV } from '@/utils/export'

// 搜索表单
const searchForm = ref({
  partnerId: null as number | null,
  keyword: '',
  status: ''
})

// 合作商列表
const partnerOptions = ref<Array<{ label: string; value: number }>>([])

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    type: 'select',
    prop: 'partnerId',
    label: '合作商',
    placeholder: '请选择合作商',
    options: partnerOptions
  },
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '门店名称/门店编码/城市'
  },
  {
    type: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '营业中', value: 'active' },
      { label: '已停业', value: 'inactive' }
    ]
  }
]

// 表格数据
const storeList = ref<PartnerStore[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'partnerName', label: '合作商', width: 150 },
  { prop: 'storeName', label: '门店名称', width: 200 },
  { prop: 'storeCode', label: '门店编码', width: 150 },
  { prop: 'cityName', label: '城市', width: 100 },
  { prop: 'address', label: '地址', minWidth: 200 },
  { prop: 'vehicleCount', label: '车辆数', width: 100 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '导出',
    icon: Download,
    onClick: handleExport
  }
]

// 获取合作商列表
async function fetchPartnerList() {
  try {
    const { list } = await getPartnerList({ page: 1, pageSize: 100 })
    partnerOptions.value = list.map((partner) => ({
      label: partner.name,
      value: partner.id
    }))
  } catch (error) {
    console.error('获取合作商列表失败:', error)
  }
}

// 获取门店列表
async function fetchStoreList() {
  loading.value = true
  try {
    if (!searchForm.value.partnerId) {
      // 如果没有选择合作商，获取所有合作商的门店
      const { list: partners } = await getPartnerList({ page: 1, pageSize: 100 })
      const allStores: PartnerStore[] = []

      for (const partner of partners) {
        const stores = await getPartnerStores(partner.id)
        allStores.push(...stores)
      }

      // 应用筛选
      let filteredStores = allStores

      if (searchForm.value.keyword) {
        const keyword = searchForm.value.keyword.toLowerCase()
        filteredStores = filteredStores.filter(
          (store) =>
            store.storeName.toLowerCase().includes(keyword) ||
            store.storeCode.toLowerCase().includes(keyword) ||
            store.cityName.toLowerCase().includes(keyword)
        )
      }

      if (searchForm.value.status) {
        filteredStores = filteredStores.filter((store) => store.status === searchForm.value.status)
      }

      // 分页
      pagination.total = filteredStores.length
      const start = (pagination.page - 1) * pagination.pageSize
      const end = start + pagination.pageSize
      storeList.value = filteredStores.slice(start, end)
    } else {
      // 获取指定合作商的门店
      const stores = await getPartnerStores(searchForm.value.partnerId)

      // 应用筛选
      let filteredStores = stores

      if (searchForm.value.keyword) {
        const keyword = searchForm.value.keyword.toLowerCase()
        filteredStores = filteredStores.filter(
          (store) =>
            store.storeName.toLowerCase().includes(keyword) ||
            store.storeCode.toLowerCase().includes(keyword) ||
            store.cityName.toLowerCase().includes(keyword)
        )
      }

      if (searchForm.value.status) {
        filteredStores = filteredStores.filter((store) => store.status === searchForm.value.status)
      }

      // 分页
      pagination.total = filteredStores.length
      const start = (pagination.page - 1) * pagination.pageSize
      const end = start + pagination.pageSize
      storeList.value = filteredStores.slice(start, end)
    }
  } catch (error) {
    console.error('获取门店列表失败:', error)
    ElMessage.error('获取门店列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.page = 1
  fetchStoreList()
}

// 重置
function handleReset() {
  searchForm.value = {
    partnerId: null,
    keyword: '',
    status: ''
  }
  pagination.page = 1
  fetchStoreList()
}

// 导出
function handleExport() {
  if (storeList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'partnerName', label: '合作商' },
    { key: 'storeName', label: '门店名称' },
    { key: 'storeCode', label: '门店编码' },
    { key: 'cityName', label: '城市' },
    { key: 'address', label: '地址' },
    { key: 'vehicleCount', label: '车辆数' },
    { key: 'status', label: '状态' }
  ]

  const exportData = storeList.value.map((store) => ({
    ...store,
    status: store.status === 'active' ? '营业中' : '已停业'
  }))

  exportToCSV(exportData, columns, '合作商门店列表')
}

// 分页
function handleSizeChange(size: number) {
  pagination.pageSize = size
  fetchStoreList()
}

function handleCurrentChange(page: number) {
  pagination.page = page
  fetchStoreList()
}

// 初始化
onMounted(() => {
  fetchPartnerList()
  fetchStoreList()
})
</script>

<style scoped lang="scss">
.partner-stores-container {
  padding: 20px;
}
</style>
