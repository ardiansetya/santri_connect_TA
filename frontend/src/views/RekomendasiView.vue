<template>
  <div class="py-4 md:py-5">
    <div class="container">
      <!-- Hero Header -->
      <div class="text-center mb-8">
        <h1 class="font-bold text-3xl text-blue-600 mb-2">
          Rekomendasi Pesantren Pintar
        </h1>
        <p class="text-muted mt-2 text-base max-w-2xl mx-auto">Dapatkan rekomendasi pesantren terbaik yang sesuai dengan budget dan preferensi Anda</p>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Left Sidebar - Form -->
        <div class="lg:col-span-1">
          <div class="space-y-6">
            <!-- Preferences Form -->
            <div class="card border-0 shadow-xl sticky" style="top: 6rem;">
              <div class="p-6">
                <h3 class="font-bold text-lg mb-5 flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                  Preferensi Anda
                </h3>
                
                <form @submit.prevent="cariRekomendasi" class="space-y-5">
                  <!-- Budget Input -->
                  <div>
                    <label class="form-label text-sm font-semibold mb-2 block">Budget Bulanan</label>
                    <div class="relative">
                      <!-- <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">Rp</span> -->
                      <input
                        v-model.number="form.budget"
                        type="number"
                        class="form-input pl-10 pr-4"
                        required
                        min="0"
                        placeholder="Contoh: 5000000"
                      />
                    </div>
                    <div v-if="form.budget" class="mt-2 px-3 py-2 bg-blue-50 rounded-lg">
                      <div class="text-xs text-muted">Budget Anda:</div>
                      <div class="font-bold text-blue-600">{{ formatCurrency(form.budget) }}</div>
                    </div>
                  </div>

                  <!-- Province Select -->
                  <div>
                    <label class="form-label text-sm font-semibold mb-2 block">Lokasi Provinsi</label>
                    <select v-model="form.provinsi" class="form-select w-full">
                      <option value="">Semua Provinsi</option>
                      <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                    </select>
                  </div>

                  <!-- Fasilitas Checkboxes -->
                  <div>
                    <label class="form-label text-sm font-semibold mb-3 block">Fasilitas Diinginkan</label>
                    <div class="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      <label v-for="f in fasilitasOptions" :key="f" class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <input
                          :value="f"
                          v-model="form.fasilitas"
                          type="checkbox"
                          class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span class="text-sm">{{ f }}</span>
                      </label>
                    </div>
                    <div v-if="form.fasilitas.length > 0" class="mt-2 text-xs text-purple-600 font-medium">
                      {{ form.fasilitas.length }} fasilitas dipilih
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <button type="submit" class="btn w-full py-3 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all" :disabled="loading">
                    <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <div v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    {{ loading ? 'Mencari...' : '🔍 Cari Rekomendasi' }}
                  </button>
                </form>
              </div>

              <!-- Scoring Info Card -->
              <div class="p-6 border-t border-border bg-blue-50">
                <h4 class="font-bold text-sm mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Cara Kerja Scoring
                </h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span class="text-sm text-muted">Budget</span>
                    </div>
                    <span class="font-bold text-green-600">40%</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span class="text-sm text-muted">Lokasi</span>
                    </div>
                    <span class="font-bold text-blue-600">30%</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span class="text-sm text-muted">Fasilitas</span>
                    </div>
                    <span class="font-bold text-purple-600">30%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - Results -->
        <div class="lg:col-span-3">
          <!-- Loading State -->
          <div v-if="loading && searched" class="text-center py-20 card border-0 shadow-lg">
            <div class="py-8">
              <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
              <p class="mt-6 text-muted text-lg">Menghitung rekomendasi terbaik untuk Anda...</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="searched && results.length === 0" class="text-center py-20 card border-0 shadow-lg">
            <div class="py-8">
              <div class="text-7xl mb-4">🔍</div>
              <h3 class="font-semibold text-2xl mb-2">Tidak ada rekomendasi</h3>
              <p class="text-muted text-lg mb-6">Coba ubah budget atau preferensi Anda untuk mendapatkan hasil yang lebih baik</p>
              <button @click="searched = false" class="btn btn-outline px-6 py-2">
                Ubah Preferensi
              </button>
            </div>
          </div>

          <!-- Results -->
          <div v-else-if="results.length > 0">
            <!-- Results Header -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="font-bold text-2xl mb-1">Hasil Rekomendasi</h2>
                <p class="text-muted text-sm">Ditemukan {{ results.length }} pesantren yang cocok</p>
              </div>
              <span class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm shadow-lg">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                {{ results.length }} Pesantren
              </span>
            </div>

            <!-- Results List -->
            <div class="space-y-4">
              <div 
                v-for="(item, index) in results" 
                :key="item.pesantren?.id"
                class="card border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                :class="index === 0 ? 'ring-2 ring-yellow-400' : ''"
              >
                <div class="grid grid-cols-1 md:grid-cols-4">
                  <!-- Rank & Score Column -->
                  <div class="md:col-span-1 bg-blue-50 p-6 flex flex-col justify-center items-center border-r border-border">
                    <div class="text-center">
                      <div class="mb-3">
                        <span v-if="index === 0" class="text-5xl">🥇</span>
                        <span v-else-if="index === 1" class="text-5xl">🥈</span>
                        <span v-else-if="index === 2" class="text-5xl">🥉</span>
                        <span v-else class="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full text-xl font-bold text-gray-700">#{{ index + 1 }}</span>
                      </div>
                      <div class="text-4xl font-bold text-blue-600 mb-1">
                        {{ Math.round((item.score || 0) * 100) }}%
                      </div>
                      <div class="text-sm text-muted font-medium">Cocok</div>
                      
                      <!-- Score Breakdown -->
                      <div class="mt-4 space-y-2 text-xs">
                        <div class="flex items-center justify-between">
                          <span class="text-muted">Budget</span>
                          <div class="w-16 bg-gray-200 rounded-full h-1.5">
                            <div class="bg-green-500 h-1.5 rounded-full" :style="{ width: `${(item.budget_score || 0) * 100}%` }"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-muted">Lokasi</span>
                          <div class="w-16 bg-gray-200 rounded-full h-1.5">
                            <div class="bg-blue-500 h-1.5 rounded-full" :style="{ width: `${(item.location_score || 0) * 100}%` }"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-muted">Fasilitas</span>
                          <div class="w-16 bg-gray-200 rounded-full h-1.5">
                            <div class="bg-purple-500 h-1.5 rounded-full" :style="{ width: `${(item.fasilitas_score || 0) * 100}%` }"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Main Info Column -->
                  <div class="md:col-span-3 p-6">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div class="flex-1">
                        <router-link 
                          :to="`/pesantren/${item.pesantren?.id}`" 
                          class="text-xl font-bold text-primary hover:underline mb-2 block"
                        >
                          {{ item.pesantren?.nama }}
                        </router-link>
                        <p class="text-muted text-sm mb-3 flex items-center gap-1">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.5l-4.95-4.55a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                          </svg>
                          {{ item.pesantren?.kota }}, {{ item.pesantren?.province }}
                        </p>

                        <!-- Tags -->
                        <div class="flex flex-wrap gap-2 mb-3">
                          <span v-if="item.pesantren?.biaya_bulanan" class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            {{ formatCurrency(item.pesantren.biaya_bulanan) }}/bulan
                          </span>
                          <span v-if="item.pesantren?.kurikulum" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {{ item.pesantren.kurikulum }}
                          </span>
                          <span v-if="item.pesantren?.jumlah_santri" class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                            {{ formatNumber(item.pesantren.jumlah_santri) }} Santri
                          </span>
                        </div>

                        <!-- Fasilitas Match -->
                        <div v-if="item.fasilitas_match && item.fasilitas_match.length > 0" class="text-sm">
                          <div class="text-muted mb-1">Fasilitas cocok:</div>
                          <div class="flex flex-wrap gap-1">
                            <span v-for="f in item.fasilitas_match.slice(0, 4)" :key="f" class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                              {{ f }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Action Buttons -->
                      <div class="flex md:flex-col gap-2">
                        <router-link 
                          :to="`/pesantren/${item.pesantren?.id}`" 
                          class="btn btn-primary px-4 py-2 text-sm"
                        >
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          Detail
                        </router-link>
                        <button
                          @click="toggleCompare(item.pesantren?.id)"
                          class="btn px-3 py-2 text-sm"
                          :class="compareStore.isSelected(item.pesantren?.id) ? 'bg-purple-500 text-white' : 'btn-outline'"
                        >
                          <svg v-if="compareStore.isSelected(item.pesantren?.id)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Initial State -->
          <div v-else class="text-center py-20 card border-0 shadow-lg">
            <div class="py-8">
              <div class="text-7xl mb-4">📊</div>
              <h3 class="font-semibold text-2xl mb-2">Siap Mendapatkan Rekomendasi?</h3>
              <p class="text-muted text-lg max-w-md mx-auto mb-6">Masukkan budget dan preferensi Anda di form sebelah kiri untuk mendapatkan rekomendasi pesantren terbaik</p>
              <div class="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 rounded-full text-blue-700 font-medium">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
                Isi form di samping untuk memulai
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCompareStore } from '../stores/compare'
import { pesantren as pesantrenApi, wilayah } from '../services'

const compareStore = useCompareStore()

const form = ref({
  budget: null,
  provinsi: '',
  fasilitas: []
})

const provinces = ref([])
const results = ref([])
const loading = ref(false)
const searched = ref(false)

const fasilitasOptions = [
  'Masjid', 'Asrama', 'Lab Komputer', 'Perpustakaan',
  'Lapangan Olahraga', 'Kantin', 'Klinik', 'Ruang Kelas AC',
  'Tempat Parkir', 'WiFi'
]

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function toggleCompare(id) {
  if (!id) return
  if (compareStore.isSelected(id)) {
    compareStore.remove(id)
  } else {
    compareStore.add(id)
  }
}

async function loadProvinces() {
  try {
    const { data } = await wilayah.getProvinces()
    provinces.value = data.data || []
  } catch {
    provinces.value = []
  }
}

async function cariRekomendasi() {
  if (!form.value.budget) return
  
  loading.value = true
  searched.value = true
  
  try {
    const { data } = await pesantrenApi.getRekomendasi(form.value)
    results.value = data.data || []
  } catch (e) {
    console.error(e)
    results.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadProvinces()
})
</script>

<style scoped>
/* All styles using Tailwind CSS */
</style>
