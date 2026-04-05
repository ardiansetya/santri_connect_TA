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
        <button class="btn btn-primary btn-sm" @click="openForm()" :disabled="!canAdd">
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
          <button class="btn btn-primary btn-sm" @click="openForm()">+ Tambah Pesantren</button>
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
                <button class="btn btn-outline-primary btn-sm" @click="openForm(p)">Edit</button>
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
            <form @submit="onSubmit">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Nama Pesantren *</label>
                  <input v-model="nama" v-bind="namaProps" type="text" class="form-control" :class="{ 'is-invalid': errors.nama }" />
                  <div class="invalid-feedback" v-if="errors.nama">{{ errors.nama }}</div>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-medium">Provinsi *</label>
                  <select v-model="province" v-bind="provinceProps" class="form-select" :class="{ 'is-invalid': errors.province }" @change="onProvinceChange">
                    <option value="">Pilih Provinsi</option>
                    <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.province">{{ errors.province }}</div>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-medium">Kota *</label>
                  <select v-model="kota" v-bind="kotaProps" class="form-select" :class="{ 'is-invalid': errors.kota }" :disabled="!cities.length && province">
                    <option value="">Pilih Kota</option>
                    <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
                  </select>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { pemilik as pemilikApi, wilayah } from '../../services'

const pesantren = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingId = ref(null)
const provinces = ref([])
const cities = ref([])
const fasilitasInput = ref('')
const serverError = ref('')

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
  jumlah_pengajar: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0),
  biaya_pendaftaran: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Biaya tidak boleh negatif'),
  biaya_bulanan: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Biaya tidak boleh negatif'),
  email: yup.string().nullable().transform((v) => (v === '' ? null : v)).email('Format email tidak valid').notRequired(),
  telepon: yup.string().notRequired().test('phone-format', 'Format nomor telepon tidak valid', (val) => {
    if (!val) return true
    return phoneRegex.test(val)
  }),
  website: yup.string().nullable().transform((v) => (v === '' ? null : v)).url('Format URL tidak valid').notRequired(),
  deskripsi: yup.string().notRequired(),
  nama_bank: yup.string().notRequired(),
  nomor_rekening: yup.string().notRequired(),
  atas_nama_rekening: yup.string().notRequired()
})

const { defineField, handleSubmit, errors, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
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

const canAdd = computed(() => pesantren.value.length < 5)
const totalSantri = computed(() => pesantren.value.reduce((sum, p) => sum + (p.jumlah_santri || 0), 0))

function kurikulumBadge(kurikulum) {
  const map = { modern: 'bg-primary', salaf: 'bg-success', campuran: 'bg-warning text-dark' }
  return map[kurikulum] || 'bg-secondary'
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  serverError.value = ''
  cities.value = []
  resetForm()
}

async function onProvinceChange() {
  kota.value = ''
  cities.value = []
  if (!province.value) return
  try {
    const prov = provinces.value.find(p => p.name === province.value)
    if (prov) {
      const { data } = await wilayah.getRegencies(prov.id)
      cities.value = (data.data || []).map(r => r.name)
    }
  } catch {
    cities.value = []
  }
}

async function openForm(p) {
  serverError.value = ''
  editingId.value = p?.id || null
  cities.value = []
  if (p) {
    setValues({
      nama: p.nama || '',
      province: p.province || '',
      kota: p.kota || '',
      alamat: p.alamat || '',
      kurikulum: p.kurikulum || '',
      tahun_berdiri: p.tahun_berdiri || null,
      jumlah_santri: p.jumlah_santri || null,
      jumlah_pengajar: p.jumlah_pengajar || null,
      biaya_pendaftaran: p.biaya_pendaftaran || null,
      biaya_bulanan: p.biaya_bulanan || null,
      email: p.email || '',
      telepon: p.telepon || '',
      website: p.website || '',
      deskripsi: p.deskripsi || '',
      nama_bank: p.nama_bank || '',
      nomor_rekening: p.nomor_rekening || '',
      atas_nama_rekening: p.atas_nama_rekening || ''
    })
    fasilitasInput.value = Array.isArray(p.fasilitas) ? p.fasilitas.join(', ') : ''
    if (p.province) {
      try {
        const prov = provinces.value.find(pr => pr.name === p.province)
        if (prov) {
          const { data } = await wilayah.getRegencies(prov.id)
          cities.value = (data.data || []).map(r => r.name)
        }
      } catch {
        cities.value = []
      }
    }
  } else {
    resetForm()
    fasilitasInput.value = ''
  }
  showForm.value = true
}

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    const payload = { ...values }
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
    serverError.value = err.response?.data?.error || 'Gagal menyimpan data'
  }
})

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
