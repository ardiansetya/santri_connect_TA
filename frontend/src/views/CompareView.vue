<template>
  <div class="py-4 md:py-5">
    <div class="container">
      <div class="text-center mb-4 md:mb-5">
        <h1 class="font-bold text-3xl">Bandingkan Pesantren</h1>
        <p class="text-muted mt-2">Bandingkan hingga 3 pesantren pilihan Anda secara detail</p>
      </div>

      <div v-if="!compareStore.hasItems" class="card">
        <div class="text-center py-5 p-4">
          <p class="text-4xl mb-3">⚖️</p>
          <h5 class="font-semibold mb-2">Belum ada pesantren yang dibandingkan</h5>
          <p class="text-muted mb-3">Tambahkan pesantren dari daftar atau halaman detail</p>
          <router-link to="/pesantren" class="btn btn-primary">Cari Pesantren</router-link>
        </div>
      </div>

      <div v-else-if="loading" class="card">
        <div class="text-center py-5 p-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 mb-0 text-muted">Memuat data perbandingan...</p>
        </div>
      </div>

      <div v-else-if="error" class="card">
        <div class="text-center py-4 p-4">
          <p class="text-red-600 mb-3">{{ error }}</p>
          <button class="btn btn-outline-primary" @click="loadComparison">Coba Lagi</button>
        </div>
      </div>

      <div v-else-if="pesantrenData.length === 0" class="card">
        <div class="text-center py-5 p-4">
          <p class="text-muted mb-0">Tidak ada data ditemukan untuk pesantren yang dipilih.</p>
        </div>
      </div>

      <div v-else>
        <div class="flex justify-between items-center mb-3">
          <span class="text-muted">Menampilkan {{ pesantrenData.length }} pesantren</span>
          <button class="btn btn-outline text-red-600 btn-sm" @click="clearComparison">Hapus Semua</button>
        </div>

        <div class="card overflow-hidden">
          <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead class="bg-muted">
                  <tr>
                    <th class="text-left p-3 font-medium" style="width: 200px;">Kriteria</th>
                    <th v-for="p in pesantrenData" :key="p.id" class="text-center p-3 font-medium bg-muted">
                      <div class="font-semibold">{{ p.nama }}</div>
                      <button class="btn btn-link text-red-600 p-0 mt-1 text-sm" @click="removeItem(p.id)">
                        <small>Hapus</small>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-border">
                    <td class="p-3 font-medium">Provinsi</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center p-3">{{ p.province || '-' }}</td>
                  </tr>
                  <tr class="border-b border-border">
                    <td class="p-3 font-medium">Kota/Kabupaten</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center p-3">{{ p.kota || '-' }}</td>
                  </tr>
                  <tr class="border-b border-border">
                    <td class="p-3 font-medium">Alamat</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="p-3">{{ p.alamat || '-' }}</td>
                  </tr>
                  <tr class="border-b border-border">
                    <td class="p-3 font-medium">Kurikulum</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center p-3">
                      <span class="badge" :class="badgeClass(p.kurikulum)">{{ p.kurikulum || '-' }}</span>
                    </td>
                  </tr>
                  <tr class="border-b border-border">
                    <td class="p-3 font-medium">Tahun Berdiri</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center p-3">{{ p.tahun_berdiri || '-' }}</td>
                  </tr>
                  <tr class="border-b border-border">
                    <td class="p-3 font-medium">Jumlah Santri</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center p-3">{{ formatNumber(p.jumlah_santri) }}</td>
                  </tr>
                  <tr class="border-b border-border">
                    <td class="p-3 font-medium">Jumlah Pengajar</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center p-3">{{ formatNumber(p.jumlah_pengajar) }}</td>
                  </tr>
                  <tr class="border-b border-border">
                    <td class="p-3 font-medium">Biaya Bulanan</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center p-3">{{ formatCurrency(p.biaya_bulanan) }}</td>
                  </tr>
                  <tr class="border-b border-border">
                    <td class="p-3 font-medium">Biaya Pendaftaran</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center p-3">{{ formatCurrency(p.biaya_pendaftaran) }}</td>
                  </tr>
                  <tr class="border-b border-border">
                    <td class="p-3 font-medium">Fasilitas</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center p-3">
                      <div v-if="p.fasilitas && p.fasilitas.length" class="flex flex-wrap gap-1 justify-center">
                        <span v-for="f in p.fasilitas" :key="f" class="badge bg-muted text-foreground border">{{ f }}</span>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                  </tr>
                  <tr class="border-b border-border">
                    <td class="p-3 font-medium">Kontak</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center p-3">
                      <div v-if="p.telepon || p.email">
                        <div v-if="p.telepon">📞 {{ p.telepon }}</div>
                        <div v-if="p.email">✉️ {{ p.email }}</div>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-3 font-medium">Aksi</td>
                    <td v-for="p in pesantrenData" :key="p.id" class="text-center p-3">
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
    modern: 'badge-primary',
    salaf: 'bg-green-100 text-green-800',
    campuran: 'bg-yellow-100 text-yellow-800'
  }
  return map[kurikulum?.toLowerCase()] || 'bg-gray-100 text-gray-800'
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
.border-collapse {
  border-collapse: collapse;
}
.border-b {
  border-bottom: 1px solid;
}
.border-border {
  border-color: hsl(214 32% 91%);
}

.text-red-600 {
  color: #dc2626 !important;
}
</style>
