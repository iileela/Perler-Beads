<template>
  <div id="app">
    <nav class="app-nav">
      <div class="nav-brand">
        <span class="logo">🎨</span>
        <span class="title">拼豆图纸生成器</span>
      </div>
      <div class="nav-links">
        <router-link to="/workbench">工作台</router-link>
        <router-link to="/history">历史项目</router-link>
        <router-link to="/help">帮助</router-link>
      </div>
    </nav>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  background: #1a1a2e;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-brand .logo {
  font-size: 24px;
}

.nav-brand .title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-links a {
  color: #ccc;
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #fff;
  background: rgba(255,255,255,0.15);
}

.app-main {
  min-height: calc(100vh - 56px);
  background: #f0f2f5;
}
</style>