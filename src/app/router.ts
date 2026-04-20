import { createRouter, createWebHistory } from 'vue-router'
import PageTutor from '@/pages/tutor/PageTutor.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'tutor',
      component: PageTutor
    }
  ]
})

export default router
