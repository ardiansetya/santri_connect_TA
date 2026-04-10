<template>
  <div class="py-4 md:py-5">
    <div class="container">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-4 md:mb-5">
          <h1 class="font-bold text-3xl">Cek Status Pendaftaran</h1>
          <p class="text-muted mt-2">Masukkan nomor pendaftaran untuk melacak status Anda</p>
        </div>

        <div class="card mb-4">
          <div class="p-4">
            <form class="flex flex-col md:flex-row gap-3 items-end" @submit.prevent="cekStatus">
              <div class="flex-1">
                <label class="form-label font-medium">Nomor Pendaftaran</label>
                <input
                  v-model="nomor"
                  type="text"
                  class="form-input"
                  placeholder="Contoh: REG-2024-000001"
                  required
                />
              </div>
              <div class="md:w-40">
                <button type="submit" class="btn btn-primary w-full" :disabled="loading">
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

        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700" role="alert">
          <strong>Gagal!</strong> {{ error }}
        </div>

        <div v-else-if="data" class="card">
          <div class="p-4">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h5 class="font-semibold mb-1">{{ data.nama_lengkap || '-' }}</h5>
                <p class="text-muted mb-0">No: <strong>{{ data.nomor_pendaftaran }}</strong></p>
                <p class="text-muted text-sm mt-1">{{ data.pesantren?.nama || 'Pesantren' }}</p>
              </div>
              <span class="badge text-base px-3 py-1" :class="statusBadge(data.status)">
                {{ statusLabel(data.status) }}
              </span>
            </div>

            <div class="mb-4">
              <h6 class="font-semibold mb-3">Detail Pendaftaran</h6>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-3 bg-muted rounded">
                  <small class="text-muted block">Pesantren</small>
                  <strong>{{ data.pesantren?.nama || '-' }}</strong>
                </div>
                <div class="p-3 bg-muted rounded">
                  <small class="text-muted block">NIK</small>
                  <strong>{{ data.nik || '-' }}</strong>
                </div>
                <div class="p-3 bg-muted rounded">
                  <small class="text-muted block">Tempat, Tanggal Lahir</small>
                  <strong>{{ formatTempatTanggalLahir(data.tempat_lahir, data.tanggal_lahir) }}</strong>
                </div>
                <div class="p-3 bg-muted rounded">
                  <small class="text-muted block">Jenis Kelamin</small>
                  <strong>{{ formatJenisKelamin(data.jenis_kelamin) }}</strong>
                </div>
                <div class="p-3 bg-muted rounded">
                  <small class="text-muted block">No. HP</small>
                  <strong>{{ data.no_hp || '-' }}</strong>
                </div>
                <div class="p-3 bg-muted rounded">
                  <small class="text-muted block">Nama Ayah</small>
                  <strong>{{ data.nama_ayah || '-' }}</strong>
                </div>
                <div class="p-3 bg-muted rounded">
                  <small class="text-muted block">Nama Ibu</small>
                  <strong>{{ data.nama_ibu || '-' }}</strong>
                </div>
                <div class="p-3 bg-muted rounded">
                  <small class="text-muted block">No. HP Orang Tua</small>
                  <strong>{{ data.no_hp_ortu || '-' }}</strong>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <h6 class="font-semibold mb-3">Timeline Proses</h6>
              <div class="flex items-center justify-between relative">
                <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 z-0"></div>
                <div
                  v-for="(step, index) in timelineSteps"
                  :key="step.key"
                  class="text-center relative z-10 flex-1"
                >
                  <div
                    class="rounded-full mx-auto mb-2 flex items-center justify-content-center"
                    :class="isStepActive(data.status, index) ? 'bg-primary text-white' : 'bg-muted text-muted border'"
                    style="width: 40px; height: 40px;"
                  >
                    <span v-if="isStepActive(data.status, index)">✓</span>
                    <span v-else class="text-sm">{{ index + 1 }}</span>
                  </div>
                  <small class="block" :class="isStepActive(data.status, index) ? 'font-semibold text-primary' : 'text-muted'">
                    {{ step.label }}
                  </small>
                </div>
              </div>
            </div>

            <div v-if="data.catatan_admin" class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 mb-0">
              <strong>Catatan Admin:</strong> {{ data.catatan_admin }}
            </div>

            <div class="mt-3 text-muted text-sm">
              Terdaftar sejak: {{ formatDateTime(data.created_at) }}
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <p class="text-5xl mb-3">📋</p>
          <h5 class="font-semibold text-xl">Masukkan Nomor Pendaftaran</h5>
          <p class="text-muted mt-2">Nomor pendaftaran diberikan saat Anda mendaftar secara online</p>
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
    pending: 'bg-yellow-100 text-yellow-800',
    diproses: 'bg-blue-100 text-blue-800',
    diterima: 'bg-green-100 text-green-800',
    ditolak: 'bg-red-100 text-red-800'
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}

function statusLabel(status) {
  const map = {
    pending: '⏳ Pending',
    diproses: '🔄 Diproses',
    diterima: '✅ Diterima',
    ditolak: '❌ Ditolak'
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

function formatTempatTanggalLahir(tempat, tanggal) {
  const tempatStr = tempat || '-'
  const tanggalStr = tanggal ? formatDate(tanggal) : '-'
  return `${tempatStr}, ${tanggalStr}`
}

function formatJenisKelamin(jk) {
  if (jk === 'L') return 'Laki-laki'
  if (jk === 'P') return 'Perempuan'
  return '-'
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

<style scoped>
.bg-red-50 {
  background-color: #fef2f2 !important;
}
.border-red-200 {
  border-color: #fecaca !important;
}
.text-red-700 {
  color: #b91c1c !important;
}
.bg-red-100 {
  background-color: #fee2e2 !important;
}
.text-red-800 {
  color: #991b1b !important;
}

.bg-blue-50 {
  background-color: #eff6ff !important;
}
.border-blue-200 {
  border-color: #bfdbfe !important;
}
.text-blue-700 {
  color: #1d4ed8 !important;
}
.bg-blue-100 {
  background-color: #dbeafe !important;
}
.text-blue-800 {
  color: #1e40af !important;
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

.form-input {
  display: block;
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  background: white;
}
.form-input:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
}
</style>
