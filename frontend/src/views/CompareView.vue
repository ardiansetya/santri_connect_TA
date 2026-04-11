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

      <!-- Loading State -->
      <div v-else-if="loading" class="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
        <p class="mt-6 text-muted-foreground font-medium text-lg">Menyusun data perbandingan...</p>
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

        <div class="bg-white rounded-2xl shadow-xl border border-border/50 overflow-hidden relative z-20">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th class="p-6 bg-muted/30 border-b-2 border-primary/20 w-48 font-heading text-lg text-primary align-top shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)] sticky left-0 z-10 hidden md:table-cell">
                    Kriteria Utama
                  </th>
                  <th v-for="p in pesantrenData" :key="p.id" class="p-6 bg-white border-b-2 border-primary/20 align-top min-w-[280px]">
                    <div class="flex flex-col h-full border border-border rounded-xl p-4 relative group shadow-sm transition-shadow hover:shadow-md">
                      <button 
                        class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-border text-muted-foreground hover:bg-destructive hover:text-white hover:border-destructive shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" 
                        @click="removeItem(p.id)"
                        title="Hapus dari perbandingan"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                      
                      <div class="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-muted">
                        <img 
                          v-if="p.foto_utama" 
                          :src="getUploadUrl(p.foto_utama)" 
                          :alt="p.nama" 
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center bg-primary/5 text-primary/30 text-3xl">🕌</div>
                      </div>
                      
                      <h3 class="font-heading font-bold text-xl text-center text-primary-dark mb-1">{{ p.nama }}</h3>
                      <p class="text-sm text-center text-muted-foreground mb-4">{{ p.kota }}, {{ p.province }}</p>
                      
                      <router-link :to="`/pesantren/${p.id}`" class="btn btn-outline border-primary text-primary w-full mt-auto text-sm justify-center py-2 hover:bg-primary hover:text-white">
                        Lihat Profil Penuh
                      </router-link>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border/60">
                <!-- Provinsi -->
                <tr class="hover:bg-muted/10 transition-colors">
                  <td class="p-4 font-semibold text-muted-foreground bg-muted/20 md:bg-transparent shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)] sticky left-0 z-10 md:static block md:table-cell uppercase tracking-wider text-xs md:text-sm">Lokasi</td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-4 text-center">
                    <p class="font-medium text-foreground">{{ p.kota }}</p>
                    <p class="text-sm text-muted-foreground">{{ p.province }}</p>
                  </td>
                </tr>
                
                <!-- Kurikulum -->
                <tr class="hover:bg-muted/10 transition-colors">
                  <td class="p-4 font-semibold text-muted-foreground bg-muted/20 md:bg-transparent shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)] sticky left-0 z-10 md:static block md:table-cell uppercase tracking-wider text-xs md:text-sm">Kurikulum</td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-4 text-center">
                    <span class="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" :class="badgeClass(p.kurikulum)">
                      {{ p.kurikulum || 'Umum' }}
                    </span>
                  </td>
                </tr>
                
                <!-- Est -->
                <tr class="hover:bg-muted/10 transition-colors">
                  <td class="p-4 font-semibold text-muted-foreground bg-muted/20 md:bg-transparent shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)] sticky left-0 z-10 md:static block md:table-cell uppercase tracking-wider text-xs md:text-sm">Sejarah</td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-4 text-center">
                    <span v-if="p.tahun_berdiri" class="text-foreground">Berdiri {{ p.tahun_berdiri }}</span>
                    <span v-else class="text-muted-foreground">-</span>
                  </td>
                </tr>
                
                <!-- Jumlah Stats -->
                <tr class="hover:bg-muted/10 transition-colors bg-primary/5">
                  <td class="p-4 font-semibold text-primary bg-primary/10 md:bg-transparent shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)] sticky left-0 z-10 md:static block md:table-cell uppercase tracking-wider text-xs md:text-sm">Kapasitas</td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-4 text-center">
                    <div class="flex flex-col items-center gap-2">
                      <div class="text-center">
                        <p class="font-heading font-bold text-xl text-primary">{{ formatNumber(p.jumlah_santri) }}</p>
                        <p class="text-xs text-muted-foreground">Santri Aktif</p>
                      </div>
                      <div class="w-12 h-px bg-border my-1"></div>
                      <div class="text-center">
                        <p class="font-heading font-bold text-lg text-primary">{{ formatNumber(p.jumlah_pengajar) }}</p>
                        <p class="text-xs text-muted-foreground">Tenaga Ahli</p>
                      </div>
                    </div>
                  </td>
                </tr>
                
                <!-- Biaya Bulanan -->
                <tr class="hover:bg-muted/10 transition-colors">
                  <td class="p-4 font-semibold text-muted-foreground bg-muted/20 md:bg-transparent shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)] sticky left-0 z-10 md:static block md:table-cell uppercase tracking-wider text-xs md:text-sm">Biaya SPP / Bln</td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-4 text-center">
                    <span class="font-bold text-primary text-lg">{{ formatCurrency(p.biaya_bulanan) }}</span>
                  </td>
                </tr>
                
                <!-- Biaya Pendaftaran -->
                <tr class="hover:bg-muted/10 transition-colors">
                  <td class="p-4 font-semibold text-muted-foreground bg-muted/20 md:bg-transparent shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)] sticky left-0 z-10 md:static block md:table-cell uppercase tracking-wider text-xs md:text-sm">Uang Pangkal</td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-4 text-center">
                    <span class="font-semibold text-foreground">{{ formatCurrency(p.biaya_pendaftaran) }}</span>
                  </td>
                </tr>
                
                <!-- Fasilitas -->
                <tr class="hover:bg-muted/10 transition-colors">
                  <td class="p-4 font-semibold text-muted-foreground bg-muted/20 md:bg-transparent shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)] sticky left-0 z-10 md:static block md:table-cell uppercase tracking-wider text-xs md:text-sm align-top pt-6">Fasilitas Pokok</td>
                  <td v-for="p in pesantrenData" :key="p.id" class="p-4 align-top">
                    <div v-if="p.fasilitas && p.fasilitas.length" class="flex flex-wrap gap-1.5 justify-center">
                      <span v-for="f in p.fasilitas" :key="f" class="px-2.5 py-1 bg-muted/50 text-foreground text-xs rounded border border-border shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        {{ f }}
                      </span>
                    </div>
                    <div v-else class="text-center text-muted-foreground">-</div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useCompareStore } from '../stores/compare'
import { pesantren as pesantrenApi } from '../services'
import { getUploadUrl } from '../services/api' // Added getUploadUrl for images

const compareStore = useCompareStore()

const pesantrenData = ref([])
const loading = ref(false)
const error = ref('')

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
    const { data } = await pesantrenApi.compare(compareStore.selectedIds)
    pesantrenData.value = data.data || []
  } catch {
    error.value = 'Gagal memuat data perbandingan dari server. Silakan coba lagi.'
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
