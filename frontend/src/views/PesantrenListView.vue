<template>
  <div class="py-4 md:py-5">
    <div class="container">
      <div class="text-center mb-4 md:mb-5">
        <h1 class="font-bold text-3xl">Daftar Pesantren</h1>
        <p class="text-muted mt-2">Temukan pesantren yang sesuai untuk putra-putri Anda</p>
      </div>

      <div class="card mb-4">
        <div class="p-3">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="form-label text-sm text-muted mb-1">Provinsi</label>
              <select class="form-select" v-model="filters.province" @change="onProvinceChange">
                <option value="">Semua Provinsi</option>
                <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
              </select>
            </div>
            <div>
              <label class="form-label text-sm text-muted mb-1">Kota</label>
              <select class="form-select" v-model="filters.kota" @change="fetchData" :disabled="!cities.length">
                <option value="">Semua Kota</option>
                <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div>
              <label class="form-label text-sm text-muted mb-1">Kurikulum</label>
              <select class="form-select" v-model="filters.kurikulum" @change="fetchData">
                <option value="">Semua Kurikulum</option>
                <option value="modern">Modern</option>
                <option value="salaf">Salaf</option>
                <option value="campuran">Campuran</option>
              </select>
            </div>
            <div>
              <label class="form-label text-sm text-muted mb-1">Urutkan</label>
              <select class="form-select" v-model="sortField" @change="fetchData">
                <option value="">Default</option>
                <option value="nama">Nama</option>
                <option value="tahun_berdiri">Tahun Berdiri</option>
                <option value="jumlah_santri">Jumlah Santri</option>
                <option value="biaya_bulanan">Biaya Bulanan</option>
              </select>
            </div>
            <div>
              <label class="form-label text-sm text-muted mb-1">Urutan</label>
              <select class="form-select" v-model="sortOrder" @change="fetchData">
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
        <p class="text-5xl mb-3">🕌</p>
        <h5 class="font-semibold text-xl">Tidak ada pesantren ditemukan</h5>
        <p class="text-muted mt-2">Coba ubah filter atau kata kunci pencarian Anda</p>
      </div>

      <div v-else>
        <div class="flex justify-between items-center mb-3">
          <span class="text-muted text-sm">Menampilkan {{ pesantren.length }} dari {{ totalRecords }} pesantren</span>
          <router-link v-if="compareStore.hasItems" to="/compare" class="btn btn-sm btn-outline-primary">
            ⚖️ Bandingkan ({{ compareStore.count }})
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div v-for="p in pesantren" :key="p.id" class="col">
            <div class="card h-full flex flex-col">
               <div class="p-4 flex flex-col flex-grow">
                  <!-- Foto Utama -->
                  <div v-if="p.foto_utama" class="aspect-video mb-3">
                    <img 
                      :src="`/uploads/pesantrenImages/${p.foto_utama}`" 
                      :alt="p.nama" 
                      class="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div v-else class="aspect-video mb-3 bg-muted flex items-center justify-content-center">
                    <span class="text-muted">Tidak ada foto</span>
                  </div>
                  
                  <div class="flex justify-between items-start mb-2">
                    <h5 class="font-semibold mb-0" style="font-size: 1rem;">{{ p.nama }}</h5>
                    <span class="badge" :class="kurikulumBadge(p.kurikulum)">{{ p.kurikulum || '-' }}</span>
                  </div>
                  <p class="text-muted text-sm mb-1">📍 {{ p.kota }}, {{ p.province }}</p>
                  <p v-if="p.alamat" class="text-muted text-sm mb-2" style="font-size: 0.8rem;">{{ p.alamat }}</p>

                  <div class="flex gap-3 mb-2 flex-wrap">
                    <div v-if="p.jumlah_santri">
                      <span class="font-semibold text-sm text-primary">{{ formatNumber(p.jumlah_santri) }}</span>
                      <br><small class="text-muted" style="font-size: 0.7rem;">Santri</small>
                    </div>
                    <div v-if="p.jumlah_pengajar">
                      <span class="font-semibold text-sm text-primary">{{ formatNumber(p.jumlah_pengajar) }}</span>
                      <br><small class="text-muted" style="font-size: 0.7rem;">Pengajar</small>
                    </div>
                    <div v-if="p.biaya_bulanan">
                      <span class="font-semibold text-sm text-primary">{{ formatCurrency(p.biaya_bulanan) }}</span>
                      <br><small class="text-muted" style="font-size: 0.7rem;">/bulan</small>
                    </div>
                  </div>

                  <div v-if="p.fasilitas && p.fasilitas.length" class="flex flex-wrap gap-1 mb-3">
                    <span v-for="f in p.fasilitas.slice(0, 4)" :key="f" class="badge bg-muted text-foreground border" style="font-size: 0.7rem;">{{ f }}</span>
                    <span v-if="p.fasilitas.length > 4" class="badge bg-primary/10 text-primary border-0" style="font-size: 0.7rem;">+{{ p.fasilitas.length - 4 }}</span>
                  </div>

                  <div class="mt-auto flex gap-2">
                    <router-link :to="`/pesantren/${p.id}`" class="btn btn-primary btn-sm flex-1">Lihat Detail</router-link>
                    <button
                      class="btn btn-sm"
                      :class="compareStore.isSelected(p.id) ? 'btn-primary' : 'btn-outline'"
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

        <nav class="flex justify-center">
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
    modern: 'badge-primary',
    salaf: 'bg-green-100 text-green-800',
    campuran: 'bg-yellow-100 text-yellow-800'
  }
  return map[kurikulum] || 'bg-gray-100 text-gray-800'
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

.bg-green-100 {
  background-color: #dcfce7 !important;
}
.text-green-800 {
  color: #166534 !important;
}
.bg-yellow-100 {
  background-color: #fef9c3 !important;
}
.text-yellow-800 {
  color: #854d0e !important;
}
.bg-gray-100 {
  background-color: #f3f4f6 !important;
}
.text-gray-800 {
  color: #1f2937 !important;
}

.justify-content-center {
  justify-content: center;
}
.align-items-center {
  align-items: center;
}
</style>
