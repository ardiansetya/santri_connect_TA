<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
        <p class="mt-6 text-muted text-lg">Memuat data pesantren...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20 card border-0 shadow-lg max-w-2xl mx-auto">
        <div class="py-8">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="font-semibold text-2xl mb-2">Gagal memuat data</h3>
          <p class="text-muted mb-6">{{ error }}</p>
          <router-link to="/pesantren" class="btn btn-primary px-6 py-2">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Kembali ke Daftar Pesantren
          </router-link>
        </div>
      </div>

      <!-- Detail Content -->
      <template v-else-if="pesantren">
        <!-- Breadcrumb -->
        <nav class="mb-6 flex items-center gap-2 text-sm">
          <router-link to="/pesantren" class="text-primary hover:underline flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Daftar Pesantren
          </router-link>
          <svg class="w-4 h-4 text-muted" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-muted truncate">{{ pesantren.nama }}</span>
        </nav>

        <!-- Hero Section with Image -->
        <div class="card border-0 shadow-xl overflow-hidden mb-6">
          <div class="relative">
            <div v-if="pesantren.foto_utama" class="aspect-video md:aspect-[21/9] overflow-hidden">
              <img
                :src="`/uploads/pesantrenImages/${pesantren.foto_utama}`"
                :alt="pesantren.nama"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
            <div v-else class="aspect-video md:aspect-[21/9] bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center">
              <div class="text-center">
                <div class="text-7xl mb-4">🕌</div>
                <p class="text-muted text-lg">Foto belum tersedia</p>
              </div>
            </div>
            
            <!-- Overlay Content -->
            <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                      {{ pesantren.kurikulum || 'Umum' }}
                    </span>
                  </div>
                  <h1 class="font-bold text-3xl md:text-4xl mb-2">{{ pesantren.nama }}</h1>
                  <div class="flex items-center gap-2 text-white/90">
                    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.5l-4.95-4.55a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    <span>{{ pesantren.kota }}, {{ pesantren.province }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - Main Info -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Quick Stats -->
            <div class="card border-0 shadow-lg">
              <div class="p-6">
                <h2 class="font-bold text-xl mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Informasi Umum
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div v-if="pesantren.tahun_berdiri" class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div class="text-3xl font-bold text-primary mb-1">{{ pesantren.tahun_berdiri }}</div>
                    <div class="text-sm text-muted">Tahun Berdiri</div>
                  </div>
                  <div v-if="pesantren.jumlah_santri" class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div class="text-3xl font-bold text-green-600 mb-1">{{ formatNumber(pesantren.jumlah_santri) }}</div>
                    <div class="text-sm text-muted">Santri Aktif</div>
                  </div>
                  <div v-if="pesantren.jumlah_pengajar" class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div class="text-3xl font-bold text-purple-600 mb-1">{{ formatNumber(pesantren.jumlah_pengajar) }}</div>
                    <div class="text-sm text-muted">Pengajar</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Biaya Pendidikan -->
            <div v-if="pesantren.biaya_pendaftaran || pesantren.biaya_bulanan" class="card border-0 shadow-lg">
              <div class="p-6">
                <h2 class="font-bold text-xl mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Biaya Pendidikan
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-if="pesantren.biaya_pendaftaran" class="p-5 border-2 border-dashed border-orange-200 bg-orange-50 rounded-xl">
                    <div class="text-sm text-muted mb-2">Biaya Pendaftaran</div>
                    <div class="text-2xl font-bold text-orange-600">{{ formatCurrency(pesantren.biaya_pendaftaran) }}</div>
                  </div>
                  <div v-if="pesantren.biaya_bulanan" class="p-5 border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl">
                    <div class="text-sm text-muted mb-2">Biaya Bulanan</div>
                    <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(pesantren.biaya_bulanan) }}</div>
                    <div class="text-xs text-muted mt-1">per bulan</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fasilitas -->
            <div v-if="pesantren.fasilitas && pesantren.fasilitas.length" class="card border-0 shadow-lg">
              <div class="p-6">
                <h2 class="font-bold text-xl mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  Fasilitas
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div v-for="f in pesantren.fasilitas" :key="f" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span class="text-sm font-medium">{{ f }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Kontak & Informasi -->
            <div v-if="pesantren.telepon || pesantren.email || pesantren.website || pesantren.deskripsi" class="card border-0 shadow-lg">
              <div class="p-6">
                <h2 class="font-bold text-xl mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Informasi Lainnya
                </h2>
                
                <!-- Contact Grid -->
                <div v-if="pesantren.telepon || pesantren.email || pesantren.website" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div v-if="pesantren.telepon" class="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs text-muted">Telepon</div>
                      <div class="font-medium text-sm">{{ pesantren.telepon }}</div>
                    </div>
                  </div>
                  <div v-if="pesantren.email" class="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs text-muted">Email</div>
                      <div class="font-medium text-sm">{{ pesantren.email }}</div>
                    </div>
                  </div>
                  <div v-if="pesantren.website" class="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs text-muted">Website</div>
                      <a :href="pesantren.website" target="_blank" class="font-medium text-sm text-primary hover:underline truncate block max-w-[150px]">{{ pesantren.website }}</a>
                    </div>
                  </div>
                </div>

                <!-- Deskripsi -->
                <div v-if="pesantren.deskripsi">
                  <h3 class="font-semibold mb-3">Deskripsi Pesantren</h3>
                  <div class="prose max-w-none">
                    <p class="text-muted whitespace-pre-line leading-relaxed">{{ pesantren.deskripsi }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Action Card -->
            <div class="card border-0 shadow-lg sticky" style="top: 6rem;">
              <div class="p-6">
                <h3 class="font-bold text-lg mb-4">Aksi Cepat</h3>
                
                <div class="space-y-3">
                  <button
                    class="btn w-full py-3"
                    :class="compareStore.isSelected(pesantren.id) ? 'bg-green-500 text-white hover:bg-green-600' : 'btn-outline-primary'"
                    @click="toggleCompare"
                  >
                    <svg v-if="!compareStore.isSelected(pesantren.id)" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                    </svg>
                    <svg v-else class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    {{ compareStore.isSelected(pesantren.id) ? '✓ Dalam Perbandingan' : '⚖️ Bandingkan' }}
                  </button>
                  
                  <router-link v-if="compareStore.hasItems" to="/compare" class="btn btn-outline w-full py-3">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    Lihat Perbandingan ({{ compareStore.count }})
                  </router-link>

                  <div class="border-t border-border pt-4 mt-4">
                    <router-link to="/pesantren" class="btn btn-outline w-full py-3">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                      </svg>
                      Kembali ke Daftar
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Pendaftaran Info -->
              <div v-if="pendaftaranInfo" class="p-6 border-t border-border">
                <h4 class="font-semibold mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Status Pendaftaran
                </h4>
                <div class="space-y-3">
                  <div v-if="pendaftaranInfo.biaya_pendaftaran" class="flex justify-between py-2 border-b border-border">
                    <span class="text-muted text-sm">Biaya</span>
                    <span class="font-semibold">{{ formatCurrency(pendaftaranInfo.biaya_pendaftaran) }}</span>
                  </div>
                  <div v-if="pendaftaranInfo.status_pendaftaran" class="flex justify-between py-2 border-b border-border">
                    <span class="text-muted text-sm">Status</span>
                    <span class="badge px-2 py-1 text-xs font-semibold" :class="statusBadge(pendaftaranInfo.status_pendaftaran)">
                      {{ pendaftaranInfo.status_pendaftaran }}
                    </span>
                  </div>
                  <div v-if="pendaftaranInfo.catatan_admin" class="p-3 bg-blue-50 rounded-lg">
                    <div class="text-xs text-muted mb-1">Catatan Admin:</div>
                    <p class="text-sm">{{ pendaftaranInfo.catatan_admin }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCompareStore } from '../stores/compare'
import { publicApi, auth, pendaftaran } from '../services'

const route = useRoute()
const compareStore = useCompareStore()

const pesantren = ref(null)
const loading = ref(true)
const error = ref('')
const pendaftaranInfo = ref(null)

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function statusBadge(status) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    diproses: 'bg-blue-100 text-blue-800',
    diterima: 'bg-green-100 text-green-800',
    ditolak: 'bg-red-100 text-red-800'
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}

function toggleCompare() {
  if (compareStore.isSelected(pesantren.value.id)) {
    compareStore.remove(pesantren.value.id)
  } else {
    compareStore.add(pesantren.value.id)
  }
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await publicApi.getPesantren({ id: route.params.id })
    pesantren.value = data.data[0]
    if (!pesantren.value) {
      error.value = 'Pesantren tidak ditemukan'
    }
  } catch (e) {
    error.value = 'Gagal memuat data pesantren'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function checkPendaftaran() {
  if (!auth.loggedIn) return
  try {
    const { data } = await pendaftaran.my()
    const match = (data.data || []).find(p => p.pesantren?.id === parseInt(route.params.id))
    if (match) {
      pendaftaranInfo.value = match
    }
  } catch (e) {
    // ignore
  }
}

onMounted(async () => {
  await fetchData()
  await checkPendaftaran()
})
</script>

<style scoped>
.sticky {
  position: sticky;
}
.prose {
  line-height: 1.75;
}
</style>
