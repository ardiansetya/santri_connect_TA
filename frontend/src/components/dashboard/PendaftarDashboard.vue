<template>
  <div>
    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="card shadow-sm border-start border-primary border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Pendaftaran Aktif</p>
                <h3 class="fw-bold mb-0">{{ stats.pending }}</h3>
              </div>
              <div class="fs-1 text-primary opacity-50">📋</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-start border-success border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Diterima</p>
                <h3 class="fw-bold mb-0">{{ stats.diterima }}</h3>
              </div>
              <div class="fs-1 text-success opacity-50">✅</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-start border-info border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Total Pendaftaran</p>
                <h3 class="fw-bold mb-0">{{ stats.total }}</h3>
              </div>
              <div class="fs-1 text-info opacity-50">📊</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h5 class="fw-semibold mb-0">Riwayat Pendaftaran</h5>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2 text-muted small">Memuat data...</p>
            </div>
            <div v-else-if="pendaftaran.length === 0" class="text-center py-5">
              <p class="fs-3 mb-3">📭</p>
              <h6 class="fw-semibold">Belum ada pendaftaran</h6>
              <p class="text-muted small mb-3">Mulai daftarkan diri Anda ke pesantren pilihan</p>
              <router-link to="/pesantren" class="btn btn-primary btn-sm">Cari Pesantren</router-link>
            </div>
            <div v-else class="list-group list-group-flush">
              <div
                v-for="p in pendaftaran"
                :key="p.id"
                class="list-group-item px-4 py-3"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="fw-semibold mb-1">{{ p.pesantren?.nama || 'Pesantren' }}</h6>
                    <small class="text-muted">No: {{ p.nomor_pendaftaran }}</small>
                    <br><small class="text-muted">{{ formatDate(p.created_at) }}</small>
                  </div>
                  <div class="text-end">
                    <span class="badge" :class="statusBadge(p.status)">{{ statusLabel(p.status) }}</span>
                    <br>
                    <router-link
                      v-if="p.nomor_pendaftaran"
                      :to="`/track`"
                      class="btn btn-link btn-sm p-0 mt-1"
                    >
                      Detail
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h5 class="fw-semibold mb-0">Aksi Cepat</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link to="/pesantren" class="btn btn-outline-primary">
                🔍 Cari Pesantren
              </router-link>
              <router-link to="/rekomendasi" class="btn btn-outline-secondary">
                📊 Dapatkan Rekomendasi
              </router-link>
              <router-link to="/compare" class="btn btn-outline-secondary">
                ⚖️ Bandingkan Pesantren
              </router-link>
              <router-link to="/track" class="btn btn-outline-secondary">
                📋 Cek Status Pendaftaran
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { admin } from '../../services'

const stats = ref({ pending: 0, diterima: 0, total: 0 })
const pendaftaran = ref([])
const loading = ref(true)

function statusBadge(status) {
  const map = {
    pending: 'bg-warning text-dark',
    diproses: 'bg-info',
    diterima: 'bg-success',
    ditolak: 'bg-danger'
  }
  return map[status] || 'bg-secondary'
}

function statusLabel(status) {
  const map = {
    pending: 'Pending',
    diproses: 'Diproses',
    diterima: 'Diterima',
    ditolak: 'Ditolak'
  }
  return map[status] || status
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  try {
    const { data } = await admin.getPendaftaran()
    pendaftaran.value = data.data || []
    stats.value.total = pendaftaran.value.length
    stats.value.pending = pendaftaran.value.filter(p => p.status === 'pending').length
    stats.value.diterima = pendaftaran.value.filter(p => p.status === 'diterima').length
  } catch {
    pendaftaran.value = []
  } finally {
    loading.value = false
  }
})
</script>
