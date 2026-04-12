<template>
  <div class="tracking-page paper-texture min-h-[calc(100vh-4.5rem)] pt-24 pb-20 relative bg-background overflow-hidden">
    <!-- Geometry Pattern -->
    <div class="pattern-overlay z-0"></div>
    
    <div class="container relative z-10 px-4 mt-6">
      <div class="max-w-3xl mx-auto">
        
        <!-- Header Section -->
        <div class="text-center mb-10 animate-fade-in">
          <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/20">
            <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <h1 class="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Lacak Status Pendaftaran</h1>
          <p class="text-muted-foreground text-lg max-w-xl mx-auto">Masukkan nomor registrasi pendaftaran Anda untuk memantau proses verifikasi dokumen secara langsung.</p>
        </div>

        <!-- Search Bar -->
        <div class="card shadow-2xl shadow-primary/5 bg-white border-primary/10 rounded-2xl mb-8 transform hover:-translate-y-1 transition-all duration-300 animate-slide-up">
          <div class="p-6 md:p-8">
            <form @submit.prevent="cekStatus" class="relative">
              <label class="sr-only">Nomor Rekam Pendaftaran</label>
              <div class="flex flex-col md:flex-row gap-4">
                <div class="relative flex-1 group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <input
                    v-model="nomor"
                    type="text"
                    class="block w-full !pl-12 pr-4 py-4 text-lg bg-muted/20 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl placeholder:text-muted-foreground/60 transition-all focus:shadow-[0_0_0_4px_rgba(13,79,79,0.1)] focus:outline-none"
                    placeholder="Contoh: REG-2024-0001"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  class="btn btn-primary px-8 py-4 text-base font-bold rounded-xl shadow-lg shadow-primary/30 shrink-0 flex justify-center h-[60px]" 
                  :disabled="loading || !nomor.trim()"
                >
                  <span v-if="loading" class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                  <span v-else class="mr-2">Cek Status</span>
                  <svg v-if="!loading" class="w-5 h-5 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- System Feedback States -->
        <div class="animate-slide-up delay-1">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
            <p class="mt-4 text-muted-foreground font-medium text-lg tracking-wide">Mengakses Server...</p>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="card bg-destructive/5 border-destructive/20 rounded-2xl p-8 text-center shadow-lg border-2">
            <div class="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 class="font-bold text-xl text-destructive mb-2">Penelusuran Gagal</h3>
            <p class="text-destructive/80">{{ error }}</p>
          </div>

          <!-- Success Results Card -->
          <div v-else-if="data" class="card shadow-2xl bg-white border-t-4 border-t-primary rounded-2xl overflow-hidden">
            <!-- Details Header -->
            <div class="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent relative">
              <!-- Watermark -->
              <div class="absolute right-4 top-4 text-9xl opaicty-5 text-primary/5 pointer-events-none font-heading font-bold select-none">
                #
              </div>
              
              <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                <div>
                  <p class="text-sm font-bold text-primary uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    Hasil Penelusuran Aktif
                  </p>
                  <h2 class="font-heading text-3xl font-bold text-foreground mb-2">{{ data.nama_lengkap || '-' }}</h2>
                  <div class="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground font-medium">
                    <span class="flex items-center gap-1.5 bg-background border px-3 py-1 rounded-lg">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
                      {{ data.nomor_pendaftaran }}
                    </span>
                    <span class="flex items-center gap-1.5">
                      <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                      {{ data.pesantren?.nama || 'Pesantren' }}
                    </span>
                  </div>
                </div>
                
                <div class="shrink-0 flex flex-col items-start md:items-end gap-2">
                  <p class="text-xs text-muted-foreground uppercase tracking-widest font-bold">Status Saat Ini</p>
                  <span class="inline-flex px-5 py-2.5 rounded-full text-sm font-bold shadow-sm uppercase tracking-wider" :class="statusBadge(data.status)">
                    {{ statusLabel(data.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Tracker Nodes -->
            <div class="px-6 md:px-8 py-10 border-y border-border/60 bg-muted/10 relative">
              <h3 class="font-heading font-bold text-xl mb-8 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Tahapan Verifikasi
              </h3>
              
              <div class="relative max-w-lg mx-auto">
                <!-- Connecting Line -->
                <div class="absolute top-[28px] left-[10%] right-[10%] h-1 bg-border rounded-full z-0"></div>
                <div class="absolute top-[28px] left-[10%] h-1 rounded-full z-0 transition-all duration-1000 ease-in-out" 
                     :class="data.status === 'ditolak' ? 'bg-destructive' : 'bg-primary'"
                     :style="{ width: progressWidth(data.status) }"></div>

                <div class="flex justify-between items-start relative z-10">
                  <div v-for="(step, index) in timelineSteps" :key="step.key" class="flex flex-col items-center flex-1">
                    <!-- Node Bubble -->
                    <div 
                      class="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-3 shadow-[0_4px_10px_rgba(0,0,0,0.05)] border-4 transition-all duration-500"
                      :class="nodeClasses(data.status, index)"
                    >
                      <svg v-if="isStepActive(data.status, index) && data.status !== 'ditolak'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      <svg v-else-if="data.status === 'ditolak' && index === 2" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      <span v-else>{{ index + 1 }}</span>
                    </div>
                    <!-- Label -->
                    <span class="text-sm font-semibold text-center whitespace-nowrap" :class="labelClasses(data.status, index)">{{ step.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Admin Note Error Message -->
            <div v-if="data.catatan_admin" class="px-6 md:px-8 py-6 bg-accent/5 border-b border-accent/20">
              <div class="flex gap-4">
                <div class="mt-1 shrink-0">
                  <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p class="font-bold text-accent-foreground text-sm uppercase tracking-widest mb-1">Catatan Administrasi</p>
                  <p class="text-accent-foreground/80 leading-relaxed">{{ data.catatan_admin }}</p>
                </div>
              </div>
            </div>

            <!-- Detailed Data Grid -->
            <div class="p-6 md:p-8">
              <h3 class="font-heading font-bold text-xl mb-6">Dokumen Profil Penanggung Jawab</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-colors">
                  <p class="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Nomor Induk Kependudukan</p>
                  <p class="font-mono text-foreground font-semibold">{{ data.nik || 'Tidak dilampirkan' }}</p>
                </div>
                <div class="p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-colors">
                  <p class="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Tempat, Tanggal Lahir</p>
                  <p class="text-foreground font-medium">{{ formatTempatTanggalLahir(data.tempat_lahir, data.tanggal_lahir) }}</p>
                </div>
                <div class="p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-colors">
                  <p class="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Jenis Kelamin</p>
                  <p class="text-foreground font-medium flex items-center gap-2">
                    <svg v-if="data.jenis_kelamin === 'L'" class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                    <svg v-else-if="data.jenis_kelamin === 'P'" class="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                    {{ formatJenisKelamin(data.jenis_kelamin) }}
                  </p>
                </div>
                <div class="p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-colors">
                  <p class="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">No. Kontak Pendaftar</p>
                  <p class="text-foreground font-medium">{{ data.no_hp || 'Tidak dilampirkan' }}</p>
                </div>
                <div class="p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-colors">
                  <p class="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Nama Ayah Kandung</p>
                  <p class="text-foreground font-medium">{{ data.nama_ayah || 'Tidak dilampirkan' }}</p>
                </div>
                <div class="p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-colors">
                  <p class="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Nama Ibu Kandung</p>
                  <p class="text-foreground font-medium">{{ data.nama_ibu || 'Tidak dilampirkan' }}</p>
                </div>
                <div class="p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-colors sm:col-span-2">
                  <p class="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Kontak Darurat Orang Tua</p>
                  <p class="text-foreground font-medium">{{ data.no_hp_ortu || 'Tidak dilampirkan' }}</p>
                </div>
              </div>

              <!-- Timestamp -->
              <div class="mt-8 pt-6 border-t border-border flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span>Santri Connect Secure Log</span>
                <span>Dimasukkan: {{ formatDateTime(data.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Initial Prompt State -->
          <div v-else class="text-center py-20 animate-fade-in card bg-white border-0 shadow-xl max-w-xl mx-auto rounded-3xl p-10">
            <div class="w-32 h-32 mx-auto relative group mb-8">
              <div class="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300"></div>
              <div class="relative w-full h-full border-[10px] border-primary/10 rounded-full flex items-center justify-center text-6xl">
                📬
              </div>
            </div>
            <h3 class="font-heading font-bold text-3xl mb-3 text-foreground">Siap Melacak?</h3>
            <p class="text-muted-foreground text-lg mb-8 leading-relaxed">
              Ketikkan nomor pendaftaran yang Anda peroleh (e.g. REG-20XX-XXXX). Fitur ini akan otomatis memanggil data real-time langsung dari administrasi Pesantren.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { pendaftaran } from '../services'

const nomor = ref('')
const data = ref(null)
const loading = ref(false)
const error = ref('')

const timelineSteps = [
  { key: 'pending', label: 'Berkas Masuk' },
  { key: 'diproses', label: 'Verifikasi' },
  { key: 'selesai', label: 'Keputusan' }
]

function statusBadge(status) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    diproses: 'bg-blue-100 text-blue-800 border border-blue-200',
    diterima: 'bg-green-100 text-green-800 border border-green-200',
    ditolak: 'bg-red-100 text-red-800 border border-red-200'
  }
  return map[status] || 'bg-gray-100 text-gray-800 border border-gray-200'
}

function statusLabel(status) {
  const map = {
    pending: 'Menunggu Verifikasi',
    diproses: 'Dalam Pemeriksaan',
    diterima: 'Diterima Mutlak',
    ditolak: 'Gagal Tes/Verifikasi'
  }
  return map[status] || status
}

// Logic for progress bar width
function progressWidth(status) {
  if (status === 'ditolak') return '100%' // Show full line but red
  const map = {
    pending: '0%',
    diproses: '50%',
    diterima: '80%',   // Or 100%, adjust based on design
  }
  return map[status] || '0%'
}

// Check if a specific step node is "active" or "completed"
function isStepActive(status, index) {
  const order = ['pending', 'diproses', 'diterima', 'ditolak']
  const statusIndex = order.indexOf(status)
  
  if (status === 'ditolak') {
    // If rejected, process failed at final step or middle step. Show step 1 & 2 as active, step 3 as failed.
    return index <= 2 
  }
  // Max index is 2 (selesai)
  return index <= Math.min(statusIndex, 2)
}

function nodeClasses(status, index) {
  const order = ['pending', 'diproses', 'diterima', 'ditolak']
  const statusIndex = order.indexOf(status)

  // Explicit Rejection state styling
  if (status === 'ditolak') {
    if (index === 2) return 'bg-destructive/10 border-destructive text-destructive' // The failed node
    return 'bg-primary border-primary text-white' // The passed nodes
  }

  // Normal progression
  if (index < statusIndex) {
    // Passed steps
    return 'bg-primary border-primary text-white font-bold'
  } else if (index === statusIndex || (statusIndex > 2 && index === 2)) {
    // Current step
    return 'bg-white border-primary text-primary shadow-[0_0_0_6px_rgba(13,79,79,0.1)]'
  } else {
    // Future steps
    return 'bg-white border-border text-muted-foreground'
  }
}

function labelClasses(status, index) {
  const order = ['pending', 'diproses', 'diterima', 'ditolak']
  const statusIndex = order.indexOf(status)
  
  if (status === 'ditolak' && index === 2) return 'text-destructive font-bold'
  if (index <= statusIndex || (statusIndex > 2 && index === 2)) return 'text-primary font-bold'
  return 'text-muted-foreground font-medium'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTempatTanggalLahir(tempat, tanggal) {
  const tempatStr = tempat || '-'
  const tanggalStr = tanggal ? formatDate(tanggal) : '-'
  return `${tempatStr}, ${tanggalStr}`
}

function formatJenisKelamin(jk) {
  if (jk === 'L') return 'Laki-laki'
  if (jk === 'P') return 'Perempuan'
  return '-'
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function cekStatus() {
  if (!nomor.value.trim()) return
  loading.value = true
  error.value = ''
  data.value = null
  try {
    const { data: res } = await pendaftaran.getStatus(nomor.value.trim())
    data.value = res.data
  } catch (err) {
    error.value = err.response?.data?.error || 'Pendaftaran tidak terdaftar dalam database kami. Periksa kembali Nomor Registrasi Anda.'
  } finally {
    loading.value = false
  }
}
</script>
