<template>
  <div class="py-4">
    <div class="container">
      <div v-if="!authStore.user" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-muted">Memuat data user...</p>
      </div>

      <template v-else>
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="font-bold mb-1 text-2xl">Dashboard</h1>
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
    superadmin: 'bg-red-100 text-red-800',
    pemilik: 'bg-yellow-100 text-yellow-800',
    pendaftar: 'bg-green-100 text-green-800'
  }
  return map[authStore.role] || 'bg-gray-100 text-gray-800'
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

<style scoped>
.bg-red-100 {
  background-color: #fee2e2 !important;
}
.text-red-800 {
  color: #991b1b !important;
}
.bg-yellow-100 {
  background-color: #fef9c3 !important;
}
.text-yellow-800 {
  color: #854d0e !important;
}
.bg-green-100 {
  background-color: #dcfce7 !important;
}
.text-green-800 {
  color: #166534 !important;
}
.bg-gray-100 {
  background-color: #f3f4f6 !important;
}
.text-gray-800 {
  color: #1f2937 !important;
}
</style>
