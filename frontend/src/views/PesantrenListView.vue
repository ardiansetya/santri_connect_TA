<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 pt-10 pb-8">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="font-bold text-3xl mb-2 text-primary">
          Jelajahi Pesantren
        </h1>
        <p class="text-muted text-base">Temukan pesantren terbaik untuk masa depan putra-putri Anda</p>
      </div>

      <!-- Main Layout: Sidebar + Content -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Left Sidebar - Filters -->
        <div class="lg:col-span-1">
          <div class="card border-0 shadow-lg sticky top-24">
            <div class="p-5">
              <h3 class="font-semibold text-base flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                Filter & Pencarian
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="form-label text-sm font-medium mb-1.5 block">Provinsi</label>
                  <select class="form-select w-full" v-model="filters.province" @change="onProvinceChange">
                    <option value="">Semua Provinsi</option>
                    <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="form-label text-sm font-medium mb-1.5 block">Kota</label>
                  <select class="form-select w-full" v-model="filters.kota" @change="fetchData" :disabled="!cities.length">
                    <option value="">Semua Kota</option>
                    <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="form-label text-sm font-medium mb-1.5 block">Kurikulum</label>
                  <select class="form-select w-full" v-model="filters.kurikulum" @change="fetchData">
                    <option value="">Semua Kurikulum</option>
                    <option value="modern">Modern</option>
                    <option value="salaf">Salaf</option>
                    <option value="campuran">Campuran</option>
                  </select>
                </div>

                <div class="border-t border-border pt-4 mt-4">
                  <label class="form-label text-sm font-medium mb-1.5 block">Urutkan</label>
                  <select class="form-select w-full" v-model="sortField" @change="fetchData">
                    <option value="">Default</option>
                    <option value="nama">Nama</option>
                    <option value="tahun_berdiri">Tahun Berdiri</option>
                    <option value="jumlah_santri">Jumlah Santri</option>
                    <option value="biaya_bulanan">Biaya Bulanan</option>
                  </select>
                </div>

                <div>
                  <label class="form-label text-sm font-medium mb-1.5 block">Urutan</label>
                  <select class="form-select w-full" v-model="sortOrder" @change="fetchData">
                    <option value="asc">Naik (A-Z)</option>
                    <option value="desc">Turun (Z-A)</option>
                  </select>
                </div>

                <button 
                  class="btn btn-outline w-full py-2 mt-2 text-sm"
                  @click="resetFilters"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - Results -->
        <div class="lg:col-span-3">
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p class="mt-4 text-muted text-lg">Memuat data pesantren...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="pesantren.length === 0" class="text-center py-16 card border-0 shadow-lg">
        <div class="py-8">
          <div class="text-6xl mb-4">🕌</div>
          <h3 class="font-semibold text-2xl mb-2">Tidak ada pesantren ditemukan</h3>
          <p class="text-muted text-lg">Coba ubah filter atau kata kunci pencarian Anda</p>
        </div>
      </div>

      <!-- Results -->
      <div v-else>
        <!-- Results Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
              {{ totalRecords }} Pesantren
            </span>
            <span class="text-muted text-sm">ditemukan</span>
          </div>
          <router-link v-if="compareStore.hasItems" to="/compare" class="btn btn-primary flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Bandingkan ({{ compareStore.count }})
          </router-link>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="p in pesantren" :key="p.id" 
               class="group card border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div class="relative">
              <!-- Foto Utama -->
              <div v-if="p.foto_utama" class="aspect-video overflow-hidden">
                <img
                  :src="`/uploads/pesantrenImages/${p.foto_utama}`"
                  :alt="p.nama"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div v-else class="aspect-video bg-gray-100 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl mb-2">🏫</div>
                  <span class="text-muted text-sm">Foto belum tersedia</span>
                </div>
              </div>
              
              <!-- Badge Overlay -->
              <div class="absolute top-3 right-3">
                <span class="badge px-3 py-1.5 text-xs font-semibold shadow-md" :class="kurikulumBadge(p.kurikulum)">
                  {{ p.kurikulum || 'Umum' }}
                </span>
              </div>
            </div>

            <div class="p-5">
              <h3 class="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {{ p.nama }}
              </h3>
              
              <div class="flex items-center gap-1 text-muted text-sm mb-4">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.5l-4.95-4.55a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
                <span class="truncate">{{ p.kota }}, {{ p.province }}</span>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-3 gap-3 mb-4">
                <div v-if="p.jumlah_santri" class="text-center p-2 bg-blue-50 rounded-lg">
                  <div class="font-bold text-sm text-primary">{{ formatNumber(p.jumlah_santri) }}</div>
                  <div class="text-xs text-muted">Santri</div>
                </div>
                <div v-if="p.jumlah_pengajar" class="text-center p-2 bg-green-50 rounded-lg">
                  <div class="font-bold text-sm text-green-600">{{ formatNumber(p.jumlah_pengajar) }}</div>
                  <div class="text-xs text-muted">Pengajar</div>
                </div>
                <div v-if="p.biaya_bulanan" class="text-center p-2 bg-orange-50 rounded-lg">
                  <div class="font-bold text-xs text-orange-600 truncate">{{ formatCurrencyShort(p.biaya_bulanan) }}</div>
                  <div class="text-xs text-muted">/bulan</div>
                </div>
              </div>

              <!-- Fasilitas -->
              <div v-if="p.fasilitas && p.fasilitas.length" class="flex flex-wrap gap-1.5 mb-4 min-h-[2rem]">
                <span v-for="f in p.fasilitas.slice(0, 3)" :key="f" class="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                  {{ f }}
                </span>
                <span v-if="p.fasilitas.length > 3" class="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">
                  +{{ p.fasilitas.length - 3 }}
                </span>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <router-link :to="`/pesantren/${p.id}`" class="btn btn-primary flex-1 text-sm py-2">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Detail
                </router-link>
                <button
                  class="btn px-3 py-2 transition-all"
                  :class="compareStore.isSelected(p.id) ? 'bg-primary text-white' : 'btn-outline'"
                  @click="toggleCompare(p.id)"
                  :title="compareStore.isSelected(p.id) ? 'Hapus dari perbandingan' : 'Bandingkan'"
                >
                  <svg v-if="compareStore.isSelected(p.id)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <nav class="flex justify-center">
          <div class="flex items-center gap-2">
            <button 
              class="btn btn-outline px-4 py-2" 
              :disabled="currentPage <= 1"
              @click="changePage(currentPage - 1)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <span class="px-4 py-2 text-sm font-medium">
              Halaman {{ currentPage }} / {{ totalPages }}
            </span>
            <button 
              class="btn btn-outline px-4 py-2" 
              :disabled="currentPage >= totalPages"
              @click="changePage(currentPage + 1)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </nav>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { pesantren as pesantrenApi, wilayah } from '../services'
import { useCompareStore } from '../stores/compare'

const compareStore = useCompareStore()

const pesantren = ref([])
const loading = ref(false)
const provinces = ref([])
const cities = ref([])
const currentPage = ref(1)
const limit = ref(12)
const totalRecords = ref(0)
const sortField = ref('')
const sortOrder = ref('asc')

const filters = ref({
  province: '',
  kota: '',
  kurikulum: ''
})

const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value))

function formatNumber(num) {
  if (!num) return '-'
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function formatCurrencyShort(amount) {
  if (!amount) return '-'
  if (amount >= 1000000) {
    return 'Rp ' + (amount / 1000000).toFixed(1).replace('.0', '') + 'jt'
  }
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(amount)
}

function kurikulumBadge(kurikulum) {
  const map = {
    modern: 'bg-[hsl(231 84% 60%)] text-white',
    salaf: 'bg-[#10b981] text-white',
    campuran: 'bg-[#f59e0b] text-white'
  }
  return map[kurikulum] || 'bg-gray-500 text-white'
}

function toggleCompare(id) {
  if (compareStore.isSelected(id)) {
    compareStore.remove(id)
  } else {
    compareStore.add(id)
  }
}

function resetFilters() {
  filters.value = {
    province: '',
    kota: '',
    kurikulum: ''
  }
  sortField.value = ''
  sortOrder.value = 'asc'
  cities.value = []
  fetchData()
}

async function fetchProvinces() {
  try {
    const { data } = await wilayah.getProvinces()
    provinces.value = data.data || []
  } catch {
    provinces.value = []
  }
}

async function onProvinceChange() {
  filters.value.kota = ''
  cities.value = []
  if (!filters.value.province) {
    await fetchData()
    return
  }
  try {
    const province = provinces.value.find(p => p.name === filters.value.province)
    if (province) {
      const { data } = await wilayah.getRegencies(province.id)
      cities.value = (data.data || []).map(r => r.name)
    }
  } catch {
    cities.value = []
  }
  await fetchData()
}

async function fetchData() {
  loading.value = true
  currentPage.value = 1
  try {
    const params = {
      page: 1,
      limit: limit.value,
      sort: sortField.value || undefined,
      order: sortOrder.value
    }
    if (filters.value.province) params.province = filters.value.province
    if (filters.value.kota) params.kota = filters.value.kota
    if (filters.value.kurikulum) params.kurikulum = filters.value.kurikulum

    const { data } = await pesantrenApi.list(params)
    pesantren.value = data.data || []
    totalRecords.value = data.meta?.total || data.data?.length || 0
  } catch {
    pesantren.value = []
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

async function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loading.value = true
  try {
    const params = {
      page,
      limit: limit.value,
      sort: sortField.value || undefined,
      order: sortOrder.value
    }
    if (filters.value.province) params.province = filters.value.province
    if (filters.value.kota) params.kota = filters.value.kota
    if (filters.value.kurikulum) params.kurikulum = filters.value.kurikulum

    const { data } = await pesantrenApi.list(params)
    pesantren.value = data.data || []
  } catch {
    pesantren.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchProvinces()
  await fetchData()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
