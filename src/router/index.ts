import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/workbench',
    },
    {
      path: '/workbench',
      name: 'Workbench',
      component: () => import('@/views/Workbench.vue'),
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('@/views/History.vue'),
    },
    {
      path: '/help',
      name: 'Help',
      component: () => import('@/views/Help.vue'),
    },
  ],
})

export default router