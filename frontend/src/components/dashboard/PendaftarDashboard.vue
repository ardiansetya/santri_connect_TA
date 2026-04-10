<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="card" style="border-left: 4px solid hsl(231 84% 60%)">
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
      <div class="card" style="border-left: 4px solid #22c55e">
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
      <div class="card" style="border-left: 4px solid #3b82f6">
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
          <div v-else-if="pendaftaranList.length === 0" class="text-center py-6">
            <p class="text-3xl mb-3">📭</p>
            <h6 class="font-semibold">Belum ada pendaftaran</h6>
            <p class="text-muted text-sm mb-4">Mulai daftarkan diri Anda ke pesantren pilihan</p>
            <router-link to="/pesantren" class="btn btn-primary">Cari Pesantren</router-link>
          </div>
          <div v-else>
            <div
              v-for="p in pendaftaranList"
              :key="p.id"
              class="p-4 border-b border-border"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h6 class="font-semibold mb-1">{{ p.pesantren?.nama || 'Pesantren' }}</h6>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-muted text-sm font-mono">No: {{ p.nomor_pendaftaran }}</span>
                    <button
                      @click="copyNomor(p.nomor_pendaftaran)"
                      class="inline-flex items-center justify-center p-1 rounded hover:bg-muted transition-colors text-muted hover:text-primary"
                      title="Salin nomor pendaftaran"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
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
import { pendaftaran } from '../../services'
import { useToast } from 'vue-toastification'

const toast = useToast()
const stats = ref({ pending: 0, diterima: 0, total: 0 })
const pendaftaranList = ref([])
const loading = ref(true)

function statusBadge(status) {
  const map = {
    pending: 'bg-[#fef9c3] text-[#854d0e]',
    diproses: 'bg-[#dbeafe] text-[#1e40af]',
    diterima: 'bg-[#dcfce7] text-[#166534]',
    ditolak: 'bg-[#fee2e2] text-[#991b1b]'
  }
  return map[status] || 'bg-[#f3f4f6] text-[#1f2937]'
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

async function copyNomor(nomor) {
  try {
    await navigator.clipboard.writeText(nomor)
    toast.success(`Nomor "${nomor}" berhasil disalin`, { title: 'Berhasil Disalin' })
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = nomor
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      toast.success(`Nomor "${nomor}" berhasil disalin`, { title: 'Berhasil Disalin' })
    } catch (e) {
      toast.error('Gagal menyalin nomor pendaftaran', { title: 'Gagal' })
    }
    document.body.removeChild(textArea)
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await pendaftaran.getMyRegistrations()
    pendaftaranList.value = data.data || []
    // Update stats based on fetched data
    stats.value = {
      pending: pendaftaranList.value.filter(p => p.status === 'pending').length,
      diterima: pendaftaranList.value.filter(p => p.status === 'diterima').length,
      total: pendaftaranList.value.length
    }
  } catch (error) {
    console.error('Failed to load pendaftaran data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* All styles using Tailwind CSS */
</style>
