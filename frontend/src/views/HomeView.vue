<template>
  <div class="home paper-texture">
    <!-- Hero Section -->
    <section class="hero-section relative overflow-hidden bg-hero-gradient py-32">
      <div class="pattern-overlay"></div>
      <!-- Decorative circles -->
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>

      <div class="container relative z-10">
        <div class="mx-auto max-w-3xl text-center">
          <div class="hero-badge animate-fade-in">
            <span class="hero-badge-dot"></span>
            Platform Pesantren #1 di Indonesia
          </div>
          <h1 class="hero-title animate-fade-in delay-1">
            Temukan <span class="hero-title-accent">Pesantren</span> Terbaik untuk Masa Depan
          </h1>
          <p class="hero-subtitle animate-fade-in delay-2">
            Platform pencarian dan pendaftaran Pondok Pesantren terlengkap di Indonesia. Bandingkan, pilih, dan daftar secara online.
          </p>
          <div class="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center animate-fade-in delay-3">
            <template v-if="authStore.isAuthenticated">
              <router-link to="/dashboard" class="hero-btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Ke Dashboard Anda
              </router-link>
              <router-link to="/pesantren" class="hero-btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                Jelajahi Pesantren
              </router-link>
            </template>
            <template v-else>
              <router-link to="/pesantren" class="hero-btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                Cari Pesantren
              </router-link>
              <router-link to="/rekomendasi" class="hero-btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Rekomendasi
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="relative z-10 -mt-10">
      <div class="container">
        <div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 px-4">
          <div class="stat-card animate-fade-in delay-1 flex flex-row items-center gap-4" v-for="(stat, i) in statCards" :key="i" :style="{ animationDelay: `${300 + i * 100}ms` }">
            <div class="stat-icon">
              <svg v-if="i === 0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <svg v-else-if="i === 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="flex items-center gap-2">
              <span class="stat-value">{{ stat.value }}+</span>
              <span class="stat-label border-l border-border pl-2">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24">
      <div class="container">
        <div class="mx-auto max-w-2xl text-center mb-14">
          <span class="section-tag">Fitur Unggulan</span>
          <h2 class="section-title">Kenapa Santri Connect?</h2>
          <p class="section-subtitle">Semua yang Anda butuhkan untuk menemukan pesantren terbaik dalam satu platform.</p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="(feature, i) in features" :key="i" class="feature-card group animate-slide-up" :style="{ animationDelay: `${i * 100}ms` }">
            <div class="feature-icon">
              <svg v-if="i === 0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <svg v-else-if="i === 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <svg v-else-if="i === 2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M21 3l-7.5 7.5"/><path d="M3 21l7.5-7.5"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11v6"/><path d="m9 14 3 3 3-3"/></svg>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Pesantren -->
    <section class="featured-section py-24">
      <div class="container">
        <div class="flex items-end justify-between mb-10">
          <div>
            <span class="section-tag">Pilihan Terbaik</span>
            <h2 class="section-title">Pesantren Populer</h2>
            <p class="section-subtitle mt-2">Pilihan pesantren terbaik dari berbagai daerah di Indonesia.</p>
          </div>
          <router-link to="/pesantren" class="btn btn-outline hidden sm:flex">Lihat Semua →</router-link>
        </div>
        <div class="pesantren-grid">
          <router-link
            v-for="p in featuredPesantren"
            :key="p.id"
            :to="`/pesantren/${p.id}`"
            class="pesantren-card group"
          >
            <div class="relative aspect-video overflow-hidden rounded-t-xl">
              <img
                :src="p.foto_utama ? getUploadUrl(p.foto_utama) : 'https://placehold.co/600x400/0D4F4F/D4A843?text=Pesantren&font=playfair-display'"
                :alt="p.nama"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="pesantren-card-overlay"></div>
              <span class="pesantren-badge">
                {{ p.kurikulum || 'Modern' }}
              </span>
            </div>
            <div class="p-5">
              <h3 class="pesantren-card-title">
                {{ p.nama }}
              </h3>
              <div class="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="line-clamp-1">{{ p.kota }}, {{ p.province }}</span>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <span class="pesantren-price">{{ p.biaya_bulanan ? formatCurrency(p.biaya_bulanan) : '-' }}</span>
                <span class="pesantren-view-link">Lihat →</span>
              </div>
            </div>
          </router-link>
        </div>
        <div class="mt-12 text-center sm:hidden">
          <router-link to="/pesantren" class="btn btn-outline w-full">Lihat Semua Pesantren</router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-32 relative overflow-hidden">
      <div class="pattern-overlay opacity-10"></div>
      <div class="container relative z-10 text-center">
        <h2 class="cta-title">Siap Menemukan Pesantren Impian?</h2>
        <p class="cta-subtitle">Bergabunglah dengan ribuan keluarga yang telah mempercayakan pencarian pesantren terbaik melalui SantriConnect.</p>
        <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <template v-if="authStore.isAuthenticated">
            <router-link to="/dashboard" class="hero-btn-primary">
              Buka Dashboard Anda
            </router-link>
            <router-link to="/pesantren" class="hero-btn-secondary">
              Jelajahi Pesantren
            </router-link>
          </template>
          <template v-else>
            <router-link to="/register" class="hero-btn-primary">
              Daftar Sekarang — Gratis
            </router-link>
            <router-link to="/pesantren" class="hero-btn-secondary">
              Jelajahi Pesantren
            </router-link>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { publicApi } from '../services/api'
import { getUploadUrl } from '../services/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const stats = ref({ total_pesantren: 0, total_provinsi: 0, total_kota: 0 })
const featuredPesantren = ref([])


const statCards = computed(() => [
  { value: stats.value.total_pesantren || '22', label: 'Pesantren Terdaftar' },
  { value: stats.value.total_provinsi || '34', label: 'Provinsi Terjangkau' },
  { value: stats.value.total_kota || '150', label: 'Kota/Kabupaten' }
])

const features = [
  {
    title: 'Pencarian Cerdas',
    desc: 'Filter berdasarkan kurikulum, fasilitas, dan biaya dengan antarmuka yang intuitif.'
  },
  {
    title: 'Terverifikasi',
    desc: 'Semua data pesantren telah melalui proses validasi untuk menjamin keaslian informasi.'
  },
  {
    title: 'Bandingkan',
    desc: 'Bandingkan hingga 3 pesantren sekaligus untuk melihat perbedaan fasilitas dan biaya.'
  },
  {
    title: 'Pendaftaran Mudah',
    desc: 'Daftar langsung melalui platform tanpa perlu ribet dengan berkas fisik awal.'
  }
]

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const fetchData = async () => {
  try {
    const [statsRes, featuredRes] = await Promise.all([
      publicApi.getStats(),
      publicApi.getFeatured()
    ])
    stats.value = statsRes.data?.data || statsRes.data
    featuredPesantren.value = featuredRes.data?.data || []
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

onMounted(fetchData)
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, hsl(173 78% 18%), hsl(173 78% 12%) 40%, hsl(173 78% 8%) 100%);
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
}

.hero-orb-1 {
  width: 400px;
  height: 400px;
  background: hsla(173, 78%, 20%, 0.3);
  top: -100px;
  right: -100px;
}

.hero-orb-2 {
  width: 300px;
  height: 300px;
  background: hsla(40, 65%, 52%, 0.15);
  bottom: -50px;
  left: -100px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  color: white;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 2rem;
  backdrop-filter: blur(4px);
  font-family: 'DM Sans', sans-serif;
}

.hero-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: hsl(40 65% 52%);
  box-shadow: 0 0 12px hsl(40 65% 52%);
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.25rem, 5vw, 3.75rem);
  font-weight: 700;
  line-height: 1.15;
  color: white;
  letter-spacing: -0.02em;
}

.hero-title-accent {
  color: hsl(40 65% 70%);
  font-style: italic;
}

.hero-subtitle {
  margin-top: 1.5rem;
  font-size: 1.125rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: hsl(40 65% 52%);
  color: white;
  font-weight: 700;
  font-size: 0.9375rem;
  border-radius: 0.625rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  box-shadow: 0 4px 20px hsl(40 65% 52% / 0.3);
  font-family: 'DM Sans', sans-serif;
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px hsl(40 65% 52% / 0.4);
  filter: brightness(1.1);
}

.hero-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: transparent;
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 0.625rem;
  transition: all 0.3s ease;
  text-decoration: none;
  font-family: 'DM Sans', sans-serif;
}

.hero-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Stat Cards */
.stat-card {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  text-align: left !important;
  gap: 1.25rem !important;
  padding: 1.75rem !important;
  background: white !important;
  border-radius: 1.25rem !important;
  border: 1px solid hsl(35 18% 85%) !important;
  box-shadow: 0 4px 12px rgba(30, 20, 10, 0.05) !important;
  transition: all 0.3s ease !important;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(30, 20, 10, 0.08) !important;
  border-color: hsl(173 78% 18% / 0.1);
}

.stat-icon {
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(173 78% 18% / 0.05);
  color: hsl(173 78% 18%);
  border-radius: 1rem;
}

.stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: hsl(25 25% 15%);
}

.stat-label {
  font-size: 0.8125rem;
  color: hsl(30 10% 45%);
  font-weight: 500;
}

/* Section Headers */
.section-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: hsl(40 65% 48%);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: hsl(40 65% 52% / 0.08);
  border: 1px solid hsl(40 65% 52% / 0.15);
  margin-bottom: 0.75rem;
  font-family: 'DM Sans', sans-serif;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.25rem;
  font-weight: 700;
  color: hsl(25 25% 15%);
  letter-spacing: -0.02em;
  margin-top: 0.5rem;
}

.section-subtitle {
  color: hsl(30 10% 45%);
  font-size: 1.0625rem;
  line-height: 1.6;
  margin-top: 0.75rem;
}

/* Feature Cards */
.feature-card {
  padding: 2rem;
  background: white;
  border-radius: 1.25rem;
  border: 1px solid hsl(35 18% 85%);
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: hsl(40 65% 52% / 0.3);
  box-shadow: 0 10px 30px -10px rgba(212, 168, 67, 0.15);
}

.feature-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(40 65% 52% / 0.1);
  color: hsl(40 65% 48%);
  border-radius: 0.75rem;
}

.feature-title {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  font-size: 1.125rem;
  margin-top: 1rem;
  color: hsl(25 25% 15%);
}

.feature-desc {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: hsl(30 10% 45%);
  line-height: 1.6;
}

/* Featured Section */
.featured-section {
  background: 
    radial-gradient(ellipse at 0% 50%, hsl(173 78% 18% / 0.03) 0%, transparent 60%),
    radial-gradient(ellipse at 100% 50%, hsl(40 65% 52% / 0.04) 0%, transparent 60%),
    hsl(38 25% 95%);
}

/* Pesantren Cards */
.pesantren-card {
  background: hsl(38 30% 99%);
  border: 1px solid hsl(35 18% 85%);
  border-radius: 0.875rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  display: block;
}

.pesantren-card:hover {
  box-shadow: 0 16px 40px -10px rgb(13 79 79 / 0.12);
  transform: translateY(-4px);
  border-color: hsl(173 78% 18% / 0.2);
}

.pesantren-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.pesantren-card:hover .pesantren-card-overlay {
  opacity: 1;
}

.pesantren-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 9999px;
  background: hsl(173 78% 18% / 0.85);
  color: white;
  backdrop-filter: blur(4px);
  font-family: 'DM Sans', sans-serif;
}

.pesantren-card-title {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  font-size: 1.0625rem;
  color: hsl(25 25% 15%);
  transition: color 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pesantren-card:hover .pesantren-card-title {
  color: hsl(173 78% 18%);
}

.pesantren-price {
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: hsl(173 78% 18%);
}

.pesantren-view-link {
  font-size: 0.8125rem;
  font-weight: 600;
  color: hsl(40 65% 48%);
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.3s ease;
}

.pesantren-card:hover .pesantren-view-link {
  opacity: 1;
  transform: translateX(0);
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, hsl(173 78% 16%), hsl(173 78% 12%) 60%, hsl(40 50% 30%) 100%);
  position: relative;
  overflow: hidden;
}

.cta-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;
}

.cta-subtitle {
  margin-top: 1rem;
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.65);
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}
</style>