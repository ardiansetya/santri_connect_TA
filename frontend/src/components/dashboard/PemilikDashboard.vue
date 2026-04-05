<template>
  <div>
    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="card shadow-sm border-start border-primary border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Pesantren Saya</p>
                <h3 class="fw-bold mb-0">{{ pesantren.length }}</h3>
              </div>
              <div class="fs-1 text-primary opacity-50">🕌</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card shadow-sm border-start border-info border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Total Santri</p>
                <h3 class="fw-bold mb-0">{{ totalSantri }}</h3>
              </div>
              <div class="fs-1 text-info opacity-50">👥</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-semibold mb-0">Pesantren Saya</h5>
        <button class="btn btn-primary btn-sm" @click="showForm = true" :disabled="!canAdd">
          + Tambah Pesantren
        </button>
      </div>
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted small">Memuat data...</p>
        </div>
        <div v-else-if="pesantren.length === 0" class="text-center py-5">
          <p class="fs-3 mb-3">🏫</p>
          <h6 class="fw-semibold">Belum ada pesantren</h6>
          <p class="text-muted small mb-3">Tambahkan pesantren Anda untuk mulai mengelola</p>
          <button class="btn btn-primary btn-sm" @click="showForm = true">+ Tambah Pesantren</button>
        </div>
        <div v-else class="list-group list-group-flush">
          <div
            v-for="p in pesantren"
            :key="p.id"
            class="list-group-item px-4 py-3"
          >
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="fw-semibold mb-1">{{ p.nama }}</h6>
                <small class="text-muted">📍 {{ p.kota }}, {{ p.province }}</small>
                <span v-if="p.kurikulum" class="badge ms-2" :class="kurikulumBadge(p.kurikulum)">{{ p.kurikulum }}</span>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-primary btn-sm" @click="editPesantren(p)">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold">{{ editingId ? 'Edit Pesantren' : 'Tambah Pesantren' }}</h5>
            <button type="button" class="btn-close" @click="closeForm"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePesantren">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Nama Pesantren *</label>
                  <input v-model="form.nama" type="text" class="form-control" required />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-medium">Provinsi *</label>
                  <select v-model="form.province" class="form-select" required @change="onProvinceChange">
                    <option value="">Pilih Provinsi</option>
                    <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-medium">Kota *</label>
                  <input v-model="form.kota" type="text" class="form-control" required />
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium">Alamat</label>
                  <input v-model="form.alamat" type="text" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-medium">Kurikulum</label>
                  <select v-model="form.kurikulum" class="form-select">
                    <option value="">Pilih Kurikulum</option>
                    <option value="modern">Modern</option>
                    <option value="salaf">Salaf</option>
                    <option value="campuran">Campuran</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-medium">Tahun Berdiri</label>
                  <input v-model.number="form.tahun_berdiri" type="number" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-medium">Jumlah Santri</label>
                  <input v-model.number="form.jumlah_santri" type="number" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Biaya Pendaftaran</label>
                  <input v-model.number="form.biaya_pendaftaran" type="number" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Biaya Bulanan</label>
                  <input v-model.number="form.biaya_bulanan" type="number" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Email</label>
                  <input v-model="form.email" type="email" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Telepon</label>
                  <input v-model="form.telepon" type="text" class="form-control" />
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium">Deskripsi</label>
                  <textarea v-model="form.deskripsi" class="form-control" rows="3"></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium">Fasilitas (pisahkan dengan koma)</label>
                  <input v-model="fasilitasInput" type="text" class="form-control" placeholder="Masjid, Asrama, Lab Komputer" />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeForm">Batal</button>
            <button type="button" class="btn btn-primary" @click="savePesantren" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { pemilik as pemilikApi, wilayah } from '../../services'

const pesantren = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const provinces = ref([])

const form = ref({
  nama: '',
  province: '',
  kota: '',
  alamat: '',
  kurikulum: '',
  tahun_berdiri: null,
  jumlah_santri: null,
  jumlah_pengajar: null,
  biaya_pendaftaran: null,
  biaya_bulanan: null,
  email: '',
  telepon: '',
  website: '',
  deskripsi: '',
  nama_bank: '',
  nomor_rekening: '',
  atas_nama_rekening: ''
})

const fasilitasInput = ref('')

const canAdd = computed(() => pesantren.value.length < 5)
const totalSantri = computed(() => pesantren.value.reduce((sum, p) => sum + (p.jumlah_santri || 0), 0))

function kurikulumBadge(kurikulum) {
  const map = { modern: 'bg-primary', salaf: 'bg-success', campuran: 'bg-warning text-dark' }
  return map[kurikulum] || 'bg-secondary'
}

function resetForm() {
  form.value = {
    nama: '', province: '', kota: '', alamat: '', kurikulum: '',
    tahun_berdiri: null, jumlah_santri: null, jumlah_pengajar: null,
    biaya_pendaftaran: null, biaya_bulanan: null, email: '', telepon: '',
    website: '', deskripsi: '', nama_bank: '', nomor_rekening: '', atas_nama_rekening: ''
  }
  fasilitasInput.value = ''
  editingId.value = null
}

function closeForm() {
  showForm.value = false
  resetForm()
}

function editPesantren(p) {
  editingId.value = p.id
  form.value = { ...p }
  fasilitasInput.value = Array.isArray(p.fasilitas) ? p.fasilitas.join(', ') : ''
  showForm.value = true
}

function onProvinceChange() {
}

async function savePesantren() {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (fasilitasInput.value.trim()) {
      payload.fasilitas = fasilitasInput.value.split(',').map(f => f.trim()).filter(Boolean)
    }

    if (editingId.value) {
      await pemilikApi.updatePesantren(editingId.value, payload)
    } else {
      await pemilikApi.createPesantren(payload)
    }
    closeForm()
    await loadPesantren()
  } catch (err) {
    alert(err.response?.data?.error || 'Gagal menyimpan data')
  } finally {
    saving.value = false
  }
}

async function loadPesantren() {
  loading.value = true
  try {
    const { data } = await pemilikApi.getPesantren()
    pesantren.value = data.data || []
  } catch {
    pesantren.value = []
  } finally {
    loading.value = false
  }
}

async function loadProvinces() {
  try {
    const { data } = await wilayah.getProvinces()
    provinces.value = data.data || []
  } catch {
    provinces.value = []
  }
}

onMounted(async () => {
  await Promise.all([loadPesantren(), loadProvinces()])
})
</script>
