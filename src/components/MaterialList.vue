<template>
  <div class="material-list card">
    <h3>材料消耗清单</h3>
    <p class="desc">
      共需 <strong>{{ store.totalBeads }}</strong> 颗拼豆，<strong>{{ store.colorCount }}</strong> 种颜色
    </p>

    <div v-if="store.materialList.length === 0" class="empty-state">
      <p>暂无数据，请先完成色盘匹配</p>
    </div>

    <div v-else class="list-container">
      <table class="material-table">
        <thead>
          <tr>
            <th>色号</th>
            <th>颜色</th>
            <th>名称</th>
            <th>数量</th>
            <th>占比</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store.materialList" :key="item.code">
            <td><code>{{ item.code }}</code></td>
            <td>
              <span class="color-dot" :style="{ background: item.hex }"></span>
            </td>
            <td>{{ item.name }}</td>
            <td class="count">{{ item.count }}</td>
            <td>
              <div class="percentage-bar">
                <div
                  class="percentage-fill"
                  :style="{
                    width: (item.count / store.totalBeads * 100).toFixed(1) + '%',
                    background: item.hex
                  }"
                ></div>
                <span>{{ (item.count / store.totalBeads * 100).toFixed(1) }}%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="store.materialList.length > 0" class="export-list-actions">
      <button class="btn btn-secondary btn-sm" @click="exportText">
        导出文本清单
      </button>
      <button class="btn btn-secondary btn-sm" @click="exportCSV">
        导出 CSV 清单
      </button>
      <button class="btn btn-primary btn-sm" @click="copyAsShoppingList">
        复制购物清单
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { exportMaterialListText, exportMaterialListCSV } from '@/utils/pattern'

const store = useProjectStore()

function exportText() {
  const text = exportMaterialListText(store.materialList)
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '材料清单.txt'
  a.click()
  URL.revokeObjectURL(url)
}

function exportCSV() {
  const csv = exportMaterialListCSV(store.materialList)
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '材料清单.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function copyAsShoppingList() {
  const lines = store.materialList.map(item =>
    `- [ ] ${item.code} ${item.name} x${item.count}`
  )
  const text = `拼豆购物清单\n\n${lines.join('\n')}`
  navigator.clipboard.writeText(text).then(() => {
    alert('购物清单已复制到剪贴板！')
  })
}
</script>

<style scoped>
h3 { margin-bottom: 4px; }
.desc { color: var(--text-secondary); font-size: 13px; margin-bottom: 16px; }

.list-container {
  max-height: 400px;
  overflow: auto;
}

.material-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.material-table th {
  background: #f9fafb;
  padding: 8px 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 1;
}

.material-table td {
  padding: 6px 12px;
  border-bottom: 1px solid var(--border);
}

.material-table code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.color-dot {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border: 1px solid rgba(0,0,0,0.1);
}

.count {
  font-weight: 600;
}

.percentage-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.percentage-fill {
  height: 8px;
  border-radius: 4px;
  min-width: 2px;
}

.percentage-bar span {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.export-list-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}
</style>