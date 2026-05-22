<template>
  <div class="history-page">
    <div class="container">
      <h1>历史项目</h1>
      <p class="subtitle">您保存的拼豆图纸项目</p>

      <div v-if="store.projects.length === 0" class="empty-state">
        <div class="icon">📂</div>
        <h3>暂无历史项目</h3>
        <p>完成图纸生成后可保存项目，方便日后查看和编辑</p>
        <router-link to="/workbench" class="btn btn-primary">去创建工作台</router-link>
      </div>

      <div v-else class="project-grid">
        <div
          v-for="project in store.projects"
          :key="project.id"
          class="project-card card"
        >
          <div class="project-thumb">
            <img
              v-if="project.thumbnail"
              :src="project.thumbnail"
              alt="缩略图"
            />
            <div v-else class="no-thumb">无预览</div>
          </div>
          <div class="project-info">
            <h4>{{ project.name }}</h4>
            <p class="project-meta">
              {{ project.pixelWidth }}x{{ project.pixelHeight }}
              · {{ getBrandName(project.selectedPalette) }}
            </p>
            <p class="project-date">{{ formatDate(project.createdAt) }}</p>
          </div>
          <div class="project-actions">
            <button class="btn btn-primary btn-sm" @click="loadProject(project)">
              打开
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmDelete(project.id)">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { useRouter } from 'vue-router'
import { brandPalettes } from '@/data/palettes'
import type { ProjectData } from '@/types'

const store = useProjectStore()
const router = useRouter()

function getBrandName(key: string): string {
  return brandPalettes[key]?.name ?? key
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN')
}

function loadProject(project: ProjectData) {
  store.loadProject(project)
  router.push('/workbench')
}

function confirmDelete(id: string) {
  if (confirm('确定要删除这个项目吗？')) {
    store.deleteProject(id)
  }
}
</script>

<style scoped>
.history-page {
  padding: 24px 16px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.project-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.project-thumb {
  background: #f3f4f6;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.project-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.no-thumb {
  color: var(--text-secondary);
  font-size: 14px;
}

.project-info {
  padding: 12px 16px;
}

.project-info h4 {
  font-size: 15px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-meta {
  font-size: 13px;
  color: var(--text-secondary);
}

.project-date {
  font-size: 12px;
  color: #9ca3af;
}

.project-actions {
  padding: 0 16px 12px;
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .project-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
</style>