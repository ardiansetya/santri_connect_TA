<template>
  <div class="py-4 py-md-5">
    <div class="container">
      <div class="text-center mb-4 mb-md-5">
        <h1 class="fw-bold">Daftar Pesantren</h1>
        <p class="text-muted">Temukan pesantren yang sesuai untuk putra-putri Anda</p>
      </div>

      <div class="card shadow-sm mb-4">
        <div class="card-body p-3">
          <div class="row g-3">
            <div class="col-md-3 col-6">
              <label class="form-label small text-muted mb-1">Provinsi</label>
              <select class="form-select form-select-sm" v-model="filters.province" @change="onProvinceChange">
                <option value="">Semua Provinsi</option>
                <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
              </select>
            </div>
            <div class="col-md-3 col-6">
              <label class="form-label small text-muted mb-1">Kota</label>
              <select class="form-select form-select-sm" v-model="filters.kota" @change="fetchData" :disabled="!cities.length">
                <option value="">Semua Kota</option>
                <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div class="col-md-3 col-6">
              <label class="form-label small text-muted mb-1">Kurikulum</label>
              <select class="form-select form-select-sm" v-model="filters.kurikulum" @change="fetchData">
                <option value="">Semua Kurikulum</option>
                <option value="modern">Modern</option>
                <option value="salaf">Salaf</option>
                <option value="campuran">Campuran</option>
              </select>
            </div>
            <div class="col-md-3 col-6">
              <label class="form-label small text-muted mb-1">Urutkan</label>
              <select class="form-select form-select-sm" v-model="sortField" @change="fetchData">
                <option value="">Default</option>
                <option value="nama">Nama</option>
                <option value="tahun_berdiri">Tahun Berdiri</option>
                <option value="jumlah_santri">Jumlah Santri</option>
                <option value="biaya_bulanan">Biaya Bulanan</option>
              </select>
            </div>
            <div class="col-md-3 col-6">
              <label class="form-label small text-muted mb-1">Urutan</label>
              <select class="form-select form-select-sm" v-model="sortOrder" @change="fetchData">
                <option value="asc">Naik (A-Z)</option>
                <option value="desc">Turun (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-muted">Memuat data pesantren...</p>
      </div>

      <div v-else-if="pesantren.length === 0" class="text-center py-5">
        <p class="fs-1 mb-3">🕌</p>
        <h5 class="fw-semibold">Tidak ada pesantren ditemukan</h5>
        <p class="text-muted">Coba ubah filter atau kata kunci pencarian Anda</p>
      </div>

      <div v-else>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted small">Menampilkan {{ pesantren.length }} dari {{ totalRecords }} pesantren</span>
          <router-link v-if="compareStore.hasItems" to="/compare" class="btn btn-sm btn-outline-primary">
            ⚖️ Bandingkan ({{ compareStore.count }})
          </router-link>
        </div>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
          <div v-for="p in pesantren" :key="p.id" class="col">
            <div class="card h-100 shadow-sm hover-card">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title fw-semibold mb-0" style="font-size: 1rem;">{{ p.nama }}</h5>
                  <span class="badge" :class="kurikulumBadge(p.kurikulum)">{{ p.kurikulum || '-' }}</span>
                </div>
                <p class="text-muted small mb-1">📍 {{ p.kota }}, {{ p.province }}</p>
                <p v-if="p.alamat" class="text-muted small mb-2" style="font-size: 0.8rem;">{{ p.alamat }}</p>

                <div class="d-flex gap-3 mb-2 flex-wrap">
                  <div v-if="p.jumlah_santri">
                    <span class="fw-semibold small text-primary">{{ formatNumber(p.jumlah_santri) }}</span>
                    <br><small class="text-muted" style="font-size: 0.7rem;">Santri</small>
                  </div>
                  <div v-if="p.jumlah_pengajar">
                    <span class="fw-semibold small text-primary">{{ formatNumber(p.jumlah_pengajar) }}</span>
                    <br><small class="text-muted" style="font-size: 0.7rem;">Pengajar</small>
                  </div>
                  <div v-if="p.biaya_bulanan">
                    <span class="fw-semibold small text-primary">{{ formatCurrency(p.biaya_bulanan) }}</span>
                    <br><small class="text-muted" style="font-size: 0.7rem;">/bulan</small>
                  </div>
                </div>

                <div v-if="p.fasilitas && p.fasilitas.length" class="d-flex flex-wrap gap-1 mb-3">
                  <span v-for="f in p.fasilitas.slice(0, 4)" :key="f" class="badge bg-light text-dark border" style="font-size: 0.7rem;">{{ f }}</span>
                  <span v-if="p.fasilitas.length > 4" class="badge bg-primary bg-opacity-10 text-primary border-0" style="font-size: 0.7rem;">+{{ p.fasilitas.length - 4 }}</span>
                </div>

                <div class="mt-auto d-flex gap-2">
                  <router-link :to="`/pesantren/${p.id}`" class="btn btn-primary btn-sm flex-grow-1">Lihat Detail</router-link>
                  <button
                    class="btn btn-sm"
                    :class="compareStore.isSelected(p.id) ? 'btn-primary' : 'btn-outline-secondary'"
                    :disabled="compareStore.isFull && !compareStore.isSelected(p.id)"
                    @click="toggleCompare(p.id)"
                    :title="compareStore.isSelected(p.id) ? 'Hapus dari bandingkan' : 'Tambahkan ke bandingkan'"
                  >
                    {{ compareStore.isSelected(p.id) ? '✓' : '⚖️' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav class="d-flex justify-content-center">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage <= 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">&laquo;</button>
            </li>
            <li class="page-item disabled">
              <span class="page-link">Halaman {{ currentPage }} / {{ totalPages }}</span>
            </li>
            <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
              <button class="page-link" @click="changePage(currentPage + 1)">&raquo;</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { pesantren as pesantrenApi, wilayah } from '../services'
import { useCompareStore } from '../stores/compare'

const compareStore = useCompareStore()

const pesantren = ref([])
const loading = ref(false)
const provinces = ref([])
const cities = ref([])
const currentPage = ref(1)
const limit = ref(12)
const totalRecords = ref(0)
const sortField = ref('')
const sortOrder = ref('asc')

const filters = ref({
  province: '',
  kota: '',
  kurikulum: ''
})

const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value))

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function kurikulumBadge(kurikulum) {
  const map = {
    modern: 'bg-primary',
    salaf: 'bg-success',
    campuran: 'bg-warning text-dark'
  }
  return map[kurikulum] || 'bg-secondary'
}

function toggleCompare(id) {
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

async function onProvinceChange() {
  filters.value.kota = ''
  cities.value = []
  if (!filters.value.province) {
    await fetchData()
    return
  }
  try {
    const province = provinces.value.find(p => p.name === filters.value.province)
    if (province) {
      const { data } = await wilayah.getRegencies(province.id)
      cities.value = (data.data || []).map(r => r.name)
    }
  } catch {
    cities.value = []
  }
  await fetchData()
}

async function fetchData() {
  loading.value = true
  currentPage.value = 1
  try {
    const params = {
      page: 1,
      limit: limit.value,
      sort: sortField.value || undefined,
      order: sortOrder.value
    }
    if (filters.value.province) params.province = filters.value.province
    if (filters.value.kota) params.kota = filters.value.kota
    if (filters.value.kurikulum) params.kurikulum = filters.value.kurikulum

    const { data } = await pesantrenApi.list(params)
    pesantren.value = data.data || []
    totalRecords.value = data.meta?.total || data.data?.length || 0
  } catch {
    pesantren.value = []
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

async function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loading.value = true
  try {
    const params = {
      page,
      limit: limit.value,
      sort: sortField.value || undefined,
      order: sortOrder.value
    }
    if (filters.value.province) params.province = filters.value.province
    if (filters.value.kota) params.kota = filters.value.kota
    if (filters.value.kurikulum) params.kurikulum = filters.value.kurikulum

    const { data } = await pesantrenApi.list(params)
    pesantren.value = data.data || []
  } catch {
    pesantren.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchProvinces()
  await fetchData()
})
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
