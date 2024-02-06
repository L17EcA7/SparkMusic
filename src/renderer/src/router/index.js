import localForage from 'localforage'
import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      keepAlive: true,
      title: ''
    },
    component: () => import('../views/home.vue')
  },
  {
    path: '/hi',
    name: 'Hello',
    meta: {
      keepAlive: true,
      title: '欢迎'
    },
    component: () => import('../views/hi.vue')
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? '星火音乐 | ' + to.meta.title : '星火音乐'
  next()
})

export default router
