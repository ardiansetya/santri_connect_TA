<template>
  <div class="py-4 py-md-5">
    <div class="container">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-muted">Memuat data pesantren...</p>
      </div>

      <div v-else-if="error" class="text-center py-5">
        <p class="fs-1 mb-3">⚠️</p>
        <h4 class="fw-semibold mb-2">Gagal memuat data</h4>
        <p class="text-muted mb-3">{{ error }}</p>
        <router-link to="/pesantren" class="btn btn-primary">Kembali ke Daftar Pesantren</router-link>
      </div>

      <template v-else-if="pesantren">
        <nav class="mb-4 small">
          <router-link to="/pesantren" class="text-decoration-none">Daftar Pesantren</router-link>
          <span class="mx-2 text-muted">/</span>
          <span class="text-muted">{{ pesantren.nama }}</span>
        </nav>

        <div class="row g-4">
          <div class="col-lg-8">
            <div class="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom">
              <div>
                <h1 class="fw-bold mb-1" style="font-size: 1.75rem;">{{ pesantren.nama }}</h1>
                <p class="text-muted mb-0">📍 {{ pesantren.kota }}, {{ pesantren.province }}</p>
              </div>
              <span class="badge" :class="kurikulumBadge(pesantren.kurikulum)">{{ pesantren.kurikulum || '-' }}</span>
            </div>

            <section class="mb-4">
              <h5 class="fw-semibold mb-3 pb-2 border-bottom">Informasi Umum</h5>
              <div class="row g-3">
                <div v-if="pesantren.alamat" class="col-12">
                  <div class="p-3 bg-light rounded">
                    <small class="text-muted d-block text-uppercase fw-semibold" style="font-size: 0.7rem; letter-spacing: 0.05em;">Alamat</small>
                    <span>{{ pesantren.alamat }}</span>
                  </div>
                </div>
                <div v-if="pesantren.tahun_berdiri" class="col-6">
                  <div class="p-3 bg-light rounded">
                    <small class="text-muted d-block text-uppercase fw-semibold" style="font-size: 0.7rem; letter-spacing: 0.05em;">Tahun Berdiri</small>
                    <span class="fw-semibold">{{ pesantren.tahun_berdiri }}</span>
                  </div>
                </div>
                <div v-if="pesantren.jumlah_santri" class="col-6">
                  <div class="p-3 bg-light rounded">
                    <small class="text-muted d-block text-uppercase fw-semibold" style="font-size: 0.7rem; letter-spacing: 0.05em;">Jumlah Santri</small>
                    <span class="fw-semibold">{{ formatNumber(pesantren.jumlah_santri) }}</span>
                  </div>
                </div>
                <div v-if="pesantren.jumlah_pengajar" class="col-6">
                  <div class="p-3 bg-light rounded">
                    <small class="text-muted d-block text-uppercase fw-semibold" style="font-size: 0.7rem; letter-spacing: 0.05em;">Jumlah Pengajar</small>
                    <span class="fw-semibold">{{ formatNumber(pesantren.jumlah_pengajar) }}</span>
                  </div>
                </div>
                <div v-if="pesantren.deskripsi" class="col-12">
                  <div class="p-3 bg-light rounded">
                    <small class="text-muted d-block text-uppercase fw-semibold" style="font-size: 0.7rem; letter-spacing: 0.05em;">Deskripsi</small>
                    <span>{{ pesantren.deskripsi }}</span>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="pesantren.biaya_pendaftaran || pesantren.biaya_bulanan" class="mb-4">
              <h5 class="fw-semibold mb-3 pb-2 border-bottom">Biaya</h5>
              <div class="row g-3">
                <div v-if="pesantren.biaya_pendaftaran" class="col-sm-6">
                  <div class="card bg-primary bg-opacity-10 border-primary text-center">
                    <div class="card-body p-3">
                      <small class="text-muted d-block">Biaya Pendaftaran</small>
                      <span class="fs-4 fw-bold text-primary">{{ formatCurrency(pesantren.biaya_pendaftaran) }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="pesantren.biaya_bulanan" class="col-sm-6">
                  <div class="card bg-primary bg-opacity-10 border-primary text-center">
                    <div class="card-body p-3">
                      <small class="text-muted d-block">Biaya Bulanan</small>
                      <span class="fs-4 fw-bold text-primary">{{ formatCurrency(pesantren.biaya_bulanan) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="pesantren.fasilitas && pesantren.fasilitas.length" class="mb-4">
              <h5 class="fw-semibold mb-3 pb-2 border-bottom">Fasilitas</h5>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="f in pesantren.fasilitas" :key="f" class="badge bg-light text-dark border p-2">{{ f }}</span>
              </div>
            </section>

            <section class="mb-4">
              <h5 class="fw-semibold mb-3 pb-2 border-bottom">Kontak</h5>
              <div class="row g-3">
                <div v-if="pesantren.telepon" class="col-sm-4">
                  <div class="p-3 bg-light rounded">
                    <small class="text-muted d-block text-uppercase fw-semibold" style="font-size: 0.7rem; letter-spacing: 0.05em;">Telepon</small>
                    <span>{{ pesantren.telepon }}</span>
                  </div>
                </div>
                <div v-if="pesantren.email" class="col-sm-4">
                  <div class="p-3 bg-light rounded">
                    <small class="text-muted d-block text-uppercase fw-semibold" style="font-size: 0.7rem; letter-spacing: 0.05em;">Email</small>
                    <span>{{ pesantren.email }}</span>
                  </div>
                </div>
                <div v-if="pesantren.website" class="col-sm-4">
                  <div class="p-3 bg-light rounded">
                    <small class="text-muted d-block text-uppercase fw-semibold" style="font-size: 0.7rem; letter-spacing: 0.05em;">Website</small>
                    <a :href="pesantren.website" target="_blank" rel="noopener" class="text-decoration-none">{{ pesantren.website }}</a>
                  </div>
                </div>
                <div v-if="pesantren.nama_bank || pesantren.nomor_rekening" class="col-12">
                  <div class="p-3 bg-light rounded">
                    <small class="text-muted d-block text-uppercase fw-semibold" style="font-size: 0.7rem; letter-spacing: 0.05em;">Rekening Bank</small>
                    <span>
                      <template v-if="pesantren.nama_bank">{{ pesantren.nama_bank }}</template>
                      <template v-if="pesantren.nomor_rekening"> - {{ pesantren.nomor_rekening }}</template>
                      <template v-if="pesantren.atas_nama_rekening"> a.n. {{ pesantren.atas_nama_rekening }}</template>
                    </span>
                  </div>
                </div>
                <div v-if="!pesantren.telepon && !pesantren.email && !pesantren.website" class="col-12">
                  <div class="text-center text-muted p-3 bg-light rounded">Informasi kontak belum tersedia</div>
                </div>
              </div>
            </section>
          </div>

          <div class="col-lg-4">
            <div class="card shadow-sm mb-3" style="position: sticky; top: 5rem;">
              <div class="card-body p-4">
                <h6 class="fw-semibold mb-3">Aksi</h6>
                <div class="d-grid gap-2">
                  <button
                    class="btn"
                    :class="compareStore.isSelected(pesantren.id) ? 'btn-primary' : 'btn-outline-primary'"
                    @click="toggleCompare"
                  >
                    {{ compareStore.isSelected(pesantren.id) ? '✓ Ada di daftar bandingkan' : 'Tambahkan ke Bandingkan' }}
                  </button>
                  <router-link v-if="compareStore.hasItems" to="/compare" class="btn btn-outline-secondary btn-sm">
                    Lihat Bandingkan ({{ compareStore.count }})
                  </router-link>
                </div>
              </div>
            </div>

            <div v-if="pendaftaranInfo" class="card shadow-sm">
              <div class="card-body p-4">
                <h6 class="fw-semibold mb-3">Info Pendaftaran</h6>
                <div v-if="pendaftaranInfo.biaya_pendaftaran" class="d-flex justify-content-between py-2 border-bottom">
                  <span class="text-muted small">Biaya Pendaftaran</span>
                  <span class="fw-semibold">{{ formatCurrency(pendaftaranInfo.biaya_pendaftaran) }}</span>
                </div>
                <div v-if="pendaftaranInfo.status_pendaftaran" class="d-flex justify-content-between py-2 border-bottom">
                  <span class="text-muted small">Status</span>
                  <span class="fw-semibold">{{ pendaftaranInfo.status_pendaftaran }}</span>
                </div>
                <p class="text-muted small fst-italic mb-0 mt-2">Hubungi pesantren untuk informasi lebih lanjut.</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { pesantren as pesantrenApi } from '../services'
import { useCompareStore } from '../stores/compare'

const route = useRoute()
const compareStore = useCompareStore()

const pesantren = ref(null)
const pendaftaranInfo = ref(null)
const loading = ref(true)
const error = ref('')

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

function toggleCompare() {
  if (compareStore.isSelected(pesantren.value.id)) {
    compareStore.remove(pesantren.value.id)
  } else {
    compareStore.add(pesantren.value.id)
  }
}

onMounted(async () => {
  const id = route.params.id
  try {
    const [detailRes, infoRes] = await Promise.allSettled([
      pesantrenApi.getById(id),
      pesantrenApi.getPendaftaranInfo(id)
    ])

    if (detailRes.status === 'fulfilled') {
      pesantren.value = detailRes.value.data.data
    } else {
      error.value = 'Pesantren tidak ditemukan'
    }

    if (infoRes.status === 'fulfilled') {
      pendaftaranInfo.value = infoRes.value.data.data
    }
  } catch {
    error.value = 'Terjadi kesalahan saat memuat data'
  } finally {
    loading.value = false
  }
})
</script>
