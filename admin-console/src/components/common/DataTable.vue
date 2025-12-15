<template>
  <el-card class="table-card" shadow="never">
    <!-- 工具栏 -->
    <div v-if="toolbarButtons.length > 0" class="toolbar">
      <el-button
        v-for="btn in toolbarButtons"
        :key="btn.label"
        :type="btn.type"
        :icon="btn.icon"
        @click="btn.onClick"
      >
        {{ btn.label }}
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="data"
      stripe
      style="width: 100%"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :show-overflow-tooltip="column.showOverflowTooltip"
      >
        <template v-if="column.slot" #default="scope">
          <slot :name="column.slot" :row="scope.row" :column="column" />
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="actions.length > 0"
        label="操作"
        :width="actionsWidth"
        fixed="right"
      >
        <template #default="{ row }">
          <template v-for="action in actions" :key="action.label">
            <el-button
              v-if="!action.show || action.show(row)"
              link
              :type="action.type"
              size="small"
              @click="action.onClick(row)"
            >
              {{ action.label }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- eslint-disable vue/no-mutating-props -->
    <div v-if="pagination" class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes || [10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- eslint-enable vue/no-mutating-props -->
  </el-card>
</template>

<script setup lang="ts">
export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right'
  showOverflowTooltip?: boolean
  slot?: string
}

export interface TableAction {
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  onClick: (row: any) => void
  show?: (row: any) => boolean
}

export interface ToolbarButton {
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: any
  onClick: () => void
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  pageSizes?: number[]
}

const _props = withDefaults(
  defineProps<{
    data: any[]
    columns: TableColumn[]
    loading?: boolean
    actions?: TableAction[]
    actionsWidth?: string | number
    toolbarButtons?: ToolbarButton[]
    pagination?: Pagination
  }>(),
  {
    loading: false,
    actions: () => [],
    actionsWidth: 200,
    toolbarButtons: () => [],
  }
)

const emit = defineEmits<{
  (e: 'size-change', size: number): void
  (e: 'current-change', page: number): void
}>()

const handleSizeChange = (size: number) => {
  emit('size-change', size)
}

const handleCurrentChange = (page: number) => {
  emit('current-change', page)
}
</script>

<style scoped lang="scss">
.table-card {
  margin-bottom: 20px;

  .toolbar {
    margin-bottom: 16px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
