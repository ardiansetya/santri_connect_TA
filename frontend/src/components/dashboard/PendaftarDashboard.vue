<template>
  <div class="user-dashboard-content">
    
    <!-- Top Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card bg-white border border-border shadow-sm rounded-xl overflow-hidden relative group hover:shadow-md transition-shadow">
        <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-accent"></div>
        <div class="p-6">
          <div class="flex justify-between items-center relative z-10">
            <div>
              <p class="text-muted-foreground text-xs uppercase tracking-widest font-bold mb-1">Verifikasi Aktif</p>
              <h3 class="font-heading font-bold text-3xl text-foreground">{{ stats.pending }}</h3>
            </div>
            <div class="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card bg-white border border-border shadow-sm rounded-xl overflow-hidden relative group hover:shadow-md transition-shadow">
        <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-success"></div>
        <div class="p-6">
          <div class="flex justify-between items-center relative z-10">
            <div>
              <p class="text-muted-foreground text-xs uppercase tracking-widest font-bold mb-1">Berhasil Masuk</p>
              <h3 class="font-heading font-bold text-3xl text-foreground">{{ stats.diterima }}</h3>
            </div>
            <div class="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card bg-white border border-border shadow-sm rounded-xl overflow-hidden relative group hover:shadow-md transition-shadow">
        <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
        <div class="p-6">
          <div class="flex justify-between items-center relative z-10">
            <div>
              <p class="text-muted-foreground text-xs uppercase tracking-widest font-bold mb-1">Total Pendaftaran</p>
              <h3 class="font-heading font-bold text-3xl text-foreground">{{ stats.total }}</h3>
            </div>
            <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- List Pendaftaran -->
      <div class="lg:col-span-2">
        <div class="card bg-white rounded-2xl shadow-xl border border-border/80 overflow-hidden h-full flex flex-col">
          <div class="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent flex justify-between items-center">
            <h5 class="font-heading font-bold text-lg text-primary-dark">Historis Akademik Saya</h5>
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">{{ pendaftaranList.length }}</span>
          </div>
          
          <div class="flex-1 flex flex-col relative z-10">
            <!-- Loading -->
            <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-20">
              <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-primary mb-4"></div>
              <p class="text-muted-foreground font-medium text-sm">Menyinkronkan dokumen pendaftaran...</p>
            </div>
            
            <!-- Empty -->
            <div v-else-if="pendaftaranList.length === 0" class="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
              <div class="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <svg class="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              </div>
              <h6 class="font-heading font-bold text-xl text-foreground mb-1">Beranda Kosong</h6>
              <p class="text-muted-foreground text-sm max-w-sm mb-6">Berkas pencalonan santri Anda tidak ditemukan dalam riwayat login perangkat. Mulai prosesnya sekarang.</p>
              <router-link to="/pesantren" class="btn btn-primary px-6 rounded-full shadow-md hover:-translate-y-0.5 transition-all">Lihat Katalog Pesantren</router-link>
            </div>
            
            <!-- Content -->
            <div v-else class="flex-1 overflow-y-auto overflow-x-hidden max-h-[500px]">
              <div
                v-for="(p, i) in pendaftaranList"
                :key="p.id"
                class="p-4 sm:px-6 sm:py-5 border-b border-border hover:bg-muted/10 transition-colors group relative"
              >
                <!-- Numbering indicator -->
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-colors"></div>
                
                <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-6 pl-2 sm:pl-0">
                  <div class="flex-1">
                    <h6 class="font-heading font-bold text-base mb-1.5 text-foreground group-hover:text-primary transition-colors">{{ p.pesantren?.nama || p.pesantren_nama || 'Pesantren Tidak Terdeteksi' }}</h6>
                    
                    <div class="flex flex-wrap items-center gap-2.5">
                      <div class="inline-flex items-center gap-1.5 text-muted-foreground text-xs font-mono bg-muted/30 px-2 py-1 rounded border border-border/50 whitespace-nowrap">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
                        {{ p.nomor_pendaftaran }}
                      </div>
                      <button
                        @click="copyNomor(p.nomor_pendaftaran)"
                        class="text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary-dark transition-colors inline-flex items-center whitespace-nowrap bg-primary/5 px-2 py-1 rounded"
                        title="Salin nomor Registrasi"
                      >
                        <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy
                      </button>
                      <div class="text-muted-foreground text-xs font-medium flex items-center gap-1.5 opacity-80 whitespace-nowrap hidden sm:flex border-l border-border pl-2.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {{ formatDate(p.created_at) }}
                      </div>
                    </div>
                    <!-- Mobile only date -->
                    <div class="text-muted-foreground text-xs font-medium flex items-center gap-1.5 opacity-80 whitespace-nowrap sm:hidden mt-2">
                       <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                       {{ formatDate(p.created_at) }}
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 shrink-0">
                    <span class="inline-flex px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded shadow-sm border whitespace-nowrap" :class="statusBadge(p.status)">
                      {{ statusLabel(p.status) }}
                    </span>
                    <router-link
                      v-if="p.nomor_pendaftaran"
                      to="/track"
                      class="btn bg-white border border-border shadow-sm flex items-center text-xs px-4 py-2 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all font-bold group/btn whitespace-nowrap"
                    >
                      Audit
                      <svg class="w-3.5 h-3.5 ml-1.5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action Panels Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <div class="card bg-white rounded-2xl shadow-lg border border-border overflow-hidden">
          <div class="px-6 py-5 border-b border-border relative">
            <h5 class="font-heading font-bold text-lg text-foreground relative z-10">Pusat Navigasi</h5>
            <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-primary/5 to-transparent"></div>
          </div>
          <div class="p-6 space-y-3">
            <router-link to="/pesantren" class="relative w-full flex items-center justify-start bg-muted/20 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all p-3.5 rounded-xl group overflow-hidden border border-transparent">
              <span class="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-3 group-hover:scale-110 transition-transform"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
              <span class="font-bold text-sm">Cari Pesantren Publik</span>
            </router-link>
            
            <router-link to="/rekomendasi" class="relative w-full flex items-center justify-start bg-muted/20 hover:border-accent/30 hover:bg-accent/5 hover:text-accent transition-all p-3.5 rounded-xl group overflow-hidden border border-transparent">
              <span class="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent shrink-0 mr-3 group-hover:scale-110 transition-transform"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></span>
              <span class="font-bold text-sm">Algoritma Rekomendasi</span>
            </router-link>
            
            <router-link to="/compare" class="relative w-full flex items-center justify-start bg-muted/20 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all p-3.5 rounded-xl group overflow-hidden border border-transparent">
              <span class="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-3 group-hover:scale-110 transition-transform"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg></span>
              <span class="font-bold text-sm">Table Analisis Perbandingan</span>
            </router-link>
            
            <div class="h-px bg-border my-2"></div>
            
            <router-link to="/track" class="relative w-full flex items-center justify-start bg-muted/20 hover:border-success/30 hover:bg-success/5 hover:text-success transition-all p-3.5 rounded-xl group overflow-hidden border border-transparent">
              <span class="w-8 h-8 rounded bg-success/10 flex items-center justify-center text-success shrink-0 mr-3 group-hover:scale-110 transition-transform"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></span>
              <span class="font-bold text-sm">Lacak Berkas Mandiri</span>
            </router-link>
          </div>
        </div>

        <!-- System Notice -->
        <div class="bg-primary/5 border border-primary/20 rounded-xl p-5 shadow-sm">
           <div class="flex items-start gap-3">
             <svg class="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             <div>
               <p class="font-bold text-sm text-primary mb-1">Informasi Pusat</p>
               <p class="text-xs text-muted-foreground leading-relaxed">
                 Pastikan memantau status secara reguler. Keputusan panitia akademik pesantren final dan tercatat rapi di atas sistem ini.
               </p>
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
    pending: 'bg-accent/10 text-accent border-accent/20',
    diproses: 'bg-blue-100 text-blue-800 border-blue-200',
    diterima: 'bg-success/10 text-success border-success/20',
    ditolak: 'bg-destructive/10 text-destructive border-destructive/20'
  }
  return map[status] || 'bg-muted text-muted-foreground border-border'
}

function statusLabel(status) {
  const map = {
    pending: 'Menunggu Verifikasi',
    diproses: 'Tahap Review',
    diterima: 'Lulus Seleksi',
    ditolak: 'Gagal / Dibatalkan'
  }
  return map[status] || status
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function copyNomor(nomor) {
  try {
    await navigator.clipboard.writeText(nomor)
    toast.success(`ID ${nomor} diamankan di Clipboard`, { title: 'Penyalinan Sukses' })
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = nomor
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      toast.success(`ID ${nomor} diamankan di Clipboard`, { title: 'Penyalinan Sukses' })
    } catch (e) {
      toast.error('Otoritas peramban menolak tindakan salin text', { title: 'Ditolak' })
    }
    document.body.removeChild(textArea)
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await pendaftaran.getMyRegistrations()
    pendaftaranList.value = data.data || []
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
/* Inherits styling naturally */
</style>
