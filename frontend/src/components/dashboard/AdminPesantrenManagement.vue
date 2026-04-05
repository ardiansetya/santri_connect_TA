<template>
  <div>
    <div class="card shadow-sm">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-semibold mb-0">Manajemen Pesantren</h5>
        <button class="btn btn-primary btn-sm" @click="openForm()">+ Tambah Pesantren</button>
      </div>
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted small">Memuat data...</p>
        </div>
        <div v-else-if="pesantren.length === 0" class="text-center py-5">
          <p class="fs-3 mb-3">🕌</p>
          <h6 class="fw-semibold">Belum ada pesantren</h6>
          <p class="text-muted small">Tambahkan pesantren baru untuk mulai mengelola</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Nama</th>
                <th>Lokasi</th>
                <th>Kurikulum</th>
                <th>Santri</th>
                <th>Biaya/Bulan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in pesantren" :key="p.id">
                <td class="fw-medium">{{ p.nama }}</td>
                <td>{{ p.kota }}, {{ p.province }}</td>
                <td><span class="badge" :class="kurikulumBadge(p.kurikulum)">{{ p.kurikulum || '-' }}</span></td>
                <td>{{ p.jumlah_santri || '-' }}</td>
                <td>{{ formatCurrency(p.biaya_bulanan) }}</td>
                <td>
                  <div class="d-flex gap-1">
                    <button class="btn btn-outline-primary btn-sm" @click="openForm(p)">Edit</button>
                    <button class="btn btn-outline-danger btn-sm" @click="confirmDelete(p)">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
            <form @submit="onSubmit">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Nama Pesantren *</label>
                  <input v-model="nama" v-bind="namaProps" type="text" class="form-control" :class="{ 'is-invalid': errors.nama }" />
                  <div class="invalid-feedback" v-if="errors.nama">{{ errors.nama }}</div>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-medium">Provinsi *</label>
                  <select v-model="province" v-bind="provinceProps" class="form-select" :class="{ 'is-invalid': errors.province }">
                    <option value="">Pilih Provinsi</option>
                    <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.province">{{ errors.province }}</div>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-medium">Kota *</label>
                  <input v-model="kota" v-bind="kotaProps" type="text" class="form-control" :class="{ 'is-invalid': errors.kota }" />
                  <div class="invalid-feedback" v-if="errors.kota">{{ errors.kota }}</div>
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium">Alamat</label>
                  <input v-model="alamat" v-bind="alamatProps" type="text" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-medium">Kurikulum</label>
                  <select v-model="kurikulum" v-bind="kurikulumProps" class="form-select">
                    <option value="">Pilih Kurikulum</option>
                    <option value="modern">Modern</option>
                    <option value="salaf">Salaf</option>
                    <option value="campuran">Campuran</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-medium">Tahun Berdiri</label>
                  <input v-model="tahun_berdiri" v-bind="tahun_berdiriProps" type="number" class="form-control" :class="{ 'is-invalid': errors.tahun_berdiri }" min="1900" :max="currentYear" />
                  <div class="invalid-feedback" v-if="errors.tahun_berdiri">{{ errors.tahun_berdiri }}</div>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-medium">Jumlah Santri</label>
                  <input v-model="jumlah_santri" v-bind="jumlah_santriProps" type="number" class="form-control" :class="{ 'is-invalid': errors.jumlah_santri }" min="0" />
                  <div class="invalid-feedback" v-if="errors.jumlah_santri">{{ errors.jumlah_santri }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Biaya Pendaftaran</label>
                  <input v-model="biaya_pendaftaran" v-bind="biaya_pendaftaranProps" type="number" class="form-control" :class="{ 'is-invalid': errors.biaya_pendaftaran }" min="0" />
                  <div class="invalid-feedback" v-if="errors.biaya_pendaftaran">{{ errors.biaya_pendaftaran }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Biaya Bulanan</label>
                  <input v-model="biaya_bulanan" v-bind="biaya_bulananProps" type="number" class="form-control" :class="{ 'is-invalid': errors.biaya_bulanan }" min="0" />
                  <div class="invalid-feedback" v-if="errors.biaya_bulanan">{{ errors.biaya_bulanan }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Email</label>
                  <input v-model="email" v-bind="emailProps" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" />
                  <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Telepon</label>
                  <input v-model="telepon" v-bind="teleponProps" type="text" class="form-control" :class="{ 'is-invalid': errors.telepon }" placeholder="08xxxxxxxxxx" />
                  <div class="invalid-feedback" v-if="errors.telepon">{{ errors.telepon }}</div>
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium">Deskripsi</label>
                  <textarea v-model="deskripsi" v-bind="deskripsiProps" class="form-control" rows="3"></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium">Fasilitas (pisahkan dengan koma)</label>
                  <input v-model="fasilitasInput" type="text" class="form-control" placeholder="Masjid, Asrama, Lab Komputer" />
                </div>
              </div>
              <div v-if="serverError" class="alert alert-danger mt-3 mb-0">{{ serverError }}</div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeForm">Batal</button>
            <button type="button" class="btn btn-primary" @click="onSubmit" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showForm" class="modal-backdrop fade show"></div>

    <div v-if="showDeleteConfirm" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold text-danger">Konfirmasi Hapus</h5>
            <button type="button" class="btn-close" @click="showDeleteConfirm = false"></button>
          </div>
          <div class="modal-body">
            <p>Hapus pesantren <strong>{{ deleteTarget?.nama }}</strong>?</p>
            <p class="text-muted small">Tindakan ini tidak dapat dibatalkan.</p>
            <div v-if="deleteError" class="alert alert-danger py-2 small">{{ deleteError }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" @click="showDeleteConfirm = false">Batal</button>
            <button type="button" class="btn btn-danger btn-sm" @click="executeDelete" :disabled="deleting">
              <span v-if="deleting" class="spinner-border spinner-border-sm me-1"></span>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDeleteConfirm" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { admin, wilayah } from '../../services'
import { pesantren as pesantrenApi } from '../../services'

const emit = defineEmits(['refresh'])

const pesantren = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingId = ref(null)
const provinces = ref([])
const fasilitasInput = ref('')
const serverError = ref('')

const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)
const deleteError = ref('')
const deleting = ref(false)

const currentYear = new Date().getFullYear()
const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/

const schema = yup.object({
  nama: yup.string().required('Nama pesantren harus diisi').min(3, 'Nama minimal 3 karakter'),
  province: yup.string().required('Provinsi harus dipilih'),
  kota: yup.string().required('Kota harus diisi'),
  alamat: yup.string().notRequired(),
  kurikulum: yup.string().notRequired(),
  tahun_berdiri: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().test('year-range', 'Tahun berdiri tidak valid', (val) => {
    if (val === null || val === undefined) return true
    return val >= 1900 && val <= currentYear
  }),
  jumlah_santri: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Jumlah santri tidak boleh negatif'),
  biaya_pendaftaran: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Biaya tidak boleh negatif'),
  biaya_bulanan: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Biaya tidak boleh negatif'),
  email: yup.string().nullable().transform((v) => (v === '' ? null : v)).email('Format email tidak valid').notRequired(),
  telepon: yup.string().notRequired().test('phone-format', 'Format nomor telepon tidak valid', (val) => {
    if (!val) return true
    return phoneRegex.test(val)
  }),
  deskripsi: yup.string().notRequired()
})

const { defineField, handleSubmit, errors, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    nama: '', province: '', kota: '', alamat: '', kurikulum: '',
    tahun_berdiri: null, jumlah_santri: null,
    biaya_pendaftaran: null, biaya_bulanan: null,
    email: '', telepon: '', deskripsi: ''
  }
})

const [nama, namaProps] = defineField('nama')
const [province, provinceProps] = defineField('province')
const [kota, kotaProps] = defineField('kota')
const [alamat, alamatProps] = defineField('alamat')
const [kurikulum, kurikulumProps] = defineField('kurikulum')
const [tahun_berdiri, tahun_berdiriProps] = defineField('tahun_berdiri')
const [jumlah_santri, jumlah_santriProps] = defineField('jumlah_santri')
const [biaya_pendaftaran, biaya_pendaftaranProps] = defineField('biaya_pendaftaran')
const [biaya_bulanan, biaya_bulananProps] = defineField('biaya_bulanan')
const [email, emailProps] = defineField('email')
const [telepon, teleponProps] = defineField('telepon')
const [deskripsi, deskripsiProps] = defineField('deskripsi')

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function kurikulumBadge(kurikulum) {
  const map = { modern: 'bg-primary', salaf: 'bg-success', campuran: 'bg-warning text-dark' }
  return map[kurikulum] || 'bg-secondary'
}

function openForm(p) {
  serverError.value = ''
  editingId.value = p?.id || null
  if (p) {
    setValues({
      nama: p.nama || '',
      province: p.province || '',
      kota: p.kota || '',
      alamat: p.alamat || '',
      kurikulum: p.kurikulum || '',
      tahun_berdiri: p.tahun_berdiri || null,
      jumlah_santri: p.jumlah_santri || null,
      biaya_pendaftaran: p.biaya_pendaftaran || null,
      biaya_bulanan: p.biaya_bulanan || null,
      email: p.email || '',
      telepon: p.telepon || '',
      deskripsi: p.deskripsi || ''
    })
    fasilitasInput.value = Array.isArray(p.fasilitas) ? p.fasilitas.join(', ') : ''
  } else {
    resetForm()
    fasilitasInput.value = ''
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  serverError.value = ''
  resetForm()
}

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    const payload = { ...values }
    if (fasilitasInput.value.trim()) {
      payload.fasilitas = fasilitasInput.value.split(',').map(f => f.trim()).filter(Boolean)
    }

    if (editingId.value) {
      await admin.updatePesantren(editingId.value, payload)
    } else {
      await admin.createPesantren(payload)
    }
    closeForm()
    await loadPesantren()
    emit('refresh')
  } catch (err) {
    serverError.value = err.response?.data?.error || 'Gagal menyimpan data'
  }
})

function confirmDelete(p) {
  deleteTarget.value = p
  deleteError.value = ''
  showDeleteConfirm.value = true
}

async function executeDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  deleteError.value = ''
  try {
    await admin.deletePesantren(deleteTarget.value.id)
    showDeleteConfirm.value = false
    deleteTarget.value = null
    await loadPesantren()
    emit('refresh')
  } catch (err) {
    deleteError.value = err.response?.data?.error || 'Gagal menghapus pesantren'
  } finally {
    deleting.value = false
  }
}

async function loadPesantren() {
  loading.value = true
  try {
    const { data } = await pesantrenApi.list({ limit: 1000 })
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
