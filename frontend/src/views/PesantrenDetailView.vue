<template>
  <div class="py-4 md:py-5">
    <div class="container">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-muted">Memuat data universitas...</p>
      </div>

      <div v-else-if="error" class="text-center py-5">
        <p class="text-4xl mb-3">⚠️</p>
        <h4 class="font-semibold mb-2">Gagal memuat data</h4>
        <p class="text-muted mb-3">{{ error }}</p>
        <router-link to="/pesantren" class="btn btn-primary">Kembali ke Daftar Universitas</router-link>
      </div>

      <template v-else-if="pesantren">
        <nav class="mb-4 text-sm">
          <router-link to="/pesantren" class="text-primary hover:underline">Daftar Universitas</router-link>
          <span class="mx-2 text-muted">/</span>
          <span class="text-muted">{{ universitas.nama }}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-3">
            <div v-if="pesantren.foto_utama" class="aspect-video mb-4">
              <img 
                :src="`/uploads/pesantrenImages/${pesantren.foto_utama}`" 
                :alt="pesantren.nama" 
                class="w-full h-full object-cover rounded"
              />
            </div>
            <div v-else class="aspect-video mb-4 bg-muted flex items-center justify-center rounded">
              <span class="text-muted">Tidak ada foto utama</span>
            </div>
            
            <div class="flex justify-between items-start mb-4 pb-3 border-b border-border">
              <div class="flex-1">
                <h1 class="font-bold mb-1 text-2xl lg:text-3xl">{{ universitas.nama }}</h1>
                <p class="text-muted">📍 {{ universitas.kota }}, {{ universitas.province }}</p>
              </div>
              <span class="badge badge-primary">{{ universitas.kurikulum || '-' }}</span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <div v-if="universitas.tahun_berdiri" class="p-3 bg-muted rounded">
                <small class="text-muted block">Tahun Berdiri</small>
                <span class="font-semibold">{{ universitas.tahun_berdiri }}</span>
              </div>
              <div v-if="universitas.jumlah_santri" class="p-3 bg-muted rounded">
                <small class="text-muted block">Jumlah Santri</small>
                <span class="font-semibold">{{ formatNumber(universitas.jumlah_santri) }}</span>
              </div>
              <div v-if="universitas.jumlah_pengajar" class="p-3 bg-muted rounded">
                <small class="text-muted block">Jumlah Pengajar</small>
                <span class="font-semibold">{{ formatNumber(universitas.jumlah_pengajar) }}</span>
              </div>
            </div>

            <div v-if="universitas.biaya_pendaftaran || universitas.biaya_bulanan" class="mb-4">
              <h6 class="font-semibold mb-3">Biaya Pendidikan</h6>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-if="universitas.biaya_pendaftaran" class="p-3 border rounded">
                  <small class="text-muted block">Biaya Pendaftaran</small>
                  <span class="text-xl font-bold text-primary">{{ formatCurrency(universitas.biaya_pendaftaran) }}</span>
                </div>
                <div v-if="universitas.biaya_bulanan" class="p-3 border rounded">
                  <small class="text-muted block">Biaya Bulanan</small>
                  <span class="text-xl font-bold text-primary">{{ formatCurrency(universitas.biaya_bulanan) }}</span>
                </div>
              </div>
            </div>

            <div v-if="universitas.fasilitas && universitas.fasilitas.length" class="mb-4">
              <h6 class="font-semibold mb-3">Fasilitas</h6>
              <div class="flex flex-wrap gap-2">
                <span v-for="f in universitas.fasilitas" :key="f" class="badge bg-muted text-foreground">{{ f }}</span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div v-if="universitas.telepon" class="p-3 bg-muted rounded">
                <small class="text-muted block">Telepon</small>
                <span>{{ universitas.telepon }}</span>
              </div>
              <div v-if="universitas.email" class="p-3 bg-muted rounded">
                <small class="text-muted block">Email</small>
                <span>{{ universitas.email }}</span>
              </div>
              <div v-if="universitas.website" class="p-3 bg-muted rounded">
                <small class="text-muted block">Website</small>
                <a :href="universitas.website" target="_blank" class="text-primary hover:underline">{{ universitas.website }}</a>
              </div>
            </div>

            <div v-if="universitas.deskripsi" class="mb-4">
              <h6 class="font-semibold mb-3">Deskripsi</h6>
              <p class="text-muted whitespace-pre-line">{{ universitas.deskripsi }}</p>
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="card sticky" style="top: 5rem;">
              <div class="p-4">
                <button
                  class="btn w-full mb-2"
                  :class="compareStore.isSelected(universitas.id) ? 'btn-primary' : 'btn-outline-primary'"
                  @click="toggleCompare"
                >
                  {{ compareStore.isSelected(universitas.id) ? '✓ Dibandingkan' : '⚖️ Bandingkan' }}
                </button>
                <router-link v-if="compareStore.hasItems" to="/compare" class="btn btn-outline w-full text-sm">
                  Lihat Perbandingan ({{ compareStore.count }})
                </router-link>
              </div>
            </div>

            <div v-if="pendaftaranInfo" class="card mt-3">
              <div class="p-4">
                <h6 class="font-semibold mb-3">Status Pendaftaran</h6>
                <div v-if="pendaftaranInfo.biaya_pendaftaran" class="flex justify-between py-2 border-b">
                  <span class="text-muted">Biaya</span>
                  <span class="font-medium">{{ formatCurrency(pendaftaranInfo.biaya_pendaftaran) }}</span>
                </div>
                <div v-if="pendaftaranInfo.status_pendaftaran" class="flex justify-between py-2 border-b">
                  <span class="text-muted">Status</span>
                  <span class="badge" :class="statusBadge(pendaftaranInfo.status_pendaftaran)">{{ pendaftaranInfo.status_pendaftaran }}</span>
                </div>
                <div v-if="pendaftaranInfo.catatan_admin" class="mt-3 p-2 bg-muted rounded text-sm">
                  <small class="text-muted block">Catatan:</small>
                  <span>{{ pendaftaranInfo.catatan_admin }}</span>
                </div>
              </div>
            </div>

            <div class="card mt-3">
              <div class="p-4">
                <router-link to="/pendaftaran" class="btn btn-primary w-full">
                  Daftar Sekarang
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCompareStore } from '../stores/compare'
import { publicApi, auth, pendaftaran } from '../services'

const route = useRoute()
const compareStore = useCompareStore()

const universitas = ref(null)
const loading = ref(true)
const error = ref('')
const pendaftaranInfo = ref(null)

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function statusBadge(status) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    diproses: 'bg-blue-100 text-blue-800',
    diterima: 'bg-green-100 text-green-800',
    ditolak: 'bg-red-100 text-red-800'
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}

function toggleCompare() {
  if (compareStore.isSelected(universitas.value.id)) {
    compareStore.remove(universitas.value.id)
  } else {
    compareStore.add(universitas.value.id)
  }
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await publicApi.getPesantren({ id: route.params.id })
    universitas.value = data.data[0]
  } catch (e) {
    error.value = 'Universitas tidak ditemukan'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function checkPendaftaran() {
  if (!auth.loggedIn) return
  try {
    const { data } = await pendaftaran.my()
    const match = (data.data || []).find(p => p.pesantai?.id === route.params.id)
    if (match) {
      pendaftaranInfo.value = match
    }
  } catch (e) {
    // ignore
  }
}

onMounted(async () => {
  await fetchData()
  await checkPendaftaran()
})
</script>

<style scoped>
.sticky {
  position: sticky;
}
.whitespace-pre-line {
  white-space: pre-line;
}
</style>
