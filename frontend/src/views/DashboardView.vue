<template>
  <div class="dashboard-shell paper-texture min-h-screen pt-24 pb-20 relative bg-background">
    <!-- Overlay Pattern -->
    <div class="pattern-overlay z-0 opacity-30"></div>
    
    <div class="container relative z-10 mx-auto px-4 lg:px-8">
      
      <div v-if="!authStore.user" class="text-center py-32 animate-fade-in flex flex-col items-center justify-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mb-6"></div>
        <p class="text-muted-foreground font-heading text-xl">Sikronisasi Identitas Sesi...</p>
      </div>

      <template v-else>
        <!-- Master Dashboard Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-border animate-fade-in">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-sm">
              <span class="font-heading font-bold text-2xl uppercase">{{ authStore.user.username.charAt(0) }}</span>
            </div>
            <div>
              <h1 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
                Panel Kontrol
              </h1>
              <p class="text-muted-foreground font-medium">Ahlan wa sahlan, <strong class="text-foreground">{{ authStore.user.username }}</strong></p>
            </div>
          </div>

          <!-- Role Indicator & Actions -->
          <div class="flex flex-col sm:flex-row border border-border shadow-sm rounded-xl overflow-hidden self-start md:self-auto bg-white">
            <div class="px-4 py-3 flex items-center gap-2 border-b sm:border-b-0 sm:border-r border-border" :class="roleBg">
              <svg v-if="authStore.isSuperadmin" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <svg v-else-if="authStore.isPemilik" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              <svg v-else class="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              <span class="text-sm font-bold tracking-widest uppercase" :class="roleTextColor">{{ roleLabel }}</span>
            </div>
            <button @click="handleLogout" class="px-5 py-3 flex items-center justify-center gap-2 hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-bold text-sm uppercase tracking-widest transition-colors w-full sm:w-auto">
              Keluar Sesi
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>

        <!-- Render Specific Dashboard Component -->
        <div class="animate-slide-up delay-1">
          <AdminDashboard v-if="authStore.isSuperadmin" />
          <PemilikDashboard v-else-if="authStore.isPemilik" />
          <PendaftarDashboard v-else />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import AdminDashboard from '../components/dashboard/AdminDashboard.vue'
import PemilikDashboard from '../components/dashboard/PemilikDashboard.vue'
import PendaftarDashboard from '../components/dashboard/PendaftarDashboard.vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const roleBg = computed(() => {
  const map = {
    superadmin: 'bg-destructive/90',
    pemilik: 'bg-accent',
    pendaftar: 'bg-muted/30'
  }
  return map[authStore.role] || 'bg-muted'
})

const roleTextColor = computed(() => {
  const map = {
    superadmin: 'text-white',
    pemilik: 'text-white',
    pendaftar: 'text-foreground'
  }
  return map[authStore.role] || 'text-muted-foreground'
})

const roleLabel = computed(() => {
  const map = {
    superadmin: 'Administrator',
    pemilik: 'Pemilik Lembaga',
    pendaftar: 'Calon Pendaftar'
  }
  return map[authStore.role] || authStore.role
})

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }
})
</script>

<style scoped>
/* Rely on global style Tailwind v4 theme */
</style>
