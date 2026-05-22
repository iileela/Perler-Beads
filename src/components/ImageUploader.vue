<template>
  <div class="image-uploader">
    <div
      class="drop-zone"
      :class="{ 'drag-over': isDragging, 'has-image': previewUrl }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/bmp"
        @change="handleFileSelect"
        hidden
      />

      <template v-if="!previewUrl">
        <div class="upload-prompt">
          <div class="upload-icon">📁</div>
          <h3>上传图片</h3>
          <p>拖拽图片到此处，或点击选择文件</p>
          <p class="upload-hint">支持 JPG、PNG、WebP、BMP 格式</p>
          <button class="btn btn-primary" @click="$refs.fileInput.click()">
            选择图片
          </button>
        </div>
      </template>

      <template v-else>
        <div class="image-preview">
          <img :src="previewUrl" alt="预览" />
          <div class="preview-actions">
            <button class="btn btn-secondary btn-sm" @click="$refs.fileInput.click()">
              更换图片
            </button>
            <button class="btn btn-primary btn-sm" @click="$emit('confirm')">
              确认使用
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { loadImage, imageToBase64 } from '@/utils/image'

const emit = defineEmits<{
  (e: 'image-ready', img: HTMLImageElement, dataUrl: string): void
  (e: 'confirm'): void
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const previewUrl = ref('')
const currentImage = ref<HTMLImageElement | null>(null)

async function processFile(file: File) {
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  try {
    const img = await loadImage(file)
    currentImage.value = img
    previewUrl.value = URL.createObjectURL(file)
    emit('image-ready', img, imageToBase64(img))
  } catch {
    alert('图片加载失败，请重试')
  }
}

function handleFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) processFile(file)
}
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #d1d5db;
  border-radius: var(--radius);
  padding: 40px;
  text-align: center;
  transition: all 0.3s;
  background: #fafafa;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.drop-zone.drag-over {
  border-color: var(--primary);
  background: rgba(79, 70, 229, 0.05);
}

.drop-zone.has-image {
  padding: 12px;
  min-height: auto;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-prompt h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.upload-prompt p {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px !important;
  color: #9ca3af !important;
}

.image-preview {
  width: 100%;
}

.image-preview img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 4px;
  display: block;
  margin: 0 auto;
}

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}
</style>