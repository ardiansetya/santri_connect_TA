<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div class="card" style="border-left: 4px solid hsl(231 84% 60%)">
        <div class="p-4">
          <p class="text-muted text-sm mb-1">Total Pesantren</p>
          <h3 class="font-bold mb-0">{{ stats.total_pesantren || 0 }}</h3>
        </div>
      </div>
      <div class="card" style="border-left: 4px solid #22c55e">
        <div class="p-4">
          <p class="text-muted text-sm mb-1">Total Pendaftaran</p>
          <h3 class="font-bold mb-0">{{ stats.total_pendaftaran || 0 }}</h3>
        </div>
      </div>
      <div class="card" style="border-left: 4px solid #eab308">
        <div class="p-4">
          <p class="text-muted text-sm mb-1">Pending</p>
          <h3 class="font-bold mb-0">{{ pendingCount }}</h3>
        </div>
      </div>
      <div class="card" style="border-left: 4px solid #3b82f6">
        <div class="p-4">
          <p class="text-muted text-sm mb-1">Diproses</p>
          <h3 class="font-bold mb-0">{{ diprosesCount }}</h3>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="border-b border-border px-5 py-4">
        <div class="flex">
          <button
            class="px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors"
            :class="activeTab === 'pendaftaran' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'"
            @click="activeTab = 'pendaftaran'"
          >
            Manajemen Pendaftaran
          </button>
          <button
            class="px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors"
            :class="activeTab === 'pesantren' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'"
            @click="activeTab = 'pesantren'"
          >
            Manajemen Pesantren
          </button>
          <button
            class="px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors"
            :class="activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'"
            @click="activeTab = 'users'"
          >
            Manajemen User
          </button>
        </div>
      </div>
      <div class="p-5">
        <div v-if="activeTab === 'pendaftaran'">
          <div class="flex justify-end mb-3">
            <button class="btn btn-sm bg-green-100 text-green-800 hover:bg-green-200" @click="exportData" :disabled="exporting">
              <span v-if="exporting" class="spinner-border spinner-border-sm me-2"></span>
              📥 Export Excel
            </button>
          </div>
          <div v-if="loadingPendaftaran" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted text-sm">Memuat data...</p>
          </div>
          <div v-else-if="pendaftaran.length === 0" class="text-center py-5">
            <p class="text-3xl mb-3">📭</p>
            <h6 class="font-semibold">Belum ada pendaftaran</h6>
            <p class="text-muted text-sm">Data pendaftaran akan muncul saat ada yang mendaftar</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-muted">
                <tr>
                  <th class="text-left p-3 text-sm font-medium">No. Pendaftaran</th>
                  <th class="text-left p-3 text-sm font-medium">Nama</th>
                  <th class="text-left p-3 text-sm font-medium">Pesantren</th>
                  <th class="text-left p-3 text-sm font-medium">Status</th>
                  <th class="text-left p-3 text-sm font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in pendaftaran" :key="p.id" class="border-b border-border hover:bg-muted/50">
                  <td class="p-3 text-sm">{{ p.nomor_pendaftaran }}</td>
                  <td class="p-3 text-sm">{{ p.nama_lengkap }}</td>
                  <td class="p-3 text-sm">{{ p.pesantren?.nama || '-' }}</td>
                  <td class="p-3">
                    <span class="badge" :class="statusBadge(p.status)">{{ p.status }}</span>
                  </td>
                  <td class="p-3">
                    <router-link :to="`/admin/pendaftaran/${p.id}`" class="btn btn-sm btn-outline-primary">Detail</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

<div v-if="activeTab === 'pesantren'">
          <AdminPesantrenManagement />
        </div>

        <div v-if="activeTab === 'users'">
          <div class="text-center py-5">
            <p class="text-muted">Manajemen User</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { admin } from '../../services'
import AdminPesantrenManagement from './AdminPesantrenManagement.vue'

const activeTab = ref('pendaftaran')
const stats = ref({})
const pendaftaran = ref([])
const loadingPendaftaran = ref(false)
const exporting = ref(false)

const pendingCount = computed(() => {
  return pendaftaran.value.filter(p => p.status === 'pending').length
})

const diprosesCount = computed(() => {
  return pendaftaran.value.filter(p => p.status === 'diproses').length
})

function statusBadge(status) {
  const map = {
    pending: 'bg-[#fef9c3] text-[#854d0e]',
    diproses: 'bg-[#dbeafe] text-[#1e40af]',
    diterima: 'bg-[#dcfce7] text-[#166534]',
    ditolak: 'bg-[#fee2e2] text-[#991b1b]'
  }
  return map[status] || 'bg-[#f3f4f6] text-[#1f2937]'
}

async function fetchStats() {
  try {
    const { data } = await admin.getStats()
    stats.value = data.data
  } catch (e) {
    console.error(e)
  }
}

async function fetchPendaftaran() {
  loadingPendaftaran.value = true
  try {
    const { data } = await admin.getPendaftaran()
    pendaftaran.value = data.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loadingPendaftaran.value = false
  }
}

async function exportData() {
  exporting.value = true
  try {
    const response = await admin.exportPendaftaran()
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'pendaftaran.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (e) {
    console.error(e)
  } finally {
    exporting.value = false
  }
}

onMounted(async () => {
  await fetchStats()
  await fetchPendaftaran()
})
</script>

<style scoped>
/* All styles converted to Tailwind utilities */
</style>
