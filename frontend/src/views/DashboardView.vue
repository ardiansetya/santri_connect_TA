<template>
  <div class="py-4">
    <div class="container">
      <div v-if="!authStore.user" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-muted">Memuat data user...</p>
      </div>

      <template v-else>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="fw-bold mb-1">Dashboard</h1>
            <p class="text-muted mb-0">Selamat datang, <strong>{{ authStore.user.username }}</strong></p>
          </div>
          <span class="badge" :class="roleBadge">{{ roleLabel }}</span>
        </div>

        <AdminDashboard v-if="authStore.isSuperadmin" />
        <PemilikDashboard v-else-if="authStore.isPemilik" />
        <PendaftarDashboard v-else />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import AdminDashboard from '../components/dashboard/AdminDashboard.vue'
import PemilikDashboard from '../components/dashboard/PemilikDashboard.vue'
import PendaftarDashboard from '../components/dashboard/PendaftarDashboard.vue'

const authStore = useAuthStore()

const roleBadge = computed(() => {
  const map = {
    superadmin: 'bg-danger',
    pemilik: 'bg-warning text-dark',
    pendaftar: 'bg-success'
  }
  return map[authStore.role] || 'bg-secondary'
})

const roleLabel = computed(() => {
  const map = {
    superadmin: 'Super Admin',
    pemilik: 'Pemilik Pesantren',
    pendaftar: 'Pendaftar'
  }
  return map[authStore.role] || authStore.role
})

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }
})
</script>
