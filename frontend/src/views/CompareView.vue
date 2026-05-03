<template>
  <div class="compare-page paper-texture min-h-screen pb-20 pt-24 bg-background relative overflow-hidden">
    <div class="pattern-overlay"></div>
    <div class="container relative z-10 mx-auto px-4 lg:px-8">
      
      <!-- Header Section -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
          Bandingkan <span class="italic text-accent">Pesantren</span>
        </h1>
        <p class="text-muted-foreground max-w-xl mx-auto text-lg">
          Bandingkan hingga 3 pesantren pilihan Anda secara detail untuk menentukan opsi terbaik bagi masa depan putra-putri Anda.
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="!compareStore.hasItems" class="card shadow-xl border-border bg-white rounded-2xl animate-slide-up overflow-hidden max-w-2xl mx-auto">
        <div class="bg-gradient-to-r from-primary/10 to-accent/10 p-12 text-center flex flex-col items-center">
          <div class="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center mb-6 text-primary">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
          </div>
          <h2 class="font-heading text-2xl font-bold text-foreground mb-3">Belum ada pesantren yang dibandingkan</h2>
          <p class="text-muted-foreground mb-8 text-lg">Temukan pesantren idaman dari daftar kami, lalu klik bandingkan untuk melihat ringkasan fiturnya di halaman ini.</p>
          <router-link to="/pesantren" class="btn btn-primary px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Mulai Cari Pesantren
          </router-link>
        </div>
      </div>

      <!-- Loading State (Skeleton Table) -->
      <div v-else-if="loading" class="animate-pulse">
        <div class="bg-white rounded-2xl shadow-xl border border-border/50 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th class="p-6 bg-muted/20 w-56 sticky left-0 z-10 border-b border-border">
                    <div class="h-6 w-32 bg-muted rounded-md mb-2"></div>
                  </th>
                  <th v-for="i in 3" :key="i" class="p-6 border-b border-border min-w-[300px]">
                    <div class="border border-border/60 rounded-2xl p-5 h-64 bg-muted/10"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 5" :key="i">
                  <td class="p-5 sticky left-0 bg-white border-b border-border/60">
                    <div class="h-4 w-24 bg-muted rounded-md tracking-widest"></div>
                  </td>
                  <td v-for="j in 3" :key="j" class="p-5 border-b border-border/60">
                    <div class="h-6 w-3/4 bg-muted/20 rounded-md mx-auto"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p class="mt-6 text-center text-muted-foreground font-medium animate-bounce italic">Algoritma sedang menyeimbangkan data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card p-8 border-destructive/20 bg-destructive/5 max-w-xl mx-auto text-center">
        <div class="text-destructive mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <p class="text-destructive font-medium mb-4">{{ error }}</p>
        <button class="btn btn-outline border-destructive text-destructive" @click="loadComparison">Coba Lagi</button>
      </div>

      <div v-else-if="pesantrenData.length === 0" class="card shadow-md py-12 text-center max-w-xl mx-auto">
        <p class="text-muted-foreground">Tidak ada data terverifikasi untuk pesantren yang dipilih.</p>
      </div>

      <!-- Comparison Content -->
      <div v-else class="animate-slide-up delay-1">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-border pb-4">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-bold">
              {{ pesantrenData.length }} / 3
            </span>
            <span class="text-muted-foreground font-medium">Pesantren Dibandingkan</span>
          </div>
          <button class="btn border-destructive text-destructive bg-transparent hover:bg-destructive hover:text-destructive-foreground text-sm py-2 px-4 transition-all" @click="clearComparison">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Hapus Semua
          </button>
        </div>

        <div class="bg-white rounded-2xl shadow-2xl border border-border/50 overflow-hidden relative z-20">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left border-collapse table-fixed md:table-auto">
              <thead>
                <tr>
                  <th class="p-4 md:p-6 bg-muted/40 border-b-2 border-primary/20 w-40 md:w-56 font-heading text-xl text-primary align-middle shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)] sticky left-0 z-30 backdrop-blur-md">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                      Kriteria
                    </div>
                  </th>
                  <th v-for="p in pesantrenData" :key="p.id" class="p-4 md:p-6 bg-white border-b-2 border-primary/20 align-top min-w-[300px] sticky top-0 z-20">
                    <div class="flex flex-col h-full bg-surface border border-border/60 rounded-2xl p-4 md:p-5 relative group shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                      <button 
                        class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-border text-muted-foreground hover:bg-destructive hover:text-white hover:border-destructive shadow-lg flex items-center justify-center transition-all z-10" 
                        @click="removeItem(p.id)"
                        title="Hapus"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                      
                      <div class="aspect-video w-full rounded-xl overflow-hidden mb-4 bg-muted ring-1 ring-border shadow-inner">
                        <img 
                          v-if="p.foto_utama" 
                          :src="getUploadUrl(p.foto_utama)" 
                          :alt="p.nama" 
                          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20 text-4xl italic">SC</div>
                      </div>
                      
                      <h3 class="font-heading font-black text-xl text-center text-primary-dark mb-1 leading-tight line-clamp-1">{{ p.nama }}</h3>
                      <div class="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <svg class="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                        {{ p.kota }}
                      </div>
                      <!-- Auto-highlight Badges -->
                      <div class="flex flex-wrap justify-center gap-1.5 mb-3 min-h-[24px]">
                        <span v-if="cheapestId === p.id" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm animate-fade-in">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Termurah
                        </span>
                        <span v-if="mostFacilitiesId === p.id" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200 shadow-sm animate-fade-in">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          Terlengkap
                        </span>
                      </div>
                      
                      <router-link :to="`/pesantren/${p.id}`" class="btn btn-outline border-primary/40 text-primary w-full mt-auto text-xs font-bold tracking-widest uppercase py-2.5 transition-all hover:bg-primary hover:text-white hover:border-primary">
                        Detail Profil
                      </router-link>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border/60">
                <!-- Provinsi -->
                <tr class="hover:bg-muted/10 transition-colors group">
                  <td class="p-5 font-bold text-muted-foreground bg-muted/20 md:bg-white/90 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] sticky left-0 z-10 block md:table-cell uppercase tracking-widest text-[10px] md:text-xs backdrop-blur-sm">
                    <div class="flex items-center gap-2">
                       <span class="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">📍</span>
                       Lokasi
                    </div>
                  </td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-5 text-center">
                    <p class="font-bold text-foreground">{{ p.kota }}</p>
                    <p class="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-0.5">{{ p.province }}</p>
                  </td>
                </tr>
                
                <!-- Kurikulum -->
                <tr class="hover:bg-muted/10 transition-colors group bg-muted/5">
                  <td class="p-5 font-bold text-muted-foreground bg-muted/20 md:bg-white/90 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] sticky left-0 z-10 block md:table-cell uppercase tracking-widest text-[10px] md:text-xs backdrop-blur-sm">
                    <div class="flex items-center gap-2">
                       <span class="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-accent">📚</span>
                       Kurikulum
                    </div>
                  </td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-5 text-center">
                    <span class="inline-flex px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border-2 shadow-sm" :class="badgeClass(p.kurikulum)">
                      {{ p.kurikulum || 'Umum' }}
                    </span>
                  </td>
                </tr>
                
                <!-- Est -->
                <tr class="hover:bg-muted/10 transition-colors group">
                  <td class="p-5 font-bold text-muted-foreground bg-muted/20 md:bg-white/90 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] sticky left-0 z-10 block md:table-cell uppercase tracking-widest text-[10px] md:text-xs backdrop-blur-sm">
                    <div class="flex items-center gap-2">
                       <span class="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">🏛️</span>
                       Sejarah
                    </div>
                  </td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-5 text-center">
                    <div v-if="p.tahun_berdiri" class="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-lg shadow-sm">
                       <span class="text-xs text-muted-foreground font-medium italic">Berdiri</span>
                       <span class="font-black text-foreground">{{ p.tahun_berdiri }}</span>
                    </div>
                    <span v-else class="text-muted-foreground/40 italic text-sm">Data tidak tersedia</span>
                  </td>
                </tr>
                
                <!-- Jumlah Stats -->
                <tr class="hover:bg-muted/10 transition-colors group bg-primary/[0.03]">
                  <td class="p-5 font-bold text-primary bg-primary/10 md:bg-white/90 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] sticky left-0 z-10 block md:table-cell uppercase tracking-widest text-[10px] md:text-xs backdrop-blur-sm">
                    <div class="flex items-center gap-2">
                       <span class="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">👥</span>
                       Kapasitas
                    </div>
                  </td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-5 text-center">
                    <div class="grid grid-cols-2 gap-4 max-w-[200px] mx-auto">
                      <div class="text-center p-2 bg-white rounded-xl shadow-sm border border-border/50">
                        <p class="font-black text-xl text-primary leading-tight">{{ formatNumber(p.jumlah_santri) }}</p>
                        <p class="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Santri</p>
                      </div>
                      <div class="text-center p-2 bg-white rounded-xl shadow-sm border border-border/50">
                        <p class="font-black text-xl text-primary leading-tight">{{ formatNumber(p.jumlah_pengajar) }}</p>
                        <p class="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">SDM</p>
                      </div>
                    </div>
                  </td>
                </tr>
                
                <!-- Biaya Bulanan -->
                <tr class="hover:bg-muted/10 transition-colors group">
                  <td class="p-5 font-bold text-muted-foreground bg-muted/20 md:bg-white/90 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] sticky left-0 z-10 block md:table-cell uppercase tracking-widest text-[10px] md:text-xs backdrop-blur-sm">
                    <div class="flex items-center gap-2">
                       <span class="w-6 h-6 rounded-lg bg-success/10 flex items-center justify-center text-success">💳</span>
                       SPP Bulanan
                    </div>
                  </td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-5 text-center">
                    <div class="inline-block px-4 py-2 bg-success/[0.02] border-2 rounded-xl" :class="cheapestId === p.id ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200' : 'border-success/20'">
                      <span class="font-black text-success text-lg">{{ formatCurrency(p.biaya_bulanan) }}</span>
                    </div>
                  </td>
                </tr>
                
                <!-- Biaya Pendaftaran -->
                <tr class="hover:bg-muted/10 transition-colors group bg-muted/5">
                  <td class="p-5 font-bold text-muted-foreground bg-muted/20 md:bg-white/90 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] sticky left-0 z-10 block md:table-cell uppercase tracking-widest text-[10px] md:text-xs backdrop-blur-sm">
                    <div class="flex items-center gap-2">
                       <span class="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">📝</span>
                       Uang Pangkal
                    </div>
                  </td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-5 text-center">
                    <span class="font-bold text-foreground text-md">{{ formatCurrency(p.biaya_pendaftaran) }}</span>
                  </td>
                </tr>
                
                <!-- Fasilitas -->
                <tr class="hover:bg-muted/10 transition-colors group">
                  <td class="p-5 font-bold text-muted-foreground bg-muted/20 md:bg-white/90 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] sticky left-0 z-10 block md:table-cell uppercase tracking-widest text-[10px] md:text-xs backdrop-blur-sm align-top">
                    <div class="flex items-center gap-2 mt-2">
                       <span class="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-accent">✨</span>
                       Fasilitas
                    </div>
                  </td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-5 align-top" :class="mostFacilitiesId === p.id ? 'bg-blue-50/50' : ''">
                    <div v-if="p.fasilitas && p.fasilitas.length" class="flex flex-wrap gap-2 justify-center">
                      <span v-for="f in p.fasilitas" :key="f" class="px-3 py-1.5 text-foreground text-[11px] font-bold rounded-lg border shadow-sm transition-transform hover:scale-105" :class="mostFacilitiesId === p.id ? 'bg-blue-50 border-blue-200' : 'bg-muted/20 border-border'">
                        {{ f }}
                      </span>
                    </div>
                    <div v-else class="text-center text-muted-foreground/30 italic text-sm">Belum ada data fasilitas</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCompareStore } from '../stores/compare'
import { pesantren as pesantrenApi } from '../services'
import { getUploadUrl } from '../services/api' // Added getUploadUrl for images

const compareStore = useCompareStore()

const pesantrenData = ref([])
const loading = ref(false)
const error = ref('')

// Auto-highlight: Termurah & Terlengkap
const cheapestId = computed(() => {
  if (pesantrenData.value.length < 2) return null
  const withBiaya = pesantrenData.value.filter(p => p.biaya_pendaftaran != null && p.biaya_pendaftaran > 0)
  if (withBiaya.length < 2) return null
  return withBiaya.reduce((min, p) => p.biaya_pendaftaran < min.biaya_pendaftaran ? p : min).id
})

const mostFacilitiesId = computed(() => {
  if (pesantrenData.value.length < 2) return null
  const withFas = pesantrenData.value.filter(p => p.fasilitas && p.fasilitas.length > 0)
  if (withFas.length < 2) return null
  return withFas.reduce((max, p) => (p.fasilitas?.length || 0) > (max.fasilitas?.length || 0) ? p : max).id
})

function formatNumber(num) {
  if (!num) return '-'
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatCurrency(amount) {
  if (!amount) return 'Hubungi'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
}

function badgeClass(kurikulum) {
  const map = {
    modern: 'bg-primary text-white border-primary',
    salaf: 'bg-success text-white border-success',
    campuran: 'bg-accent text-white border-accent'
  }
  return map[kurikulum?.toLowerCase()] || 'bg-muted text-muted-foreground border-border'
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
    const requestedIds = [...compareStore.selectedIds].map(id => Number(id))
    const { data } = await pesantrenApi.compare(requestedIds)
    const results = data.data || []
    
    pesantrenData.value = results

    // Cross-check: If some IDs were not found, sync the store
    if (results.length < requestedIds.length) {
      const foundIds = results.map(p => p.id)
      requestedIds.forEach(id => {
        if (!foundIds.includes(parseInt(id, 10))) {
          console.warn(`[CompareView] Removing missing pesantren ID from store: ${id}`)
          compareStore.remove(id)
        }
      })
    }
  } catch (err) {
    const errorMsg = err.response?.data?.error || err.message
    error.value = errorMsg || 'Gagal memuat data perbandingan dari server. Silakan coba lagi.'
    pesantrenData.value = []
  } finally {
    loading.value = false
  }
}

const unsubscribe = compareStore.$subscribe(() => {
  if (compareStore.hasItems && compareStore.selectedIds.length !== pesantrenData.value.length) {
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
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: hsl(var(--muted)/0.3);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--primary)/0.3);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary)/0.5);
}
</style>
