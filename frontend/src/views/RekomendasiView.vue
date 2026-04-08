<template>
  <div class="py-4 md:py-5">
    <div class="container">
      <div class="text-center mb-4 md:mb-5">
        <h1 class="font-bold text-3xl">Rekomendasi Pesantren</h1>
        <p class="text-muted mt-2">Dapatkan rekomendasi pesantren terbaik berdasarkan preferensi Anda</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div class="lg:col-span-4 xl:col-span-1">
          <div class="card mb-3">
            <div class="p-4">
              <h5 class="font-semibold mb-3">Preferensi Anda</h5>
              <form @submit.prevent="cariRekomendasi">
                <div class="mb-3">
                  <label class="form-label font-medium">Budget Bulanan (Rp)</label>
                  <input
                    v-model.number="form.budget"
                    type="number"
                    class="form-input"
                    required
                    min="0"
                    placeholder="Contoh: 5000000"
                  />
                  <div v-if="form.budget" class="text-primary font-semibold text-sm mt-1">
                    {{ formatCurrency(form.budget) }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label font-medium">Provinsi (opsional)</label>
                  <select v-model="form.provinsi" class="form-select">
                    <option value="">Semua Provinsi</option>
                    <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label font-medium">Fasilitas yang Diinginkan</label>
                  <div class="grid grid-cols-2 gap-2">
                    <div v-for="f in fasilitasOptions" :key="f">
                      <div class="flex items-center">
                        <input
                          :value="f"
                          v-model="form.fasilitas"
                          class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          type="checkbox"
                          :id="`fas-${f}`"
                        />
                        <label class="ml-2 text-sm" :for="`fas-${f}`">{{ f }}</label>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-full" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  🔍 Cari Rekomendasi
                </button>
              </form>
            </div>
          </div>

          <div class="card bg-primary/10 border-primary mb-3">
            <div class="p-4">
              <h6 class="font-semibold mb-3">💡 Cara Kerja Scoring</h6>
              <div class="flex flex-col gap-2">
                <div class="flex justify-between text-sm">
                  <span class="text-muted">Skor Budget</span>
                  <span class="font-bold text-primary">40%</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-muted">Skor Lokasi</span>
                  <span class="font-bold text-primary">30%</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-muted">Skor Fasilitas</span>
                  <span class="font-bold text-primary">30%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3 xl:col-span-3">
          <div v-if="loading && searched" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Menghitung rekomendasi...</p>
          </div>

          <div v-else-if="searched && results.length === 0" class="text-center py-5">
            <p class="text-5xl mb-3">🔍</p>
            <h5 class="font-semibold">Tidak ada rekomendasi</h5>
            <p class="text-muted mt-2">Coba ubah budget atau preferensi Anda</p>
          </div>

          <div v-else-if="results.length > 0">
            <div class="flex items-center justify-between mb-3">
              <h5 class="font-semibold mb-0">Hasil Rekomendasi</h5>
              <span class="badge badge-primary rounded-full">{{ results.length }} pesantren</span>
            </div>

            <div class="flex flex-col gap-3">
              <div
                v-for="(item, index) in results"
                :key="item.pesantren?.id || index"
                class="card"
              >
                <div class="p-4">
                  <div class="flex items-start">
                    <div class="text-center" style="min-width: 60px">
                      <span class="text-3xl font-bold text-primary">#{{ index + 1 }}</span>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start mb-3">
                        <div>
                          <h5 class="font-semibold mb-1">{{ item.pesantren?.nama || 'Pesantren' }}</h5>
                          <p class="text-muted text-sm mb-0">📍 {{ item.pesantren?.kota }}, {{ item.pesantren?.province }}</p>
                        </div>
                        <div class="text-center">
                          <span class="text-3xl font-bold text-primary">{{ Math.round((item.score || 0) * 100) }}%</span>
                          <br><small class="text-muted">Cocok</small>
                        </div>
                      </div>

                      <div class="mb-3">
                        <div v-for="(label, key) in scoreLabels" :key="key" class="mb-2">
                          <div class="flex justify-between text-sm mb-1">
                            <span class="text-muted">{{ label }}</span>
                            <span class="font-medium">{{ Math.round((item[key] || 0) * 100) }}%</span>
                          </div>
                          <div class="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              class="h-full rounded-full"
                              :class="getScoreBarClass(item[key])"
                              :style="{ width: `${(item[key] || 0) * 100}%` }"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div class="flex flex-wrap gap-2 items-center">
                        <span v-if="item.pesantren?.biaya_bulanan" class="badge bg-green-100 text-green-800">
                          💰 {{ formatCurrency(item.pesantren.biaya_bulanan) }}/bulan
                        </span>
                        <span v-if="item.pesantren?.kurikulum" class="badge" :class="getKurikulumClass(item.pesantren.kurikulum)">
                          {{ item.pesantren.kurikulum }}
                        </span>
                        <span v-if="item.pesantren?.jumlah_santri" class="badge bg-gray-100 text-gray-800">
                          👥 {{ formatNumber(item.pesantren.jumlah_santri) }} santri
                        </span>
                        <div class="ml-auto flex gap-2">
                          <router-link
                            :to="`/pesantren/${item.pesantren?.id}`"
                            class="btn btn-outline-primary btn-sm"
                          >
                            Detail
                          </router-link>
                          <button
                            class="btn btn-sm"
                            :class="compareStore.isSelected(item.pesantren?.id) ? 'btn-primary' : 'btn-outline'"
                            :disabled="compareStore.isFull && !compareStore.isSelected(item.pesantren?.id)"
                            @click="toggleCompare(item.pesantren?.id)"
                          >
                            {{ compareStore.isSelected(item.pesantren?.id) ? '✓' : '⚖️' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-5">
            <p class="text-5xl mb-3">📊</p>
            <h5 class="font-semibold">Isi preferensi Anda</h5>
            <p class="text-muted mt-2">Masukkan budget dan preferensi untuk mendapatkan rekomendasi pesantren terbaik</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { pesantren as pesantrenApi, wilayah } from '../services'
import { useCompareStore } from '../stores/compare'

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

const scoreLabels = {
  budget_score: 'Budget',
  location_score: 'Lokasi',
  facilities_score: 'Fasilitas'
}

const fasilitasOptions = [
  'Masjid', 'Asrama', 'Lab Komputer', 'Perpustakaan',
  'Lapangan Olahraga', 'Kantin', 'Klinik', 'Ruang Kelas AC',
  'Tempat Parkir', 'WiFi'
]

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function getScoreBarClass(score) {
  if (!score || score === 0) return 'bg-gray-400'
  if (score > 0.7) return 'bg-green-500'
  if (score > 0.4) return 'bg-yellow-500'
  return 'bg-primary'
}

function getKurikulumClass(kurikulum) {
  const classes = {
    modern: 'bg-blue-100 text-blue-800',
    salaf: 'bg-green-100 text-green-800',
    campuran: 'bg-yellow-100 text-yellow-800'
  }
  return classes[kurikulum] || 'bg-gray-100 text-gray-800'
}

function toggleCompare(id) {
  if (!id) return
  if (compareStore.isSelected(id)) {
    compareStore.remove(id)
  } else {
    compareStore.add(id)
  }
}

async function fetchProvinces() {
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
  results.value = []
  try {
    const payload = { budget: form.value.budget }
    if (form.value.provinsi) payload.provinsi = form.value.provinsi
    if (form.value.fasilitas.length > 0) payload.fasilitas = form.value.fasilitas

    const { data } = await pesantrenApi.getRekomendasi(payload)
    results.value = data.data || []
  } catch {
    results.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchProvinces()
})
</script>

<style scoped>
.bg-green-100 {
  background-color: #dcfce7 !important;
}
.text-green-800 {
  color: #166534 !important;
}
.bg-green-500 {
  background-color: #22c55e !important;
}
.bg-yellow-100 {
  background-color: #fef9c3 !important;
}
.text-yellow-800 {
  color: #854d0e !important;
}
.bg-yellow-500 {
  background-color: #eab308 !important;
}
.bg-blue-100 {
  background-color: #dbeafe !important;
}
.text-blue-800 {
  color: #1e40af !important;
}
.bg-gray-100 {
  background-color: #f3f4f6 !important;
}
.text-gray-800 {
  color: #1f2937 !important;
}
.bg-gray-400 {
  background-color: #9ca3af !important;
}

.rounded-full {
  border-radius: 9999px;
}
</style>
