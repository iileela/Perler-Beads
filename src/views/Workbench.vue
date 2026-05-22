<template>
  <div class="workbench">
    <div class="container">
      <!-- 步骤指示器 -->
      <div class="stepper">
        <div class="step" :class="{ active: store.currentStep === 1, completed: store.currentStep > 1 }">
          <span class="step-number">{{ store.currentStep > 1 ? '✓' : '1' }}</span>
          上传图片
        </div>
        <div class="step" :class="{ active: store.currentStep === 2, completed: store.currentStep > 2 }">
          <span class="step-number">{{ store.currentStep > 2 ? '✓' : '2' }}</span>
          像素化处理
        </div>
        <div class="step" :class="{ active: store.currentStep === 3, completed: store.currentStep > 3 }">
          <span class="step-number">{{ store.currentStep > 3 ? '✓' : '3' }}</span>
          色盘匹配
        </div>
        <div class="step" :class="{ active: store.currentStep === 4 }">
          <span class="step-number">4</span>
          导出图纸
        </div>
      </div>

      <!-- 步骤1: 上传图片 -->
      <section v-if="store.currentStep === 1" class="step-content">
        <ImageUploader
          @image-ready="onImageReady"
          @confirm="onImageConfirm"
        />
      </section>

      <!-- 步骤2: 像素化处理 -->
      <section v-if="store.currentStep === 2" class="step-content">
        <div class="two-col">
          <div class="col-sidebar">
            <PixelationControls @process="store.doPixelate()" />
          </div>
          <div class="col-main">
            <div v-if="store.originalDataUrl" class="preview-card card">
              <h4>原始图片预览</h4>
              <img :src="store.originalDataUrl" alt="原始图片" class="orig-preview" />
            </div>
          </div>
        </div>
      </section>

      <!-- 步骤3: 色盘匹配 -->
      <section v-if="store.currentStep === 3" class="step-content">
        <div class="two-col">
          <div class="col-sidebar">
            <PaletteMatcher @match="store.doColorMatch()" />
          </div>
          <div class="col-main">
            <div v-if="store.matchedGrid.length > 0" class="preview-card card">
              <h4>匹配结果预览</h4>
              <PatternPreview />
            </div>
            <div v-else class="preview-card card">
              <div class="empty-state">
                <div class="icon">🎨</div>
                <p>点击"开始色盘匹配"查看匹配结果</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 步骤4: 导出图纸 -->
      <section v-if="store.currentStep === 4" class="step-content">
        <div class="two-col">
          <div class="col-main">
            <PatternPreview />
          </div>
          <div class="col-sidebar">
            <MaterialList />
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" @click="store.reset()">
            重新开始
          </button>
          <button class="btn btn-primary" @click="store.saveCurrentProject()">
            保存项目
          </button>
        </div>
      </section>

      <!-- 处理中遮罩 -->
      <div v-if="store.isProcessing" class="global-loading">
        <div class="spinner"></div>
        <p>{{ store.processingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import ImageUploader from '@/components/ImageUploader.vue'
import PixelationControls from '@/components/PixelationControls.vue'
import PaletteMatcher from '@/components/PaletteMatcher.vue'
import PatternPreview from '@/components/PatternPreview.vue'
import MaterialList from '@/components/MaterialList.vue'

const store = useProjectStore()

function onImageReady(img: HTMLImageElement, dataUrl: string) {
  store.setOriginalImage(img, dataUrl)
}

function onImageConfirm() {
  store.currentStep = 2
}
</script>

<style scoped>
.workbench {
  padding: 24px 16px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.step-content {
  margin-top: 24px;
}

.two-col {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  align-items: start;
}

.col-sidebar {
  position: sticky;
  top: 80px;
}

.preview-card h4 {
  margin-bottom: 12px;
}

.orig-preview {
  max-width: 100%;
  max-height: 500px;
  border-radius: 4px;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.global-loading {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 1000;
}

.global-loading p {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.global-loading .spinner {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

@media (max-width: 768px) {
  .two-col {
    grid-template-columns: 1fr;
  }

  .col-sidebar {
    position: static;
  }

  .container {
    padding: 0 8px;
  }
}
</style>