import { defineStore } from 'pinia'
import { auth } from '../services'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),
  getters: {
    isAuthenticated: state => !!state.token,
    role: state => state.user?.role || null,
    isSuperadmin: state => state.user?.role === 'superadmin',
    isPemilik: state => state.user?.role === 'pemilik',
    isPendaftar: state => state.user?.role === 'pendaftar'
  },
  actions: {
    async login(email, password) {
      const { data } = await auth.login(email, password)
      this.token = data.data.token
      this.user = data.data.user
      localStorage.setItem('token', this.token)
    },
    async register(payload) {
      await auth.register(payload)
    },
    async fetchUser() {
      if (!this.token) return
      try {
        const { data } = await auth.getMe()
        this.user = data.data
      } catch {
        this.logout()
      }
    },
    async logout() {
      try { await auth.logout() } catch {}
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
