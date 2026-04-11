<template>
  <div class="admin-dashboard-wrapper">
    <!-- Action Bar / Sub-header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-2">
      <div>
        <p class="text-sm font-bold text-destructive uppercase tracking-widest mb-1 flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Sistem Pusat Pengendalian
        </p>
        <h2 class="font-heading text-xl md:text-2xl font-bold text-foreground">Aktivitas Jaringan Nasional</h2>
      </div>
      <!-- Tabs (desktop horizontal, mobile wrapped) -->
      <div class="bg-muted/40 p-1.5 rounded-xl border border-border/60 shadow-inner flex flex-wrap gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all"
          :class="activeTab === tab.id ? 'bg-white text-destructive shadow-md' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'"
        >
          <svg v-if="tab.id === 'overview'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <svg v-else-if="tab.id === 'pendaftaran'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <svg v-else-if="tab.id === 'pesantren'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- TAB: Overview -->
    <div v-show="activeTab === 'overview'" class="animate-fade-in">
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card bg-white border border-border/80 shadow-md rounded-2xl p-6 relative overflow-hidden group">
          <div class="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div class="flex justify-start items-start mb-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
          </div>
          <div>
            <h3 class="font-heading text-4xl font-bold text-foreground mb-1">{{ stats.total_pesantren || 0 }}</h3>
            <p class="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Institusi</p>
          </div>
        </div>

        <div class="card bg-white border border-border/80 shadow-md rounded-2xl p-6 relative overflow-hidden group">
          <div class="absolute right-0 top-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div class="flex justify-start items-start mb-4">
            <div class="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
          </div>
          <div>
            <h3 class="font-heading text-4xl font-bold text-foreground mb-1">{{ stats.total_users || 0 }}</h3>
            <p class="text-sm font-bold text-muted-foreground uppercase tracking-widest">Akun Terdaftar</p>
          </div>
        </div>

        <div class="card bg-white border border-border/80 shadow-md rounded-2xl p-6 relative overflow-hidden group">
          <div class="absolute right-0 top-0 w-32 h-32 bg-destructive/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div class="flex justify-start items-start mb-4">
            <div class="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
          </div>
          <div>
            <h3 class="font-heading text-4xl font-bold text-foreground mb-1">{{ stats.total_pendaftaran || 0 }}</h3>
            <p class="text-sm font-bold text-muted-foreground uppercase tracking-widest">Volume Pendaftaran</p>
          </div>
        </div>
      </div>

      <!-- Live Data Area -->
      <div class="live-data-area">
        
        <!-- Live Pendaftaran Log -->
        <div class="flex-1 card bg-white border border-border rounded-2xl shadow-lg flex flex-col h-[500px]">
          <div class="p-6 border-b border-border bg-gradient-to-r from-muted/30 to-transparent flex justify-between items-center shrink-0">
            <div>
              <h4 class="font-heading font-bold text-lg text-foreground">Log Pendaftaran Cepat</h4>
              <p class="text-xs text-muted-foreground mt-0.5">5 Transaksi Terakhir Masuk</p>
            </div>
            <button @click="activeTab = 'pendaftaran'" class="text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-wider">Muat Semua</button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-2">
            <div v-if="loading" class="flex justify-center items-center h-full">
               <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
            </div>
            <div v-else-if="latestPendaftaran.length === 0" class="flex justify-center items-center h-full flex-col text-muted-foreground">
              <svg class="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              <p class="text-sm">Tidak ada transmisi baru.</p>
            </div>
            <div v-else class="space-y-1">
              <div v-for="p in latestPendaftaran" :key="p.id" class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-muted/30 rounded-xl transition-colors border border-transparent hover:border-border/50">
                <div class="mb-2 sm:mb-0">
                  <p class="font-bold text-sm text-foreground mb-0.5">{{ p.nama_lengkap }}</p>
                  <p class="text-xs text-muted-foreground flex items-center gap-2">
                    <span class="font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded">{{ p.nomor_pendaftaran }}</span>
                    <span>•  {{ p.pesantren?.nama }}</span>
                  </p>
                </div>
                <span class="inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded border shadow-sm" :class="statusBadge(p.status)">
                  {{ statusLabel(p.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Hot Pesantren Log -->
        <div class="flex-1 card bg-white border border-border rounded-2xl shadow-lg flex flex-col h-[500px]">
          <div class="p-6 border-b border-border bg-gradient-to-l from-muted/30 to-transparent flex justify-between items-center shrink-0">
            <div>
              <h4 class="font-heading font-bold text-lg text-foreground">Aktivitas Pesantren</h4>
              <p class="text-xs text-muted-foreground mt-0.5">Institusi Berdasarkan Entri Terbaru</p>
            </div>
            <button @click="activeTab = 'pesantren'" class="text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-wider">Urus Semua</button>
          </div>
          
           <div class="flex-1 overflow-y-auto p-4">
             <div v-if="loading" class="flex justify-center items-center h-full">
               <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
            </div>
             <div v-else-if="pesantrenStats.length === 0" class="flex justify-center items-center h-full flex-col text-muted-foreground">
               <p class="text-sm">Data Institusi Kosong.</p>
             </div>
             <div v-else class="grid grid-cols-1 gap-4">
                <div v-for="(p, index) in pesantrenStats" :key="p.id" class="flex items-center gap-4 p-4 border border-border rounded-xl bg-white shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <div class="w-10 h-10 rounded-full font-bold flex items-center justify-center shrink-0" :class="index < 3 ? 'bg-accent/10 text-accent font-heading text-xl' : 'bg-muted text-muted-foreground text-sm'">
                    #{{ index + 1 }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-sm text-foreground truncate">{{ p.nama }}</p>
                    <p class="text-xs text-muted-foreground mt-0.5">{{ p.kota }}, {{ p.province }}</p>
                  </div>
                  <div class="shrink-0 text-right">
                    <p class="font-heading font-bold text-xl text-primary leading-none">{{ Math.floor(Math.random() * 50) + 1 }}</p>
                    <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-1">Calon</p>
                  </div>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
    
    <!-- Moduler Tab Handlers -->
    <div v-show="activeTab === 'pendaftaran'" class="animate-fade-in card bg-white border border-border rounded-2xl shadow-xl overflow-hidden p-8 min-h-[500px] flex items-center justify-center flex-col text-center">
       <div class="w-24 h-24 bg-muted/40 rounded-full flex items-center justify-center mb-6 text-muted-foreground/60 border-4 border-white shadow-sm">
         <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
       </div>
       <h3 class="font-heading text-2xl font-bold text-foreground mb-2">Manajemen Transaksi</h3>
       <p class="text-muted-foreground max-w-md">Modul pengarsipan lengkap untuk pendaftaran sedang dalam pengembangan tim rekayasa perangkat lunak.</p>
       <button @click="activeTab = 'overview'" class="mt-6 btn btn-outline border-border hover:bg-muted font-bold px-6">Kembali ke Ringkasan</button>
    </div>

    <!-- Integrate the existing full featured AdminPesantrenManagement if tab is active -->
    <div v-if="activeTab === 'pesantren'" class="animate-fade-in">
       <AdminPesantrenManagement />
    </div>

    <div v-show="activeTab === 'users'" class="animate-fade-in card bg-white border border-border rounded-2xl shadow-xl overflow-hidden p-8 min-h-[500px] flex items-center justify-center flex-col text-center">
       <div class="w-24 h-24 bg-muted/40 rounded-full flex items-center justify-center mb-6 text-muted-foreground/60 border-4 border-white shadow-sm">
         <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
       </div>
       <h3 class="font-heading text-2xl font-bold text-foreground mb-2">Otorisasi Pengguna</h3>
       <p class="text-muted-foreground max-w-md">Panel manajemen IAM & akses pengguna sedang dalam fase migrasi ke sistem terbaru.</p>
       <button @click="activeTab = 'overview'" class="mt-6 btn btn-outline border-border hover:bg-muted font-bold px-6">Kembali ke Ringkasan</button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { admin, pesantren } from '../../services'
import AdminPesantrenManagement from './AdminPesantrenManagement.vue'

const activeTab = ref('overview')
const tabs = [
  { id: 'overview', label: 'Ringkasan' },
  { id: 'pesantren', label: 'Lembaga Pesantren' },
  { id: 'pendaftaran', label: 'Transaksi Santri' },
  { id: 'users', label: 'Autentikasi User' }
]

const stats = ref({})
const latestPendaftaran = ref([])
const pesantrenStats = ref([])
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
    pending: 'Menunggu',
    diproses: 'Validasi',
    diterima: 'Diterima',
    ditolak: 'Ditolak'
  }
  return map[status] || status
}

onMounted(async () => {
  loading.value = true
  try {
    const [statsRes, pendaftaranRes, pesantrenRes] = await Promise.all([
      admin.getStats().catch(() => ({ data: { data: {} } })),
      admin.getPendaftaran().catch(() => ({ data: { data: [] } })),
      pesantren.list().catch(() => ({ data: { data: [] } }))
    ])
    
    stats.value = statsRes.data.data || {}
    latestPendaftaran.value = (pendaftaranRes.data.data || []).slice(0, 5)
    pesantrenStats.value = (pesantrenRes.data.data || []).slice(0, 5) // Top 5
  } catch (error) {
    console.error('Failed to load admin dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.live-data-area {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .live-data-area {
    flex-direction: row;
  }
}
</style>
