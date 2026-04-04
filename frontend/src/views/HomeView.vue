<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">Temukan Pesantren <span class="text-primary">Terbaik</span> untuk Putra-Putri Anda</h1>
          <p class="hero__subtitle">Platform informasi dan pendaftaran pesantren terpercaya. Cari, bandingkan, dan daftar dengan mudah.</p>
          <div class="hero__actions">
            <router-link to="/pesantren" class="btn btn--primary">Cari Pesantren</router-link>
            <router-link to="/rekomendasi" class="btn btn--outline">Dapatkan Rekomendasi</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="container">
        <div class="stats__grid">
          <div class="stat-card">
            <span class="stat-card__number">{{ stats.total_pesantren || '...' }}</span>
            <span class="stat-card__label">Pesantren Terdaftar</span>
          </div>
          <div class="stat-card">
            <span class="stat-card__number">{{ stats.total_provinsi || '...' }}</span>
            <span class="stat-card__label">Provinsi</span>
          </div>
          <div class="stat-card">
            <span class="stat-card__number">{{ stats.total_kota || '...' }}</span>
            <span class="stat-card__label">Kota/Kabupaten</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section__title">Kenapa Santri Connect?</h2>
        <div class="features__grid">
          <div class="feature-card">
            <div class="feature-card__icon">🔍</div>
            <h3 class="feature-card__title">Pencarian Mudah</h3>
            <p class="feature-card__text">Cari pesantren berdasarkan lokasi, biaya, fasilitas, dan kurikulum.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">📊</div>
            <h3 class="feature-card__title">Rekomendasi Cerdas</h3>
            <p class="feature-card__text">Dapatkan rekomendasi pesantren terbaik sesuai budget dan preferensi Anda.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">⚖️</div>
            <h3 class="feature-card__title">Bandingkan</h3>
            <p class="feature-card__text">Bandingkan hingga 3 pesantren secara side-by-side.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">📝</div>
            <h3 class="feature-card__title">Daftar Online</h3>
            <p class="feature-card__text">Daftar langsung dari platform dan lacak status pendaftaran Anda.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { publicApi } from '../services'

const stats = ref({ total_pesantren: 0, total_provinsi: 0, total_kota: 0 })

onMounted(async () => {
  try {
    const { data } = await publicApi.getStats()
    stats.value = data.data
  } catch {
    // Stats will show as 0 if API fails
  }
})
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--color-primary-bg) 0%, var(--color-surface) 100%);
  padding: 5rem 0;
  text-align: center;
}

.hero__title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
}

.hero__subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto 2rem;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  transition: all var(--transition-base);
  cursor: pointer;
  text-decoration: none;
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover {
  background: var(--color-primary-dark);
  color: white;
}

.btn--outline {
  background: var(--color-surface);
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
}

.btn--outline:hover {
  background: var(--color-primary-bg);
  color: var(--color-primary-dark);
}

.stats {
  padding: 3rem 0;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  text-align: center;
}

.stat-card__number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.stat-card__label {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.features {
  padding: 4rem 0;
}

.section__title {
  text-align: center;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.feature-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all var(--transition-base);
}

.feature-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.feature-card__icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-card__text {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero__title { font-size: 1.875rem; }
  .stats__grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .features__grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 480px) {
  .features__grid { grid-template-columns: 1fr; }
}
</style>
