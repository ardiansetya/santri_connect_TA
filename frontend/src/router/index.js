import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guest: true }
  },
  {
    path: '/pesantren',
    name: 'pesantren-list',
    component: () => import('../views/PesantrenListView.vue')
  },
  {
    path: '/pesantren/:id',
    name: 'pesantren-detail',
    component: () => import('../views/PesantrenDetailView.vue')
  },
  {
    path: '/pesantren/:id/daftar',
    name: 'pendaftaran-form',
    component: () => import('../views/PendaftaranFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rekomendasi',
    name: 'rekomendasi',
    component: () => import('../views/RekomendasiView.vue')
  },
  {
    path: '/compare',
    name: 'compare',
    component: () => import('../views/CompareView.vue')
  },
  {
    path: '/track',
    name: 'track-status',
    component: () => import('../views/TrackStatusView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (auth.token && !auth.user) {
    await auth.fetchUser()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && auth.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
