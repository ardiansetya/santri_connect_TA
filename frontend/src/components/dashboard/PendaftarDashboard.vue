<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="card border-l-4 border-l-primary">
        <div class="p-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-muted text-sm mb-1">Pendaftaran Aktif</p>
              <h3 class="font-bold mb-0">{{ stats.pending }}</h3>
            </div>
            <div class="text-4xl text-primary opacity-50">📋</div>
          </div>
        </div>
      </div>
      <div class="card border-l-4 border-l-green-500">
        <div class="p-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-muted text-sm mb-1">Diterima</p>
              <h3 class="font-bold mb-0">{{ stats.diterima }}</h3>
            </div>
            <div class="text-4xl text-green-500 opacity-50">✅</div>
          </div>
        </div>
      </div>
      <div class="card border-l-4 border-l-blue-500">
        <div class="p-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-muted text-sm mb-1">Total Pendaftaran</p>
              <h3 class="font-bold mb-0">{{ stats.total }}</h3>
            </div>
            <div class="text-4xl text-blue-500 opacity-50">📊</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <div class="card">
          <div class="p-4 border-b border-border">
            <h5 class="font-semibold mb-0">Riwayat Pendaftaran</h5>
          </div>
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted text-sm">Memuat data...</p>
          </div>
          <div v-else-if="pendaftaran.length === 0" class="text-center py-6">
            <p class="text-3xl mb-3">📭</p>
            <h6 class="font-semibold">Belum ada pendaftaran</h6>
            <p class="text-muted text-sm mb-4">Mulai daftarkan diri Anda ke pesantren pilihan</p>
            <router-link to="/pesantren" class="btn btn-primary">Cari Pesantren</router-link>
          </div>
          <div v-else>
            <div
              v-for="p in pendaftaran"
              :key="p.id"
              class="p-4 border-b border-border"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h6 class="font-semibold mb-1">{{ p.pesantren?.nama || 'Pesantren' }}</h6>
                  <p class="text-muted text-sm mb-1">No: {{ p.nomor_pendaftaran }}</p>
                  <p class="text-muted text-xs">{{ formatDate(p.created_at) }}</p>
                </div>
                <div class="text-right">
                  <span class="badge" :class="statusBadge(p.status)">{{ statusLabel(p.status) }}</span>
                  <br>
                  <router-link
                    v-if="p.nomor_pendaftaran"
                    to="/track"
                    class="text-primary text-sm mt-2 inline-block"
                  >
                    Detail →
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="card">
          <div class="p-4 border-b border-border">
            <h5 class="font-semibold mb-0">Aksi Cepat</h5>
          </div>
          <div class="p-4">
            <div class="flex flex-col gap-2">
              <router-link to="/pesantren" class="btn btn-outline-primary text-left">
                🔍 Cari Pesantren
              </router-link>
              <router-link to="/rekomendasi" class="btn btn-outline text-left">
                📊 Dapatkan Rekomendasi
              </router-link>
              <router-link to="/compare" class="btn btn-outline text-left">
                ⚖️ Bandingkan Pesantren
              </router-link>
              <router-link to="/track" class="btn btn-outline text-left">
                📋 Cek Status Pendaftaran
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { admin } from '../../services'

const stats = ref({ pending: 0, diterima: 0, total: 0 })
const pendaftaran = ref([])
const loading = ref(true)

function statusBadge(status) {
  const map = {
    pending: 'bg-warning text-dark',
    diproses: 'bg-info',
    diterima: 'bg-success',
    ditolak: 'bg-danger'
  }
  return map[status] || 'bg-secondary'
}

function statusLabel(status) {
  const map = {
    pending: 'Pending',
    diproses: 'Diproses',
    diterima: 'Diterima',
    ditolak: 'Ditolak'
  }
  return map[status] || status
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await admin.getPendaftaran()
    pendaftaran.value = data.data || []
    // Update stats based on fetched data
    stats.value = {
      pending: pendaftaran.value.filter(p => p.status === 'pending').length,
      diterima: pendaftaran.value.filter(p => p.status === 'diterima').length,
      total: pendaftaran.value.length
    }
  } catch (error) {
    console.error('Failed to load pendaftaran data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.border-l-4 {
  border-left-width: 4px;
}
.border-l-primary {
  border-left-color: hsl(231 84% 60%);
}
.border-l-green-500 {
  border-left-color: #22c55e;
}
.border-l-blue-500 {
  border-left-color: #3b82f6;
}
.text-green-500 {
  color: #22c55e;
}
.text-blue-500 {
  color: #3b82f6;
}
.border-b {
  border-bottom: 1px solid hsl(var(--border));
}
.text-right {
  text-align: right;
}
.text-left {
  text-align: left;
}
.bg-yellow-100 {
  background-color: #fef9c3 !important;
}
.text-yellow-800 {
  color: #854d0e !important;
}
.bg-blue-100 {
  background-color: #dbeafe !important;
}
.text-blue-800 {
  color: #1e40af !important;
}
.bg-green-100 {
  background-color: #dcfce7 !important;
}
.text-green-800 {
  color: #166534 !important;
}
.bg-red-100 {
  background-color: #fee2e2 !important;
}
.text-red-800 {
  color: #991b1b !important;
}
.bg-gray-100 {
  background-color: #f3f4f6 !important;
}
.text-gray-800 {
  color: #1f2937 !important;
}
</style>
