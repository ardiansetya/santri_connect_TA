<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-hero-gradient py-20 lg:py-28">
      <div class="absolute inset-0 opacity-10">
        <div class="h-full w-full" style="background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);"></div>
      </div>
      <div class="container relative z-10">
        <div class="mx-auto max-w-3xl text-center">
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fade-in" style="font-family: 'Plus Jakarta Sans', sans-serif;">
            Temukan Pesantren Terbaik untuk Masa Depan
          </h1>
          <p class="mt-6 text-lg text-white/80 animate-fade-in" style="animation-delay: 0.1s;">
            Platform pencarian dan pendaftaran Pondok Pesantren terlengkap di Indonesia. Bandingkan, pilih, dan daftar secara online.
          </p>
          <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center animate-fade-in" style="animation-delay: 0.2s;">
            <router-link to="/pesantren" class="btn bg-white text-primary hover:bg-white/90 font-semibold px-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              Cari Pesantren
            </router-link>
            <router-link to="/rekomendasi" class="btn text-white border border-white/30 hover:bg-white/10 px-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Rekomendasi
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="relative z-10 -mt-8">
      <div class="container">
        <div class="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="stat-card animate-fade-in" style="animation-delay: 0.3s;">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div>
              <div class="text-2xl font-bold" style="font-family: 'Plus Jakarta Sans', sans-serif;">{{ stats.total_pesantren || '22' }}+</div>
              <div class="text-sm text-muted">Pesantren Terdaftar</div>
            </div>
          </div>
          <div class="stat-card animate-fade-in" style="animation-delay: 0.4s;">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <div class="text-2xl font-bold" style="font-family: 'Plus Jakarta Sans', sans-serif;">{{ stats.total_provinsi || '3' }}</div>
              <div class="text-sm text-muted">Provinsi</div>
            </div>
          </div>
          <div class="stat-card animate-fade-in" style="animation-delay: 0.5s;">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div class="text-2xl font-bold" style="font-family: 'Plus Jakarta Sans', sans-serif;">{{ stats.total_kota || '5' }}</div>
              <div class="text-sm text-muted">Kota/Kabupaten</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="container">
        <div class="mx-auto max-w-2xl text-center mb-12">
          <h2 class="text-3xl font-bold" style="font-family: 'Plus Jakarta Sans', sans-serif;">Kenapa SantriConnect?</h2>
          <p class="mt-3 text-muted">Semua yang Anda butuhkan untuk menemukan pesantren terbaik dalam satu platform.</p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div class="feature-card group animate-slide-up" style="animation-delay: 0s;">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 class="mt-4 font-semibold text-lg" style="font-family: 'Plus Jakarta Sans', sans-serif;">Cari Pesantren</h3>
            <p class="mt-2 text-sm text-muted leading-relaxed">Temukan pondok pesantren berdasarkan lokasi, kurikulum, dan fasilitas yang Anda inginkan.</p>
          </div>
          <div class="feature-card group animate-slide-up" style="animation-delay: 0.1s;">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <h3 class="mt-4 font-semibold text-lg" style="font-family: 'Plus Jakarta Sans', sans-serif;">Rekomendasi Cerdas</h3>
            <p class="mt-2 text-sm text-muted leading-relaxed">Dapatkan rekomendasi pesantren terbaik sesuai budget, lokasi, dan kebutuhan Anda.</p>
          </div>
          <div class="feature-card group animate-slide-up" style="animation-delay: 0.2s;">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M21 3l-7.5 7.5"/><path d="M3 21l7.5-7.5"/></svg>
            </div>
            <h3 class="mt-4 font-semibold text-lg" style="font-family: 'Plus Jakarta Sans', sans-serif;">Bandingkan</h3>
            <p class="mt-2 text-sm text-muted leading-relaxed">Bandingkan hingga 3 pesantren secara berdampingan untuk membuat keputusan tepat.</p>
          </div>
          <div class="feature-card group animate-slide-up" style="animation-delay: 0.3s;">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11v6"/><path d="m9 14 3 3 3-3"/></svg>
            </div>
            <h3 class="mt-4 font-semibold text-lg" style="font-family: 'Plus Jakarta Sans', sans-serif;">Daftar Online</h3>
            <p class="mt-2 text-sm text-muted leading-relaxed">Proses pendaftaran mudah dan cepat secara online tanpa perlu datang langsung.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Pesantren -->
    <section class="bg-muted/50 py-20">
      <div class="container">
        <div class="flex items-end justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold" style="font-family: 'Plus Jakarta Sans', sans-serif;">Pesantren Populer</h2>
            <p class="mt-2 text-muted">Pilihan pesantren terbaik dari berbagai daerah di Indonesia.</p>
          </div>
          <router-link to="/pesantren" class="btn btn-outline hidden sm:flex">Lihat Semua</router-link>
        </div>
        <div class="pesantren-grid">
          <router-link 
            v-for="p in featuredPesantren" 
            :key="p.id" 
            :to="`/pesantren/${p.id}`"
            class="card group block overflow-hidden"
          >
            <div class="relative aspect-video overflow-hidden">
              <img 
                :src="p.foto_utama ? `/uploads/pesantrenImages/${p.foto_utama}` : 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image'" 
                :alt="p.nama"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span class="badge badge-primary absolute left-3 top-3">
                {{ p.kurikulum || 'Modern' }}
              </span>
            </div>
            <div class="p-5">
              <h3 class="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                {{ p.nama }}
              </h3>
              <div class="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="line-clamp-1">{{ p.kota }}, {{ p.province }}</span>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <span class="text-lg font-bold text-primary">{{ p.biaya_bulanan ? formatCurrency(p.biaya_bulanan) : '-' }}</span>
              </div>
              <div class="mt-3 flex flex-wrap gap-1.5">
                <span class="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted">Asrama</span>
                <span class="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted">Masjid</span>
              </div>
            </div>
          </router-link>
        </div>
        <div class="mt-6 text-center sm:hidden">
          <router-link to="/pesantren" class="btn btn-outline">Lihat Semua Pesantren</router-link>
        </div>
      </div>
    </section>

    <!-- Footer placeholder - actual footer in App.vue -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { publicApi } from '../services'

const stats = ref({ total_pesantren: 0, total_provinsi: 0, total_kota: 0 })
const featuredPesantren = ref([])

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
}

onMounted(async () => {
  try {
    const { data } = await publicApi.getStats()
    stats.value = data.data
  } catch {
    // Stats will show defaults
  }

  try {
    const { data } = await publicApi.getPesantren({ limit: 6 })
    featuredPesantren.value = data.data || []
  } catch {
    featuredPesantren.value = []
  }
})
</script>

<style scoped>
.bg-muted\/50 {
  background: hsl(var(--muted) / 0.5);
}
</style>