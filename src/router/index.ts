import { createRouter, createWebHistory } from 'vue-router'
import ProjectsView from '@/views/ProjectsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'ProjectsView',
      component: ProjectsView,
    },
    {
      path: '/head',
      name: 'HeadView',
      component: () => import('@/views/HeadView.vue'),
    },
    {
      path: '/helpers',
      name: 'HelpersView',
      component: () => import('@/views/HelpersView.vue'),
    }
  ],
})

export default router