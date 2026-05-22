<template>
  <div class="pixelation-controls card">
    <h3>像素化设置</h3>
    <p class="desc">设置目标像素尺寸，将图片转换为拼豆马赛克效果</p>

    <div class="controls-grid">
      <div class="control-group">
        <label>像素宽度</label>
        <div class="input-with-hint">
          <input
            type="number"
            :value="store.pixelWidth"
            @input="onWidthChange"
            min="8"
            max="200"
          />
          <span class="hint">横向拼豆数</span>
        </div>
      </div>

      <div class="control-group">
        <label>像素高度</label>
        <div class="input-with-hint">
          <input
            type="number"
            :value="store.pixelHeight"
            @input="onHeightChange"
            min="8"
            max="200"
          />
          <span class="hint">纵向拼豆数</span>
        </div>
      </div>
    </div>

    <div class="quick-sizes">
      <span class="label">快速预设：</span>
      <button
        v-for="size in presetSizes"
        :key="`${size[0]}x${size[1]}`"
        class="btn btn-sm"
        :class="store.pixelWidth === size[0] && store.pixelHeight === size[1] ? 'btn-primary' : 'btn-secondary'"
        @click="setPreset(size[0], size[1])"
      >
        {{ size[0] }}x{{ size[1] }}
      </button>
    </div>

    <div class="ai-options">
      <h4>AI 增强选项</h4>
      <label class="checkbox-label">
        <input type="checkbox" :checked="store.enableAIEnhance" @change="store.enableAIEnhance = ($event.target as HTMLInputElement).checked" />
        <span>启用AI图像增强（边缘平滑、噪声过滤）</span>
      </label>
      <div v-if="store.enableAIEnhance" class="control-group" style="margin-top:12px">
        <label>增强强度: {{ store.enhanceStrength }}</label>
        <input
          type="range"
          :value="store.enhanceStrength"
          @input="store.enhanceStrength = Number(($event.target as HTMLInputElement).value)"
          min="1"
          max="3"
        />
        <div class="range-labels">
          <span>轻度</span>
          <span>中度</span>
          <span>重度</span>
        </div>
      </div>
    </div>

    <button
      class="btn btn-primary btn-lg"
      style="width:100%; margin-top:16px"
      @click="$emit('process')"
      :disabled="store.isProcessing"
    >
      <span v-if="store.isProcessing" class="spinner"></span>
      {{ store.isProcessing ? '处理中...' : '开始像素化' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/project'

defineEmits<{ (e: 'process'): void }>()

const store = useProjectStore()

const presetSizes = [
  [29, 29], [32, 32], [48, 48],
  [58, 58], [64, 64], [80, 48],
]

function onWidthChange(e: Event) {
  store.pixelWidth = Math.max(8, Math.min(200, Number((e.target as HTMLInputElement).value)))
}

function onHeightChange(e: Event) {
  store.pixelHeight = Math.max(8, Math.min(200, Number((e.target as HTMLInputElement).value)))
}

function setPreset(w: number, h: number) {
  store.pixelWidth = w
  store.pixelHeight = h
}
</script>

<style scoped>
h3 {
  margin-bottom: 4px;
}

.desc {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 16px;
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.control-group {
  margin-bottom: 12px;
}

.input-with-hint {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-with-hint input {
  width: 100px;
}

.hint {
  font-size: 12px;
  color: var(--text-secondary);
}

.quick-sizes {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.quick-sizes .label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-right: 4px;
}

.ai-options {
  background: #f8f7ff;
  border-radius: var(--radius);
  padding: 16px;
  margin-top: 12px;
}

.ai-options h4 {
  font-size: 14px;
  margin-bottom: 12px;
  color: var(--primary);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

input[type="range"] {
  width: 100%;
}
</style>