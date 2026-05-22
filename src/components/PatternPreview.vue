<template>
  <div class="pattern-preview card">
    <div class="preview-header">
      <h3>图纸预览</h3>
      <div class="preview-controls">
        <label>
          网格大小:
          <select v-model.number="cellSize">
            <option :value="4">4px</option>
            <option :value="6">6px</option>
            <option :value="8">8px</option>
            <option :value="12">12px</option>
            <option :value="16">16px</option>
            <option :value="20">20px</option>
          </select>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showGrid" />
          显示网格线
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showLabels" />
          显示色号
        </label>
      </div>
    </div>

    <div class="canvas-container" ref="containerRef">
      <canvas ref="patternCanvas"></canvas>
    </div>

    <div class="export-actions">
      <button class="btn btn-success" @click="exportPNG" :disabled="!store.matchedGrid.length">
        导出 PNG 图纸
      </button>
      <button class="btn btn-primary" @click="exportPDF" :disabled="!store.matchedGrid.length || isExportingPDF">
        <span v-if="isExportingPDF" class="spinner"></span>
        {{ isExportingPDF ? '生成中...' : '导出 PDF 图纸' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useProjectStore } from '@/stores/project'
import { generatePatternPNG, generatePatternPDF, renderPatternToCanvas } from '@/utils/pattern'

const store = useProjectStore()
const patternCanvas = ref<HTMLCanvasElement>()
const containerRef = ref<HTMLDivElement>()
const cellSize = ref(12)
const showGrid = ref(true)
const showLabels = ref(true)
const isExportingPDF = ref(false)

function draw() {
  const canvas = patternCanvas.value
  if (!canvas || !store.matchedGrid.length) return
  renderPatternToCanvas(canvas, store.matchedGrid, cellSize.value)
}

watch([cellSize, showGrid, showLabels, () => store.matchedGrid], draw, { deep: true })

onMounted(() => {
  nextTick(draw)
})

function exportPNG() {
  if (!store.matchedGrid.length) return
  const dataUrl = generatePatternPNG(store.matchedGrid, {
    format: 'png',
    showGrid: true,
    showLabels: true,
    gridSize: 16,
    showLegend: false,
  })

  const link = document.createElement('a')
  link.download = `拼豆图纸_${store.gridDimensions.w}x${store.gridDimensions.h}.png`
  link.href = dataUrl
  link.click()
}

async function exportPDF() {
  if (!store.matchedGrid.length) return
  isExportingPDF.value = true
  try {
    const blob = await generatePatternPDF(store.matchedGrid, {
      format: 'pdf',
      showGrid: true,
      showLabels: true,
      gridSize: 8,
      showLegend: true,
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `拼豆图纸_${store.gridDimensions.w}x${store.gridDimensions.h}.pdf`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  } finally {
    isExportingPDF.value = false
  }
}
</script>

<style scoped>
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.preview-header h3 {
  margin: 0;
}

.preview-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.preview-controls label {
  margin-bottom: 0;
  font-size: 13px;
}

.preview-controls select {
  width: auto;
  padding: 4px 8px;
  margin-left: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.canvas-container {
  overflow: auto;
  max-height: 60vh;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #fff;
  margin-bottom: 16px;
}

.canvas-container canvas {
  display: block;
}

.export-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>