<template>
  <div class="palette-matcher card">
    <h3>色盘匹配</h3>
    <p class="desc">选择拼豆品牌，系统将自动匹配颜色</p>

    <!-- 品牌选择 -->
    <div class="brand-select">
      <label>拼豆品牌</label>
      <select :value="store.selectedBrand" @change="onBrandChange">
        <option value="perler">Perler (50色)</option>
        <option value="artkal">Artkal (50色)</option>
        <option value="hama">Hama (50色)</option>
      </select>
    </div>

    <!-- 预览 -->
    <div v-if="store.pixelatedPreview" class="preview-section">
      <h4>像素化预览</h4>
      <div class="preview-img-wrap">
        <img :src="store.pixelatedPreview" alt="像素化预览" />
      </div>
    </div>

    <!-- 匹配预览 -->
    <div v-if="store.matchedGrid.length > 0" class="match-preview">
      <h4>匹配结果</h4>
      <canvas ref="matchCanvas" class="match-canvas"></canvas>
      <div class="grid-info">
        尺寸: {{ store.gridDimensions.w }} x {{ store.gridDimensions.h }}
      </div>
    </div>

    <!-- 颜色手动调整 -->
    <div v-if="store.matchedGrid.length > 0" class="manual-adjust">
      <h4>手动颜色微调</h4>
      <p class="adjust-desc">
        点击下方网格中的某个像素，然后从色盘中选择替换颜色
      </p>
      <div class="color-adjust-grid">
        <canvas
          ref="adjustCanvas"
          class="adjust-canvas"
          @click="handleCanvasClick"
        ></canvas>
      </div>
      <div v-if="selectedPixel" class="color-picker-panel">
        <p>选择替换颜色 (当前位置: {{ selectedPixel.x }}, {{ selectedPixel.y }})：</p>
        <div class="color-swatch-grid">
          <div
            v-for="color in palette"
            :key="color.code"
            class="color-swatch"
            :class="{ selected: selectedBeadCode === color.code }"
            :style="{ background: color.hex }"
            :title="`${color.code} ${color.name}`"
            @click="selectBeadColor(color.code)"
          >
            <span class="swatch-label">{{ color.code }}</span>
          </div>
        </div>
      </div>
    </div>

    <button
      class="btn btn-primary btn-lg"
      style="width:100%; margin-top:16px"
      @click="$emit('match')"
      :disabled="store.isProcessing"
    >
      <span v-if="store.isProcessing" class="spinner"></span>
      {{ store.isProcessing ? '匹配中...' : '开始色盘匹配' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useProjectStore } from '@/stores/project'
import { getPaletteColors } from '@/data/palettes'
import type { PaletteColor } from '@/types'

defineEmits<{ (e: 'match'): void }>()

const store = useProjectStore()
const adjustCanvas = ref<HTMLCanvasElement>()
const matchCanvas = ref<HTMLCanvasElement>()
const selectedPixel = ref<{ x: number; y: number } | null>(null)
const selectedBeadCode = ref('')

const palette = computed(() => getPaletteColors(store.selectedBrand))

function onBrandChange(e: Event) {
  store.selectedBrand = (e.target as HTMLSelectElement).value
  store.manualOverrides.clear()
  selectedPixel.value = null
}

function selectBeadColor(code: string) {
  if (selectedPixel.value) {
    store.overrideColor(selectedPixel.value.x, selectedPixel.value.y, code)
    selectedBeadCode.value = code
  }
}

function drawAdjustCanvas() {
  const canvas = adjustCanvas.value
  if (!canvas || store.matchedGrid.length === 0) return

  const grid = store.matchedGrid
  const h = grid.length
  const w = grid[0].length
  const cellSize = Math.max(4, Math.min(20, Math.floor(480 / Math.max(w, h))))

  canvas.width = w * cellSize
  canvas.height = h * cellSize
  const ctx = canvas.getContext('2d')!

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      ctx.fillStyle = grid[y][x].beadHex
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 0.5
      ctx.strokeRect(x * cellSize + 0.5, y * cellSize + 0.5, cellSize - 1, cellSize - 1)
    }
  }
}

function drawMatchPreview() {
  const canvas = matchCanvas.value
  if (!canvas || store.matchedGrid.length === 0) return

  const grid = store.matchedGrid
  const h = grid.length
  const w = grid[0].length
  const cellSize = Math.max(2, Math.min(8, Math.floor(300 / Math.max(w, h))))

  canvas.width = w * cellSize
  canvas.height = h * cellSize
  const ctx = canvas.getContext('2d')!

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      ctx.fillStyle = grid[y][x].beadHex
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
    }
  }
}

function handleCanvasClick(e: MouseEvent) {
  const canvas = adjustCanvas.value
  if (!canvas || store.matchedGrid.length === 0) return

  const rect = canvas.getBoundingClientRect()
  const cellSize = canvas.width / store.matchedGrid[0].length
  const x = Math.floor((e.clientX - rect.left) / cellSize)
  const y = Math.floor((e.clientY - rect.top) / cellSize)

  if (x >= 0 && x < store.matchedGrid[0].length && y >= 0 && y < store.matchedGrid.length) {
    selectedPixel.value = { x, y }
    selectedBeadCode.value = store.matchedGrid[y][x].beadCode
  }
}

watch(() => store.matchedGrid, () => {
  nextTick(() => {
    drawAdjustCanvas()
    drawMatchPreview()
  })
}, { deep: true })
</script>

<style scoped>
h3 { margin-bottom: 4px; }
.desc { color: var(--text-secondary); font-size: 13px; margin-bottom: 16px; }

.brand-select {
  margin-bottom: 16px;
}

.preview-section, .match-preview {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.preview-section h4, .match-preview h4 {
  font-size: 14px;
  margin-bottom: 8px;
}

.preview-img-wrap img {
  max-width: 100%;
  border-radius: 4px;
  image-rendering: pixelated;
}

.match-canvas {
  width: 100%;
  max-width: 300px;
  border-radius: 4px;
  margin: 0 auto;
  image-rendering: pixelated;
  display: block;
}

.grid-info {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 8px;
  text-align: center;
}

.manual-adjust {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.manual-adjust h4 {
  font-size: 14px;
  margin-bottom: 4px;
}

.adjust-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.color-adjust-grid {
  max-height: 400px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-bottom: 12px;
}

.adjust-canvas {
  display: block;
  cursor: crosshair;
}

.color-picker-panel {
  background: #f9fafb;
  border-radius: var(--radius);
  padding: 12px;
}

.color-picker-panel p {
  font-size: 13px;
  margin-bottom: 8px;
}

.color-swatch-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.color-swatch {
  width: 36px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.color-swatch:hover {
  transform: scale(1.15);
  z-index: 2;
}

.color-swatch.selected {
  border-color: #000;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #000;
}

.swatch-label {
  font-size: 8px;
  background: rgba(0,0,0,0.4);
  color: #fff;
  padding: 1px 3px;
  border-radius: 2px;
  pointer-events: none;
}
</style>