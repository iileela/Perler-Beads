<template>
  <div class="pattern-preview card">
    <div class="preview-header">
      <h3>图纸预览</h3>
      <div class="preview-controls">
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

    <!-- 缩放控制栏 -->
    <div class="zoom-bar">
      <button class="zoom-btn" @click="zoomOut" :disabled="zoom <= MIN_ZOOM">−</button>
      <span class="zoom-value">{{ Math.round(zoom * 100) }}%</span>
      <button class="zoom-btn" @click="zoomIn" :disabled="zoom >= MAX_ZOOM">+</button>
      <button class="zoom-btn reset-btn" @click="resetView">适应窗口</button>
      <span class="zoom-hint">滚轮缩放 · 拖拽平移</span>
    </div>

    <!-- 图纸视口 -->
    <div
      class="canvas-viewport"
      ref="viewportRef"
      @wheel.prevent="onWheel"
      @mousedown="onMouseDown"
    >
      <canvas
        ref="patternCanvas"
        :style="canvasTransform"
        @contextmenu.prevent
      ></canvas>
    </div>

    <!-- 导出 -->
    <div class="export-actions">
      <label class="bead-size-label">
        拼豆尺寸：
        <select v-model.number="beadSizeMM">
          <option :value="2.6">2.6mm (迷你豆)</option>
          <option :value="5">5mm (标准豆)</option>
        </select>
      </label>
      <button
        class="btn btn-success"
        @click="exportPNG"
        :disabled="!store.matchedGrid.length"
      >
        导出 PNG 图纸
      </button>
      <button
        class="btn btn-primary"
        @click="exportPDF"
        :disabled="!store.matchedGrid.length || isExportingPDF"
      >
        <span v-if="isExportingPDF" class="spinner"></span>
        {{ isExportingPDF ? '生成中...' : '导出 PDF 图纸' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useProjectStore } from '@/stores/project'
import {
  generatePatternPNG,
  generatePatternPDF,
  renderPatternToCanvas,
  DEFAULT_BEAD_SIZE_MM,
} from '@/utils/pattern'

const store = useProjectStore()
const patternCanvas = ref<HTMLCanvasElement>()
const viewportRef = ref<HTMLDivElement>()
const showGrid = ref(true)
const showLabels = ref(true)
const isExportingPDF = ref(false)
const beadSizeMM = ref(DEFAULT_BEAD_SIZE_MM)

// --- 缩放 / 平移 ---
const MIN_ZOOM = 0.1
const MAX_ZOOM = 5
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const autoCellSize = ref(10) // 自动计算的最优 cellSize

// 鼠标拖拽状态
const isPanning = ref(false)
let dragStartX = 0
let dragStartY = 0
let dragPanX = 0
let dragPanY = 0

const canvasTransform = computed(() => ({
  position: 'absolute' as const,
  transformOrigin: '0 0',
  transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`,
}))

// --- 核心：根据视口尺寸计算最优 cellSize 并渲染 ---
function fitAndDraw() {
  const canvas = patternCanvas.value
  const vp = viewportRef.value
  if (!canvas || !vp || !store.matchedGrid.length) return

  const gridW = store.matchedGrid[0].length
  const gridH = store.matchedGrid.length
  const vpW = vp.clientWidth
  const vpH = vp.clientHeight

  // 计算撑满视口的 cellSize（留 8px 内边距）
  const cellW = (vpW - 16) / gridW
  const cellH = (vpH - 16) / gridH
  autoCellSize.value = Math.min(cellW, cellH, 20) // 上限 20px，防止超大格子

  renderPatternToCanvas(canvas, store.matchedGrid, autoCellSize.value, showGrid.value, showLabels.value)
  centerCanvas()
}

// 将画布居中于视口
function centerCanvas() {
  const canvas = patternCanvas.value
  const vp = viewportRef.value
  if (!canvas || !vp) return
  panX.value = (vp.clientWidth - canvas.width * zoom.value) / 2
  panY.value = (vp.clientHeight - canvas.height * zoom.value) / 2
}

// 重置视图
function resetView() {
  zoom.value = 1
  fitAndDraw()
}

// --- 缩放 ---
function zoomIn() {
  setZoom(Math.min(zoom.value * 1.25, MAX_ZOOM))
}
function zoomOut() {
  setZoom(Math.max(zoom.value / 1.25, MIN_ZOOM))
}

function setZoom(newZoom: number) {
  const vp = viewportRef.value
  const canvas = patternCanvas.value
  if (!vp || !canvas) return

  // 以视口中心为缩放原点
  const cx = vp.clientWidth / 2
  const cy = vp.clientHeight / 2

  // 当前视口中心对应画布坐标
  const canvasX = (cx - panX.value) / zoom.value
  const canvasY = (cy - panY.value) / zoom.value

  zoom.value = newZoom

  // 调整平移保持中心点不动
  panX.value = cx - canvasX * zoom.value
  panY.value = cy - canvasY * zoom.value
}

function onWheel(e: WheelEvent) {
  const delta = e.deltaY > 0 ? 1 / 1.15 : 1.15
  const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom.value * delta))

  const vp = viewportRef.value!
  const rect = vp.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top

  // 鼠标位置对应的画布坐标
  const canvasX = (mx - panX.value) / zoom.value
  const canvasY = (my - panY.value) / zoom.value

  zoom.value = newZoom
  panX.value = mx - canvasX * zoom.value
  panY.value = my - canvasY * zoom.value
}

// --- 平移 ---
function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) return
  isPanning.value = true
  dragStartX = e.clientX
  dragStartY = e.clientY
  dragPanX = panX.value
  dragPanY = panY.value

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent) {
  if (!isPanning.value) return
  panX.value = dragPanX + (e.clientX - dragStartX)
  panY.value = dragPanY + (e.clientY - dragStartY)
}

function onMouseUp() {
  isPanning.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

// --- 响应式：视口尺寸变化 → 重新适配 ---
let resizeObs: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => {
    fitAndDraw()
    if (viewportRef.value) {
      resizeObs = new ResizeObserver(() => fitAndDraw())
      resizeObs.observe(viewportRef.value)
    }
  })
})

onUnmounted(() => {
  resizeObs?.disconnect()
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

// 选项变化 → 重绘
watch([showGrid, showLabels, () => store.matchedGrid], () => {
  nextTick(fitAndDraw)
}, { deep: true })

// --- 导出 ---
function exportPNG() {
  if (!store.matchedGrid.length) return
  const exportPx = Math.round(beadSizeMM.value * 8)
  const dataUrl = generatePatternPNG(store.matchedGrid, {
    format: 'png',
    showGrid: showGrid.value,
    showLabels: showLabels.value,
    gridSize: exportPx,
    showLegend: false,
  })
  const link = document.createElement('a')
  link.download = `拼豆图纸_${store.gridDimensions.w}x${store.gridDimensions.h}_${beadSizeMM.value}mm.png`
  link.href = dataUrl
  link.click()
}

async function exportPDF() {
  if (!store.matchedGrid.length) return
  isExportingPDF.value = true
  try {
    const blob = await generatePatternPDF(store.matchedGrid, {
      format: 'pdf',
      showGrid: showGrid.value,
      showLabels: showLabels.value,
      gridSize: beadSizeMM.value,
      showLegend: true,
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `拼豆图纸_${store.gridDimensions.w}x${store.gridDimensions.h}_${beadSizeMM.value}mm.pdf`
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
  margin-bottom: 8px;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  margin-bottom: 0;
}

.checkbox-label input[type='checkbox'] {
  width: auto;
}

/* 缩放栏 */
.zoom-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding: 4px 0;
}

.zoom-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #f5f5f5;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background 0.15s;
}

.zoom-btn:hover:not(:disabled) {
  background: #e0e0e0;
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.reset-btn {
  width: auto;
  padding: 0 10px;
  font-size: 12px;
  margin-left: 4px;
}

.zoom-value {
  font-size: 13px;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
  color: #333;
}

.zoom-hint {
  font-size: 11px;
  color: #999;
  margin-left: 8px;
}

/* 视口 */
.canvas-viewport {
  flex: 1;
  min-height: 320px;
  max-height: 65vh;
  overflow: hidden;
  position: relative;
  background: #e8e8e8;
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-bottom: 12px;
  cursor: grab;
}

.canvas-viewport:active {
  cursor: grabbing;
}

/* 导出 */
.export-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.bead-size-label {
  font-size: 13px;
  margin-bottom: 0;
}

.bead-size-label select {
  width: auto;
  padding: 4px 8px;
  margin-left: 4px;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 4px;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>