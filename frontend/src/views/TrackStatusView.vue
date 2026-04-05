<template>
  <div class="py-4 py-md-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="text-center mb-4 mb-md-5">
            <h1 class="fw-bold">Cek Status Pendaftaran</h1>
            <p class="text-muted">Masukkan nomor pendaftaran untuk melacak status Anda</p>
          </div>

          <div class="card shadow-sm mb-4">
            <div class="card-body p-4">
              <form class="row g-3 align-items-end" @submit.prevent="cekStatus">
                <div class="col-md-8">
                  <label class="form-label fw-medium">Nomor Pendaftaran</label>
                  <input
                    v-model="nomor"
                    type="text"
                    class="form-control"
                    placeholder="Contoh: REG-2024-000001"
                    required
                  />
                </div>
                <div class="col-md-4">
                  <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Memeriksa...' : 'Cek Status' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Memeriksa status pendaftaran...</p>
          </div>

          <div v-else-if="error" class="alert alert-danger" role="alert">
            <strong>Gagal!</strong> {{ error }}
          </div>

          <div v-else-if="data" class="card shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h5 class="fw-semibold mb-1">{{ data.nama_lengkap }}</h5>
                  <p class="text-muted mb-0">No: <strong>{{ data.nomor_pendaftaran }}</strong></p>
                </div>
                <span class="badge" :class="statusBadge(data.status)" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
                  {{ statusLabel(data.status) }}
                </span>
              </div>

              <div class="mb-4">
                <h6 class="fw-semibold mb-3">Detail Pendaftaran</h6>
                <div class="row g-3">
                  <div class="col-sm-6">
                    <div class="p-3 bg-light rounded">
                      <small class="text-muted d-block">Pesantren</small>
                      <strong>{{ data.pesantren?.nama || '-' }}</strong>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="p-3 bg-light rounded">
                      <small class="text-muted d-block">NIK</small>
                      <strong>{{ data.nik || '-' }}</strong>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="p-3 bg-light rounded">
                      <small class="text-muted d-block">Tempat, Tanggal Lahir</small>
                      <strong>{{ data.tempat_lahir || '-' }}, {{ formatDate(data.tanggal_lahir) }}</strong>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="p-3 bg-light rounded">
                      <small class="text-muted d-block">Jenis Kelamin</small>
                      <strong>{{ data.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</strong>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="p-3 bg-light rounded">
                      <small class="text-muted d-block">No. HP</small>
                      <strong>{{ data.no_hp || '-' }}</strong>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="p-3 bg-light rounded">
                      <small class="text-muted d-block">Nama Orang Tua</small>
                      <strong>{{ data.nama_ayah || '-' }} & {{ data.nama_ibu || '-' }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <h6 class="fw-semibold mb-3">Timeline Proses</h6>
                <div class="d-flex align-items-center justify-content-between position-relative">
                  <div class="position-absolute top-50 start-0 end-0 translate-middle-y" style="height: 3px; background: #e9ecef; z-index: 0;"></div>
                  <div
                    v-for="(step, index) in timelineSteps"
                    :key="step.key"
                    class="text-center position-relative"
                    style="z-index: 1; flex: 1;"
                  >
                    <div
                      class="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                      :class="isStepActive(data.status, index) ? 'bg-primary text-white' : 'bg-light text-muted border'"
                      style="width: 40px; height: 40px;"
                    >
                      <span v-if="isStepActive(data.status, index)">&#10003;</span>
                      <span v-else class="small">{{ index + 1 }}</span>
                    </div>
                    <small class="d-block" :class="isStepActive(data.status, index) ? 'fw-semibold text-primary' : 'text-muted'">
                      {{ step.label }}
                    </small>
                  </div>
                </div>
              </div>

              <div v-if="data.catatan_admin" class="alert alert-info mb-0">
                <strong>Catatan Admin:</strong> {{ data.catatan_admin }}
              </div>

              <div class="mt-3 text-muted small">
                Terdaftar sejak: {{ formatDateTime(data.created_at) }}
              </div>
            </div>
          </div>

          <div v-else class="text-center py-5">
            <p class="fs-1 mb-3">📋</p>
            <h5 class="fw-semibold">Masukkan Nomor Pendaftaran</h5>
            <p class="text-muted">Nomor pendaftaran diberikan saat Anda mendaftar secara online</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { pendaftaran } from '../services'

const nomor = ref('')
const data = ref(null)
const loading = ref(false)
const error = ref('')

const timelineSteps = [
  { key: 'pending', label: 'Pending' },
  { key: 'diproses', label: 'Diproses' },
  { key: 'selesai', label: 'Selesai' }
]

function statusBadge(status) {
  const map = {
    pending: 'bg-warning text-dark',
    diproses: 'bg-info text-white',
    diterima: 'bg-success',
    ditolak: 'bg-danger'
  }
  return map[status] || 'bg-secondary'
}

function statusLabel(status) {
  const map = {
    pending: '\u23F3 Pending',
    diproses: '\uD83D\uDD04 Diproses',
    diterima: '\u2705 Diterima',
    ditolak: '\u274C Ditolak'
  }
  return map[status] || status
}

function isStepActive(status, index) {
  const order = ['pending', 'diproses', 'diterima', 'ditolak']
  const statusIndex = order.indexOf(status)
  if (status === 'ditolak') return index === 0
  return index <= Math.min(statusIndex, 2)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID')
}

async function cekStatus() {
  if (!nomor.value.trim()) return
  loading.value = true
  error.value = ''
  data.value = null
  try {
    const { data: res } = await pendaftaran.getStatus(nomor.value.trim())
    data.value = res.data
  } catch (err) {
    error.value = err.response?.data?.error || 'Pendaftaran tidak ditemukan'
  } finally {
    loading.value = false
  }
}
</script>
