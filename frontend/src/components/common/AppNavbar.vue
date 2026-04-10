<template>
  <nav class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
    <div class="container flex h-16 items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <span class="font-heading text-xl font-bold text-foreground">
          Santri<span class="text-primary">Connect</span>
        </span>
      </router-link>

      <!-- Desktop -->
      <div class="hidden items-center gap-1 md:flex">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="$route.path === link.to ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
        >
          {{ link.label }}
        </router-link>
      </div>

      <div class="hidden items-center gap-2 md:flex">
        <template v-if="authStore.isAuthenticated">
          <router-link to="/dashboard" class="btn btn-ghost btn-sm gap-2">
            Dashboard
          </router-link>
          <router-link to="/profile" class="btn btn-ghost btn-sm gap-2">
            👤 {{ authStore.user?.username || 'Profil' }}
          </router-link>
          <button @click="handleLogout" class="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">Keluar</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-ghost btn-sm gap-2">Masuk</router-link>
          <router-link to="/register" class="btn btn-primary btn-sm gap-2">Daftar</router-link>
        </template>
      </div>

      <!-- Mobile toggle -->
      <button class="md:hidden p-2 rounded-lg hover:bg-muted" @click="isOpen = !isOpen">
        <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="isOpen" class="border-t border-border bg-surface p-4 md:hidden animate-fade-in">
      <div class="flex flex-col gap-1">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="isOpen = false"
          class="rounded-lg px-4 py-3 text-sm font-medium transition-colors"
          :class="$route.path === link.to ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'"
        >
          {{ link.label }}
        </router-link>
        <div class="mt-3 flex gap-2 border-t border-border pt-3">
          <template v-if="authStore.isAuthenticated">
            <router-link to="/dashboard" class="btn btn-outline btn-sm flex-1" @click="isOpen = false">Dashboard</router-link>
            <button @click="handleLogout" class="btn btn-sm flex-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">Keluar</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline btn-sm flex-1" @click="isOpen = false">Masuk</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm flex-1" @click="isOpen = false">Daftar</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/pesantren', label: 'Pesantren' },
  { to: '/rekomendasi', label: 'Rekomendasi' },
  { to: '/compare', label: 'Bandingkan' },
  { to: '/track', label: 'Cek Status' },
]

async function handleLogout() {
  await authStore.logout()
  router.push('/')
  isOpen.value = false
}
</script>