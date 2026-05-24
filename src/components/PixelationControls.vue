<template>
  <div class="pixelation-controls card">
    <h3>像素化设置</h3>
    <p class="desc">设置目标像素尺寸，将图片转换为拼豆马赛克效果</p>

    <!-- 原始宽高比信息 -->
    <div v-if="store.originalImage" class="aspect-info">
      <span class="aspect-label">原始比例：</span>
      <span class="aspect-value">{{ aspectRatioDisplay }}</span>
      <label class="checkbox-label lock-label">
        <input
          type="checkbox"
          :checked="store.lockAspectRatio"
          @change="onLockToggle"
        />
        <span>锁定原始宽高比</span>
      </label>
    </div>

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
        :class="
          store.pixelWidth === size[0] && store.pixelHeight === size[1]
            ? 'btn-primary'
            : 'btn-secondary'
        "
        @click="store.setPixelSize(size[0], size[1])"
      >
        {{ size[0] }}x{{ size[1] }}
      </button>
    </div>

    <div class="ai-options">
      <h4>AI 增强选项</h4>
      <label class="checkbox-label">
        <input
          type="checkbox"
          :checked="store.enableAIEnhance"
          @change="
            store.enableAIEnhance = ($event.target as HTMLInputElement).checked
          "
        />
        <span>启用AI图像增强（边缘平滑、噪声过滤）</span>
      </label>
      <div
        v-if="store.enableAIEnhance"
        class="control-group"
        style="margin-top: 12px"
      >
        <label>增强强度: {{ store.enhanceStrength }}</label>
        <input
          type="range"
          :value="store.enhanceStrength"
          @input="
            store.enhanceStrength = Number(
              ($event.target as HTMLInputElement).value
            )
          "
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
      style="width: 100%; margin-top: 16px"
      @click="$emit('process')"
      :disabled="store.isProcessing"
    >
      <span v-if="store.isProcessing" class="spinner"></span>
      {{ store.isProcessing ? '处理中...' : '开始像素化' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProjectStore } from '@/stores/project';

defineEmits<{ (e: 'process'): void }>();

const store = useProjectStore();

const presetSizes = [
  [29, 29],
  [32, 32],
  [48, 48],
  [58, 58],
  [64, 64],
  [80, 48]
];

// 格式化为可读的宽高比（如 "16:9"）
const aspectRatioDisplay = computed(() => {
  const ratio = store.originalAspectRatio;
  if (!ratio) return '—';
  // 尝试找到简单的整数比
  const candidates = [
    [1, 1],
    [4, 3],
    [3, 2],
    [16, 10],
    [16, 9],
    [2, 1],
    [21, 9],
    [3, 4],
    [2, 3],
    [9, 16],
    [10, 16]
  ];
  for (const [w, h] of candidates) {
    if (Math.abs(ratio - w / h) < 0.02) {
      return ratio >= 1 ? `${w}:${h}` : `${h}:${w}`;
    }
  }
  return ratio.toFixed(3);
});

function onLockToggle(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  store.lockAspectRatio = checked;
  if (checked && store.originalAspectRatio > 0) {
    // 锁定开启时，以当前宽度为准重新计算高度
    store.setPixelWidth(store.pixelWidth);
  }
}

function onWidthChange(e: Event) {
  store.setPixelWidth(
    Math.max(8, Math.min(200, Number((e.target as HTMLInputElement).value)))
  );
}

function onHeightChange(e: Event) {
  store.setPixelHeight(
    Math.max(8, Math.min(200, Number((e.target as HTMLInputElement).value)))
  );
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

.aspect-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  margin-bottom: 14px;
  font-size: 13px;
  flex-wrap: wrap;
}

.aspect-label {
  color: var(--text-secondary);
}

.aspect-value {
  font-weight: 600;
  color: #0369a1;
}

.lock-label {
  margin-left: auto;
  margin-bottom: 0;
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

.checkbox-label input[type='checkbox'] {
  width: auto;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

input[type='range'] {
  width: 100%;
}
</style>
