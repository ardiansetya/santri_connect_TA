<template>
  <div class="py-4 md:py-5">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="font-bold text-3xl mb-2">Bandingkan Pesantren</h1>
        <p class="text-muted text-base">Bandingkan hingga 3 pesantren pilihan Anda secara detail</p>
      </div>

      <!-- Empty State -->
      <div v-if="!compareStore.hasItems" class="card border-0 shadow-lg max-w-2xl mx-auto">
        <div class="text-center py-12 px-6">
          <div class="text-7xl mb-4">⚖️</div>
          <h3 class="font-semibold text-2xl mb-2">Belum ada pesantren yang dibandingkan</h3>
          <p class="text-muted mb-6">Tambahkan pesantren dari daftar atau halaman detail</p>
          <router-link to="/pesantren" class="btn btn-primary px-6 py-2">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Cari Pesantren
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p class="mt-4 text-muted text-lg">Memuat data perbandingan...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card border-0 shadow-lg max-w-2xl mx-auto">
        <div class="text-center py-10 px-6">
          <div class="text-5xl mb-4">⚠️</div>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button class="btn btn-outline-primary px-6 py-2" @click="loadComparison">Coba Lagi</button>
        </div>
      </div>

      <!-- Results -->
      <div v-else-if="pesantrenData.length > 0">
        <!-- Header Actions -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
              {{ pesantrenData.length }} Pesantren
            </span>
            <span class="text-muted text-sm">dibandingkan</span>
          </div>
          <button class="btn bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 text-sm" @click="clearComparison">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Hapus Semua
          </button>
        </div>

        <!-- Comparison Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(p, index) in pesantrenData" 
            :key="p.id"
            class="card border-0 shadow-lg overflow-hidden"
          >
            <!-- Rank Badge -->
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white relative">
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center justify-center w-8 h-8 bg-white/20 rounded-full text-sm font-bold">
                  {{ index + 1 }}
                </span>
                <button 
                  @click="removeItem(p.id)"
                  class="text-white/80 hover:text-white transition-colors"
                  title="Hapus dari perbandingan"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <h3 class="font-bold text-lg mt-3 line-clamp-2">{{ p.nama }}</h3>
              <div class="flex items-center gap-1 mt-2 text-sm text-white/90">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.5l-4.95-4.55a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
                <span class="truncate">{{ p.kota }}, {{ p.province }}</span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 space-y-4">
              <!-- Kurikulum -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted">Kurikulum</span>
                <span class="badge px-3 py-1 text-xs font-semibold" :class="badgeClass(p.kurikulum)">
                  {{ p.kurikulum || '-' }}
                </span>
              </div>

              <div class="border-t border-border"></div>

              <!-- Tahun Berdiri -->
              <div v-if="p.tahun_berdiri" class="flex items-center justify-between">
                <span class="text-sm text-muted">Tahun Berdiri</span>
                <span class="font-semibold">{{ p.tahun_berdiri }}</span>
              </div>

              <!-- Jumlah Santri -->
              <div v-if="p.jumlah_santri" class="flex items-center justify-between">
                <span class="text-sm text-muted">Jumlah Santri</span>
                <span class="font-semibold text-blue-600">{{ formatNumber(p.jumlah_santri) }}</span>
              </div>

              <!-- Jumlah Pengajar -->
              <div v-if="p.jumlah_pengajar" class="flex items-center justify-between">
                <span class="text-sm text-muted">Jumlah Pengajar</span>
                <span class="font-semibold text-green-600">{{ formatNumber(p.jumlah_pengajar) }}</span>
              </div>

              <div class="border-t border-border"></div>

              <!-- Biaya -->
              <div>
                <div class="text-sm text-muted mb-2">Biaya Pendidikan</div>
                <div class="space-y-1.5">
                  <div v-if="p.biaya_pendaftaran" class="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                    <span class="text-xs text-muted">Pendaftaran</span>
                    <span class="font-semibold text-sm text-orange-600">{{ formatCurrency(p.biaya_pendaftaran) }}</span>
                  </div>
                  <div v-if="p.biaya_bulanan" class="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <span class="text-xs text-muted">Bulanan</span>
                    <span class="font-semibold text-sm text-blue-600">{{ formatCurrency(p.biaya_bulanan) }}</span>
                  </div>
                  <div v-if="!p.biaya_pendaftaran && !p.biaya_bulanan" class="text-muted text-sm">-</div>
                </div>
              </div>

              <div class="border-t border-border"></div>

              <!-- Fasilitas -->
              <div>
                <div class="text-sm text-muted mb-2">Fasilitas</div>
                <div v-if="p.fasilitas && p.fasilitas.length" class="flex flex-wrap gap-1.5">
                  <span v-for="f in p.fasilitas" :key="f" class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
                    {{ f }}
                  </span>
                </div>
                <div v-else class="text-muted text-sm">-</div>
              </div>

              <div class="border-t border-border"></div>

              <!-- Kontak -->
              <div>
                <div class="text-sm text-muted mb-2">Kontak</div>
                <div v-if="p.telepon || p.email" class="space-y-1.5">
                  <div v-if="p.telepon" class="flex items-center gap-2 text-sm">
                    <svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span class="truncate">{{ p.telepon }}</span>
                  </div>
                  <div v-if="p.email" class="flex items-center gap-2 text-sm">
                    <svg class="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span class="truncate">{{ p.email }}</span>
                  </div>
                </div>
                <div v-else class="text-muted text-sm">-</div>
              </div>

              <!-- Alamat -->
              <div v-if="p.alamat">
                <div class="text-sm text-muted mb-1">Alamat</div>
                <p class="text-sm text-muted line-clamp-3">{{ p.alamat }}</p>
              </div>

              <div class="border-t border-border"></div>

              <!-- Action Button -->
              <router-link :to="`/pesantren/${p.id}`" class="btn btn-primary w-full py-2.5">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Lihat Detail
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- No Data State -->
      <div v-else class="card border-0 shadow-lg max-w-2xl mx-auto">
        <div class="text-center py-12 px-6">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="font-semibold text-xl mb-2">Tidak ada data ditemukan</h3>
          <p class="text-muted">Pesantren yang dipilih mungkin sudah tidak tersedia.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCompareStore } from '../stores/compare'
import { pesantren as pesantrenApi } from '../services'

const compareStore = useCompareStore()

const pesantrenData = ref([])
const loading = ref(false)
const error = ref('')

function formatNumber(num) {
  if (!num) return '-'
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function badgeClass(kurikulum) {
  const map = {
    modern: 'bg-[hsl(231 84% 60%)] text-white',
    salaf: 'bg-[#10b981] text-white',
    campuran: 'bg-[#f59e0b] text-white'
  }
  return map[kurikulum?.toLowerCase()] || 'bg-gray-500 text-white'
}

function removeItem(id) {
  compareStore.remove(id)
  if (compareStore.hasItems) {
    loadComparison()
  } else {
    pesantrenData.value = []
  }
}

function clearComparison() {
  compareStore.clear()
  pesantrenData.value = []
}

async function loadComparison() {
  if (!compareStore.hasItems) {
    pesantrenData.value = []
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { data } = await pesantrenApi.compare(compareStore.selectedIds)
    pesantrenData.value = data.data || []
  } catch {
    error.value = 'Gagal memuat data perbandingan. Silakan coba lagi.'
    pesantrenData.value = []
  } finally {
    loading.value = false
  }
}

const unsubscribe = compareStore.$subscribe(() => {
  if (compareStore.hasItems) {
    loadComparison()
  }
})

onMounted(() => {
  if (compareStore.hasItems) {
    loadComparison()
  }
})

onUnmounted(() => {
  unsubscribe()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
