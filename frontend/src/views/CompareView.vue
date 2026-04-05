<template>
  <div class="py-4 py-md-5">
    <div class="container">
      <div class="text-center mb-4 mb-md-5">
        <h1 class="fw-bold">Bandingkan Pesantren</h1>
        <p class="text-muted">Bandingkan hingga 3 pesantren pilihan Anda secara detail</p>
      </div>

      <div v-if="!compareStore.hasItems" class="card shadow-sm">
        <div class="card-body text-center py-5">
          <p class="fs-4 mb-3">⚖️</p>
          <h5 class="fw-semibold mb-2">Belum ada pesantren yang dibandingkan</h5>
          <p class="text-muted mb-3">Tambahkan pesantren dari daftar atau halaman detail</p>
          <router-link to="/pesantren" class="btn btn-primary">Cari Pesantren</router-link>
        </div>
      </div>

      <div v-else-if="loading" class="card shadow-sm">
        <div class="card-body text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 mb-0 text-muted">Memuat data perbandingan...</p>
        </div>
      </div>

      <div v-else-if="error" class="card shadow-sm">
        <div class="card-body text-center py-4">
          <p class="text-danger mb-3">{{ error }}</p>
          <button class="btn btn-outline-primary" @click="loadComparison">Coba Lagi</button>
        </div>
      </div>

      <div v-else-if="pesantrenData.length === 0" class="card shadow-sm">
        <div class="card-body text-center py-5">
          <p class="text-muted mb-0">Tidak ada data ditemukan untuk pesantren yang dipilih.</p>
        </div>
      </div>

      <div v-else>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted">Menampilkan {{ pesantrenData.length }} pesantren</span>
          <button class="btn btn-outline-danger btn-sm" @click="clearComparison">Hapus Semua</button>
        </div>

        <div class="card shadow-sm">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-bordered table-hover mb-0 comparison-table">
                <thead class="table-light">
                  <tr>
                    <th class="bg-light" style="width: 200px;">Kriteria</th>
                    <th v-for="p in pesantrenData" :key="p.id" class="text-center bg-light">
                      <div class="fw-semibold">{{ p.nama }}</div>
                      <button class="btn btn-link btn-sm text-danger p-0 mt-1" @click="removeItem(p.id)">
                        <small>Hapus</small>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="fw-medium">Provinsi</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center">{{ p.province || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Kota/Kabupaten</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center">{{ p.kota || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Alamat</td>
                    <td v-for="p in pesantrenData" :key="p.id">{{ p.alamat || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Kurikulum</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center">
                      <span class="badge" :class="badgeClass(p.kurikulum)">{{ p.kurikulum || '-' }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Tahun Berdiri</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center">{{ p.tahun_berdiri || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Jumlah Santri</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center">{{ formatNumber(p.jumlah_santri) }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Jumlah Pengajar</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center">{{ formatNumber(p.jumlah_pengajar) }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Biaya Bulanan</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center">{{ formatCurrency(p.biaya_bulanan) }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Biaya Pendaftaran</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center">{{ formatCurrency(p.biaya_pendaftaran) }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Fasilitas</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center">
                      <div v-if="p.fasilitas && p.fasilitas.length" class="d-flex flex-wrap gap-1 justify-content-center">
                        <span v-for="f in p.fasilitas" :key="f" class="badge bg-light text-dark border">{{ f }}</span>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Kontak</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center">
                      <div v-if="p.telepon || p.email">
                        <div v-if="p.telepon">📞 {{ p.telepon }}</div>
                        <div v-if="p.email">✉️ {{ p.email }}</div>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Aksi</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center">
                      <router-link :to="`/pesantren/${p.id}`" class="btn btn-primary btn-sm">Lihat Detail</router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCompareStore } from '../stores/compare'
import { pesantren as pesantrenApi } from '../services'

const compareStore = useCompareStore()

const pesantrenData = ref([])
const loading = ref(false)
const error = ref('')

function formatNumber(num) {
  if (!num) return '-'
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function badgeClass(kurikulum) {
  const map = {
    modern: 'bg-primary',
    salaf: 'bg-success',
    campuran: 'bg-warning text-dark'
  }
  return map[kurikulum?.toLowerCase()] || 'bg-secondary'
}

function removeItem(id) {
  compareStore.remove(id)
  if (compareStore.hasItems) {
    loadComparison()
  } else {
    pesantrenData.value = []
  }
}

function clearComparison() {
  compareStore.clear()
  pesantrenData.value = []
}

async function loadComparison() {
  if (!compareStore.hasItems) {
    pesantrenData.value = []
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { data } = await pesantrenApi.compare(compareStore.selectedIds)
    pesantrenData.value = data.data || []
  } catch {
    error.value = 'Gagal memuat data perbandingan. Silakan coba lagi.'
    pesantrenData.value = []
  } finally {
    loading.value = false
  }
}

const unsubscribe = compareStore.$subscribe(() => {
  if (compareStore.hasItems) {
    loadComparison()
  }
})

onMounted(() => {
  if (compareStore.hasItems) {
    loadComparison()
  }
})

onUnmounted(() => {
  unsubscribe()
})
</script>

<style scoped>
.comparison-table th,
.comparison-table td {
  vertical-align: middle;
  padding: 0.875rem 1rem;
}

.comparison-table td:first-child {
  background-color: #f8f9fa;
  font-weight: 500;
}
</style>
