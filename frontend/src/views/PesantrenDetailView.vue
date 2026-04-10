<template>
  <div class="container mx-auto px-4" style="padding-top: 1rem; padding-bottom: 2rem; margin-top: 1rem; margin-bottom: 1rem;">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
        <p class="mt-6 text-muted-foreground text-lg">Memuat data pesantren...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <h1 class="font-heading text-2xl font-bold">Pesantren tidak ditemukan</h1>
        <router-link to="/pesantren">
          <button class="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
            Kembali ke Daftar
          </button>
        </router-link>
      </div>

      <!-- Detail Content -->
      <template v-else-if="pesantren">
        <!-- Back Link -->
        <router-link
          to="/pesantren"
          class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Pesantren
        </router-link>

        <div class="grid gap-8 lg:grid-cols-3">
          <!-- Main content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Photo -->
            <div class="overflow-hidden rounded-xl">
              <img
                v-if="pesantren.foto_utama"
                :src="`/uploads/pesantrenImages/${pesantren.foto_utama}`"
                :alt="pesantren.nama"
                class="w-full aspect-video object-cover"
              />
              <div
                v-else
                class="w-full aspect-video bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center"
              >
                <div class="text-center">
                  <div class="text-7xl mb-4">🕌</div>
                  <p class="text-muted-foreground text-lg">Foto belum tersedia</p>
                </div>
              </div>
            </div>

            <!-- Title -->
            <div>
              <div class="flex items-start gap-3">
                <div class="flex-1">
                  <h1 class="font-heading text-2xl font-bold text-foreground lg:text-3xl">{{ pesantren.nama }}</h1>
                  <p class="mt-2 flex items-center gap-1.5 text-muted-foreground">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ pesantren.kota }}, {{ pesantren.province }}
                  </p>
                </div>
                <span v-if="pesantren.kurikulum" class="shrink-0 inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                  {{ pesantren.kurikulum }}
                </span>
              </div>
            </div>

            <!-- Tentang -->
            <div class="rounded-xl border border-border bg-card p-6">
              <h2 class="font-heading text-xl font-bold text-card-foreground">Tentang Pesantren</h2>
              <p class="mt-3 leading-relaxed text-muted-foreground">
                <span v-if="pesantren.deskripsi">{{ pesantren.deskripsi }}</span>
                <span v-else>
                  {{ pesantren.nama }} adalah salah satu pondok pesantren terkemuka di {{ pesantren.province }} yang menerapkan kurikulum {{ pesantren.kurikulum || 'umum' }}.
                  Dengan fasilitas lengkap dan pengajar berkualitas, pesantren ini telah mendidik ribuan santri dari berbagai daerah di Indonesia.
                </span>
              </p>
            </div>

            <!-- Info Grid -->
            <div class="grid gap-4 sm:grid-cols-3">
              <div v-if="pesantren.biaya_bulanan" class="rounded-xl border border-border bg-card p-4">
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Biaya Bulanan
                </div>
                <div class="mt-1 font-heading text-lg font-bold text-card-foreground">
                  {{ formatCurrency(pesantren.biaya_bulanan) }}
                  <span class="text-xs text-muted-foreground font-normal">/bulan</span>
                </div>
              </div>
              <div v-if="pesantren.jumlah_santri" class="rounded-xl border border-border bg-card p-4">
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Jumlah Santri
                </div>
                <div class="mt-1 font-heading text-lg font-bold text-card-foreground">
                  {{ formatNumber(pesantren.jumlah_santri) }} santri
                </div>
              </div>
              <div v-if="pesantren.kurikulum" class="rounded-xl border border-border bg-card p-4">
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Kurikulum
                </div>
                <div class="mt-1 font-heading text-lg font-bold text-card-foreground">
                  {{ pesantren.kurikulum }}
                </div>
              </div>
            </div>

            <!-- Fasilitas -->
            <div v-if="pesantren.fasilitas && pesantren.fasilitas.length" class="rounded-xl border border-border bg-card p-6">
              <h2 class="font-heading text-xl font-bold text-card-foreground">Fasilitas</h2>
              <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div v-for="f in pesantren.fasilitas" :key="f" class="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <svg class="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-card-foreground">{{ f }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-4">
            <div class="sticky top-20 space-y-4">
              <!-- Pricing Card -->
              <div class="rounded-xl border border-border bg-card p-6">
                <div class="text-center">
                  <p class="text-sm text-muted-foreground mb-1">Biaya Pendaftaran</p>
                  <div v-if="pesantren.biaya_pendaftaran" class="font-heading text-2xl font-bold text-primary">
                    {{ formatCurrency(pesantren.biaya_pendaftaran) }}
                  </div>
                  <div v-else class="font-heading text-2xl font-bold text-primary">-</div>
                </div>
                <div class="mt-6 space-y-4">
                  <router-link :to="`/pesantren/${pesantren.id}/daftar`" class="block mb-4">
                    <button class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-white hover:bg-primary/90 h-11">
                      <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Daftar Sekarang
                    </button>
                  </router-link>
                  <button 
                    class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-8 py-3 hover:bg-accent hover:text-accent-foreground h-11"
                    @click="toggleCompare"
                    :class="{ 'bg-green-50 border-green-500': compareStore.isSelected(pesantren.id) }"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    {{ compareStore.isSelected(pesantren.id) ? '✓ Dalam Perbandingan' : 'Bandingkan' }}
                  </button>
                </div>
              </div>

              <!-- Contact Card -->
              <div class="rounded-xl border border-border bg-card p-6">
                <h3 class="font-heading font-bold text-card-foreground">Kontak</h3>
                <div class="mt-4 space-y-3 text-sm">
                  <div v-if="pesantren.telepon" class="flex items-center gap-2 text-muted-foreground">
                    <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span class="truncate">{{ pesantren.telepon }}</span>
                  </div>
                  <div v-if="pesantren.email" class="flex items-center gap-2 text-muted-foreground">
                    <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="truncate">{{ pesantren.email }}</span>
                  </div>
                  <div v-if="pesantren.website" class="flex items-center gap-2 text-muted-foreground">
                    <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a :href="pesantren.website" target="_blank" class="truncate hover:underline">{{ pesantren.website }}</a>
                  </div>
                  <div v-if="!pesantren.telepon && !pesantren.email && !pesantren.website" class="text-muted-foreground text-sm">
                    Informasi kontak belum tersedia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCompareStore } from '@/stores/compare'
import { pesantren as pesantrenService } from '@/services'

const route = useRoute()
const compareStore = useCompareStore()

const pesantren = ref(null)
const loading = ref(true)
const error = ref('')

function formatNumber(num) {
  if (!num) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(amount)
}

function toggleCompare() {
  if (compareStore.isSelected(pesantren.value.id)) {
    compareStore.remove(pesantren.value.id)
  } else {
    compareStore.add(pesantren.value.id)
  }
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const id = route.params.id
    const { data } = await pesantrenService.getById(id)
    pesantren.value = data.data
    if (!pesantren.value) {
      error.value = 'Pesantren tidak ditemukan'
    }
  } catch (e) {
    error.value = 'Gagal memuat data pesantren'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchData()
})
</script>

<style scoped>
.sticky {
  position: sticky;
}
</style>
