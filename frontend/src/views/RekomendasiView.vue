<template>
  <div class="py-4 py-md-5">
    <div class="container">
      <div class="text-center mb-4 mb-md-5">
        <h1 class="fw-bold">Rekomendasi Pesantren</h1>
        <p class="text-muted">Dapatkan rekomendasi pesantren terbaik berdasarkan preferensi Anda</p>
      </div>

      <div class="row g-4">
        <div class="col-lg-4">
          <div class="card shadow-sm mb-3">
            <div class="card-body p-4">
              <h5 class="card-title fw-semibold mb-3">Preferensi Anda</h5>
              <form @submit.prevent="cariRekomendasi">
                <div class="mb-3">
                  <label class="form-label fw-medium">Budget Bulanan (Rp)</label>
                  <input
                    v-model.number="form.budget"
                    type="number"
                    class="form-control"
                    required
                    min="0"
                    placeholder="Contoh: 5000000"
                  />
                  <div v-if="form.budget" class="text-primary fw-semibold small mt-1">
                    {{ formatCurrency(form.budget) }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-medium">Provinsi (opsional)</label>
                  <select v-model="form.provinsi" class="form-select">
                    <option value="">Semua Provinsi</option>
                    <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-medium">Fasilitas yang Diinginkan</label>
                  <div class="row g-2">
                    <div v-for="f in fasilitasOptions" :key="f" class="col-6">
                      <div class="form-check">
                        <input
                          :value="f"
                          v-model="form.fasilitas"
                          class="form-check-input"
                          type="checkbox"
                          :id="`fas-${f}`"
                        />
                        <label class="form-check-label small" :for="`fas-${f}`">{{ f }}</label>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  🔍 Cari Rekomendasi
                </button>
              </form>
            </div>
          </div>

          <div class="card bg-primary bg-opacity-10 border-primary mb-3">
            <div class="card-body p-4">
              <h6 class="fw-semibold mb-3">💡 Cara Kerja Scoring</h6>
              <div class="d-flex flex-column gap-2">
                <div class="d-flex justify-content-between small">
                  <span class="text-muted">Skor Budget</span>
                  <span class="fw-bold text-primary">40%</span>
                </div>
                <div class="d-flex justify-content-between small">
                  <span class="text-muted">Skor Lokasi</span>
                  <span class="fw-bold text-primary">30%</span>
                </div>
                <div class="d-flex justify-content-between small">
                  <span class="text-muted">Skor Fasilitas</span>
                  <span class="fw-bold text-primary">30%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div v-if="loading && searched" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Menghitung rekomendasi...</p>
          </div>

          <div v-else-if="searched && results.length === 0" class="text-center py-5">
            <p class="fs-1 mb-3">🔍</p>
            <h5 class="fw-semibold">Tidak ada rekomendasi</h5>
            <p class="text-muted">Coba ubah budget atau preferensi Anda</p>
          </div>

          <div v-else-if="results.length > 0">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="fw-semibold mb-0">Hasil Rekomendasi</h5>
              <span class="badge bg-primary rounded-pill">{{ results.length }} pesantren</span>
            </div>

            <div class="d-flex flex-column gap-3">
              <div
                v-for="(item, index) in results"
                :key="item.pesantren?.id || index"
                class="card shadow-sm"
              >
                <div class="card-body p-4">
                  <div class="row align-items-start">
                    <div class="col-auto text-center" style="min-width: 60px">
                      <span class="fs-3 fw-bold text-primary">#{{ index + 1 }}</span>
                    </div>
                    <div class="col">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 class="fw-semibold mb-1">{{ item.pesantren?.nama || 'Pesantren' }}</h5>
                          <p class="text-muted small mb-0">📍 {{ item.pesantren?.kota }}, {{ item.pesantren?.province }}</p>
                        </div>
                        <div class="text-center">
                          <span class="fs-3 fw-bold text-primary">{{ Math.round((item.score || 0) * 100) }}%</span>
                          <br><small class="text-muted">Cocok</small>
                        </div>
                      </div>

                      <div class="mb-3">
                        <div v-for="(label, key) in scoreLabels" :key="key" class="mb-2">
                          <div class="d-flex justify-content-between small mb-1">
                            <span class="text-muted">{{ label }}</span>
                            <span class="fw-medium">{{ Math.round((item[key] || 0) * 100) }}%</span>
                          </div>
                          <div class="progress" style="height: 6px">
                            <div
                              class="progress-bar"
                              :class="getScoreBarClass(item[key])"
                              :style="{ width: `${(item[key] || 0) * 100}%` }"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div class="d-flex flex-wrap gap-2 align-items-center">
                        <span v-if="item.pesantren?.biaya_bulanan" class="badge bg-success">
                          💰 {{ formatCurrency(item.pesantren.biaya_bulanan) }}/bulan
                        </span>
                        <span v-if="item.pesantren?.kurikulum" class="badge" :class="getKurikulumClass(item.pesantren.kurikulum)">
                          {{ item.pesantren.kurikulum }}
                        </span>
                        <span v-if="item.pesantren?.jumlah_santri" class="badge bg-secondary">
                          👥 {{ formatNumber(item.pesantren.jumlah_santri) }} santri
                        </span>
                        <div class="ms-auto d-flex gap-2">
                          <router-link
                            :to="`/pesantren/${item.pesantren?.id}`"
                            class="btn btn-outline-primary btn-sm"
                          >
                            Detail
                          </router-link>
                          <button
                            class="btn btn-sm"
                            :class="compareStore.isSelected(item.pesantren?.id) ? 'btn-primary' : 'btn-outline-secondary'"
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
            <p class="fs-1 mb-3">📊</p>
            <h5 class="fw-semibold">Isi preferensi Anda</h5>
            <p class="text-muted">Masukkan budget dan preferensi untuk mendapatkan rekomendasi pesantren terbaik</p>
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
  if (!score || score === 0) return 'bg-secondary'
  if (score > 0.7) return 'bg-success'
  if (score > 0.4) return 'bg-warning'
  return 'bg-primary'
}

function getKurikulumClass(kurikulum) {
  const classes = {
    modern: 'bg-info text-white',
    salaf: 'bg-success text-white',
    campuran: 'bg-warning text-dark'
  }
  return classes[kurikulum] || 'bg-secondary'
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
