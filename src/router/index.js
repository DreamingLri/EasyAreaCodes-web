import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'main',
    component: ()=>import('@/components/Main.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: 'admin/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: ()=>import('@/components/Login.vue')
      },
      {
        path: 'back-stage',
        name: 'back-stage',
        component: ()=>import('@/components/BackStage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    title: '404 NotFound',
    component: ()=> import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
