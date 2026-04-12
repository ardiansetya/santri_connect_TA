<template>
  <div class="list-page paper-texture min-h-screen pb-20">
    <div class="pattern-overlay"></div>
    
    <!-- Hero Header -->
    <section class="bg-hero-gradient relative pt-24 pb-16 mb-10 overflow-hidden">
      <div class="container relative z-10 text-center">
        <h1 class="font-heading text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
          Jelajahi <span class="italic text-accent-light">Pesantren</span>
        </h1>
        <p class="text-white/80 max-w-2xl mx-auto text-lg animate-slide-up delay-1">
          Temukan pesantren terbaik untuk masa depan putra-putri Anda sesuai kurikulum, lokasi, dan fasilitas.
        </p>
      </div>
    </section>

    <div class="container relative z-10">
      <!-- Main Layout: Sidebar + Content -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Left Sidebar - Filters -->
        <div class="lg:col-span-1">
          <div class="card sticky top-24 z-20 animate-slide-up delay-2">
            <div class="p-6">
              <h3 class="font-heading text-xl font-bold flex items-center gap-2 mb-6 text-foreground">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                Filter & Cari
              </h3>
              
              <div class="space-y-5">
                <div>
                  <label class="form-label">Provinsi</label>
                  <div class="relative">
                    <select class="form-input appearance-none !pr-10" v-model="filters.province" @change="onProvinceChange">
                      <option value="">Semua Provinsi</option>
                      <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label class="form-label">Kota / Kabupaten</label>
                  <div class="relative">
                    <select class="form-input appearance-none !pr-10" v-model="filters.kota" @change="fetchData" :disabled="!cities.length">
                      <option value="">Semua Kota</option>
                      <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label class="form-label">Kurikulum</label>
                  <div class="relative">
                    <select class="form-input appearance-none !pr-10" v-model="filters.kurikulum" @change="fetchData">
                      <option value="">Semua Kurikulum</option>
                      <option value="modern">Modern</option>
                      <option value="salaf">Salaf</option>
                      <option value="campuran">Campuran</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div class="border-t border-border pt-5 mt-5">
                  <label class="form-label">Urutkan Berdasarkan</label>
                  <div class="relative mb-3">
                    <select class="form-input appearance-none !pr-10" v-model="sortField" @change="fetchData">
                      <option value="">Default (Relevansi)</option>
                      <option value="nama">Nama Pesantren</option>
                      <option value="tahun_berdiri">Tahun Berdiri</option>
                      <option value="jumlah_santri">Jumlah Santri</option>
                      <option value="biaya_bulanan">Biaya Bulanan</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  
                  <div class="flex gap-2">
                    <label class="flex-1 cursor-pointer">
                      <input type="radio" name="sortOrder" value="asc" v-model="sortOrder" @change="fetchData" class="sr-only peer">
                      <div class="text-center py-2 border rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-colors text-sm font-medium">Naik</div>
                    </label>
                    <label class="flex-1 cursor-pointer">
                      <input type="radio" name="sortOrder" value="desc" v-model="sortOrder" @change="fetchData" class="sr-only peer">
                      <div class="text-center py-2 border rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-colors text-sm font-medium">Turun</div>
                    </label>
                  </div>
                </div>

                <button 
                  class="btn btn-outline w-full mt-4 justify-center py-2.5"
                  @click="resetFilters"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <!-- Loading State -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
            <p class="mt-4 text-muted-foreground font-medium">Mencari pesantren terbaik...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="pesantren.length === 0" class="text-center py-20 card flex flex-col items-center animate-fade-in">
            <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <h3 class="font-heading text-2xl font-bold text-foreground mb-2">Pencarian Tidak Ditemukan</h3>
            <p class="text-muted-foreground mb-6 max-w-md">Kami tidak dapat menemukan pesantren yang cocok dengan filter yang Anda pilih. Coba sesuaikan kriteria pencarian Anda.</p>
            <button class="btn btn-primary" @click="resetFilters">Reset Pencarian</button>
          </div>

          <!-- Results Grid -->
          <div v-else class="animate-fade-in delay-3">
            <!-- Results Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center justify-center rounded-full bg-primary text-white px-3 py-1 font-bold shadow-sm">
                  {{ totalRecords }}
                </span>
                <span class="text-foreground font-medium">Pesantren tersedia</span>
              </div>
              <router-link v-if="compareStore.hasItems" to="/compare" class="btn btn-outline border-accent text-accent hover:bg-accent/10">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Bandingkan Pilihan ({{ compareStore.count }})
              </router-link>
            </div>

            <!-- Cards -->
            <div class="pesantren-grid mb-10">
              <div v-for="p in pesantren" :key="p.id" class="card group overflow-hidden flex flex-col h-full">
                <router-link :to="`/pesantren/${p.id}`" class="block relative aspect-video overflow-hidden border-b border-border">
                  <img
                    :src="p.foto_utama ? getUploadUrl(p.foto_utama) : 'https://placehold.co/600x400/0D4F4F/D4A843?text=Pesantren&font=playfair-display'"
                    :alt="p.nama"
                    class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="absolute left-3 top-3 px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    {{ p.kurikulum || 'Modern' }}
                  </span>
                </router-link>
                
                <div class="p-5 flex-1 flex flex-col">
                  <router-link :to="`/pesantren/${p.id}`" class="block mb-2 group-hover:text-primary transition-colors">
                    <h3 class="font-heading text-xl font-bold line-clamp-1" :title="p.nama">{{ p.nama }}</h3>
                  </router-link>
                  
                  <div class="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                    <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span class="line-clamp-1">{{ p.kota }}, {{ p.province }}</span>
                  </div>
                  
                  <div class="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <p class="text-xs text-muted-foreground mb-0.5">Biaya Bulanan</p>
                      <p class="font-bold text-primary">{{ formatCurrencyShort(p.biaya_bulanan) }}</p>
                    </div>
                    
                    <!-- Compare Toggle -->
                    <button
                      @click.prevent="toggleCompare(p.id)"
                      class="w-10 h-10 rounded-full flex items-center justify-center transition-all border shrink-0"
                      :class="compareStore.isSelected(p.id) ? 'bg-accent border-accent text-white shadow-md' : 'bg-surface border-border text-muted-foreground hover:border-accent hover:text-accent'"
                      :title="compareStore.isSelected(p.id) ? 'Telah ditambahkan ke perbandingan' : 'Tambahkan ke perbandingan'"
                    >
                      <svg v-if="compareStore.isSelected(p.id)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <nav v-if="totalPages > 1" class="flex justify-center mt-12 mb-8">
              <div class="inline-flex bg-card border border-border rounded-lg shadow-sm overflow-hidden p-1">
                <button 
                  class="px-4 py-2 text-primary hover:bg-muted font-medium rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none" 
                  :disabled="currentPage <= 1"
                  @click="changePage(currentPage - 1)"
                >
                  <span class="sr-only">Previous</span>
                  &larr; Prev
                </button>
                <div class="flex items-center px-4 font-heading font-medium border-x border-border/50">
                  <span class="text-foreground">{{ currentPage }}</span>
                  <span class="text-muted-foreground mx-1">dari</span>
                  <span class="text-foreground">{{ totalPages }}</span>
                </div>
                <button 
                  class="px-4 py-2 text-primary hover:bg-muted font-medium rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none" 
                  :disabled="currentPage >= totalPages"
                  @click="changePage(currentPage + 1)"
                >
                  <span class="sr-only">Next</span>
                  Next &rarr;
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
import { getUploadUrl } from '../services/api'
import { useCompareStore } from '../stores/compare'

const compareStore = useCompareStore()

const pesantren = ref([])
const loading = ref(true)
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

function formatCurrencyShort(amount) {
  if (!amount) return 'Hubungi Pesantren'
  if (amount >= 1000000) {
    return 'Rp ' + (amount / 1000000).toFixed(1).replace('.0', '') + 'jt/bln'
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount) + '/bln'
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
  
  // Scroll to top of list smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
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
