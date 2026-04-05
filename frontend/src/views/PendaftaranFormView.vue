<template>
  <div class="py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <nav class="mb-4 small">
            <router-link to="/pesantren" class="text-decoration-none">Pesantren</router-link>
            <span class="mx-2 text-muted">/</span>
            <span class="text-muted">Pendaftaran</span>
          </nav>

          <div class="card shadow-sm">
            <div class="card-header bg-white py-3">
              <h5 class="fw-semibold mb-0">Form Pendaftaran Pesantren</h5>
              <p v-if="pesantrenInfo" class="text-muted small mb-0 mt-1">📍 {{ pesantrenInfo.nama }}</p>
            </div>
            <div class="card-body p-4">
              <form @submit="onSubmit">
                <h6 class="fw-semibold mb-3 pb-2 border-bottom">Data Pribadi</h6>
                <div class="row g-3 mb-4">
                  <div class="col-12">
                    <label class="form-label fw-medium">Nama Lengkap *</label>
                    <input v-model="nama_lengkap" v-bind="nama_lengkapProps" type="text" class="form-control" :class="{ 'is-invalid': errors.nama_lengkap }" />
                    <div class="invalid-feedback" v-if="errors.nama_lengkap">{{ errors.nama_lengkap }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">NIK *</label>
                    <input v-model="nik" v-bind="nikProps" type="text" class="form-control" :class="{ 'is-invalid': errors.nik }" maxlength="16" inputmode="numeric" />
                    <div class="invalid-feedback" v-if="errors.nik">{{ errors.nik }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Jenis Kelamin *</label>
                    <select v-model="jenis_kelamin" v-bind="jenis_kelaminProps" class="form-select" :class="{ 'is-invalid': errors.jenis_kelamin }">
                      <option value="">Pilih</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.jenis_kelamin">{{ errors.jenis_kelamin }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Tempat Lahir</label>
                    <input v-model="tempat_lahir" v-bind="tempat_lahirProps" type="text" class="form-control" :class="{ 'is-invalid': errors.tempat_lahir }" />
                    <div class="invalid-feedback" v-if="errors.tempat_lahir">{{ errors.tempat_lahir }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Tanggal Lahir</label>
                    <input v-model="tanggal_lahir" v-bind="tanggal_lahirProps" type="date" class="form-control" :class="{ 'is-invalid': errors.tanggal_lahir }" :max="maxDate" />
                    <div class="invalid-feedback" v-if="errors.tanggal_lahir">{{ errors.tanggal_lahir }}</div>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-medium">Alamat</label>
                    <textarea v-model="alamat" v-bind="alamatProps" class="form-control" rows="2" :class="{ 'is-invalid': errors.alamat }"></textarea>
                    <div class="invalid-feedback" v-if="errors.alamat">{{ errors.alamat }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">No. HP</label>
                    <input v-model="no_hp" v-bind="no_hpProps" type="tel" class="form-control" :class="{ 'is-invalid': errors.no_hp }" placeholder="08xxxxxxxxxx" />
                    <div class="invalid-feedback" v-if="errors.no_hp">{{ errors.no_hp }}</div>
                  </div>
                </div>

                <h6 class="fw-semibold mb-3 pb-2 border-bottom">Data Orang Tua</h6>
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Nama Ayah</label>
                    <input v-model="nama_ayah" v-bind="nama_ayahProps" type="text" class="form-control" :class="{ 'is-invalid': errors.nama_ayah }" />
                    <div class="invalid-feedback" v-if="errors.nama_ayah">{{ errors.nama_ayah }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Nama Ibu</label>
                    <input v-model="nama_ibu" v-bind="nama_ibuProps" type="text" class="form-control" :class="{ 'is-invalid': errors.nama_ibu }" />
                    <div class="invalid-feedback" v-if="errors.nama_ibu">{{ errors.nama_ibu }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">No. HP Orang Tua</label>
                    <input v-model="no_hp_ortu" v-bind="no_hp_ortuProps" type="tel" class="form-control" :class="{ 'is-invalid': errors.no_hp_ortu }" placeholder="08xxxxxxxxxx" />
                    <div class="invalid-feedback" v-if="errors.no_hp_ortu">{{ errors.no_hp_ortu }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Pekerjaan Orang Tua</label>
                    <input v-model="pekerjaan_ortu" v-bind="pekerjaan_ortuProps" type="text" class="form-control" :class="{ 'is-invalid': errors.pekerjaan_ortu }" />
                    <div class="invalid-feedback" v-if="errors.pekerjaan_ortu">{{ errors.pekerjaan_ortu }}</div>
                  </div>
                </div>

                <h6 class="fw-semibold mb-3 pb-2 border-bottom">Dokumen</h6>
                <div class="row g-3 mb-4">
                  <div class="col-md-4">
                    <label class="form-label fw-medium">Foto KTP</label>
                    <input type="file" class="form-control" accept="image/*" :class="{ 'is-invalid': fileErrors.foto_ktp }" @change="handleFile('foto_ktp', $event)" />
                    <div class="invalid-feedback d-block" v-if="fileErrors.foto_ktp">{{ fileErrors.foto_ktp }}</div>
                    <div class="form-text" v-if="files.foto_ktp">✓ {{ files.foto_ktp.name }} ({{ formatFileSize(files.foto_ktp.size) }})</div>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-medium">Pas Foto</label>
                    <input type="file" class="form-control" accept="image/*" :class="{ 'is-invalid': fileErrors.pas_foto }" @change="handleFile('pas_foto', $event)" />
                    <div class="invalid-feedback d-block" v-if="fileErrors.pas_foto">{{ fileErrors.pas_foto }}</div>
                    <div class="form-text" v-if="files.pas_foto">✓ {{ files.pas_foto.name }} ({{ formatFileSize(files.pas_foto.size) }})</div>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-medium">Kartu Keluarga</label>
                    <input type="file" class="form-control" accept="image/*,.pdf" :class="{ 'is-invalid': fileErrors.kartu_keluarga }" @change="handleFile('kartu_keluarga', $event)" />
                    <div class="invalid-feedback d-block" v-if="fileErrors.kartu_keluarga">{{ fileErrors.kartu_keluarga }}</div>
                    <div class="form-text" v-if="files.kartu_keluarga">✓ {{ files.kartu_keluarga.name }} ({{ formatFileSize(files.kartu_keluarga.size) }})</div>
                  </div>
                </div>

                <div v-if="serverError" class="alert alert-danger">{{ serverError }}</div>
                <div v-if="success" class="alert alert-success">
                  <strong>Berhasil!</strong> Pendaftaran Anda telah dikirim. Nomor: <strong>{{ success }}</strong>
                  <router-link to="/track" class="btn btn-sm btn-outline-success ms-2">Cek Status</router-link>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" :disabled="isSubmitting || success">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran' }}
                  </button>
                  <router-link to="/pesantren" class="btn btn-outline-secondary">Batal</router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { pesantren as pesantrenApi, pendaftaran } from '../services'

const route = useRoute()
const pesantrenInfo = ref(null)
const files = ref({})
const fileErrors = ref({})
const serverError = ref('')
const success = ref('')

const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/

const schema = yup.object({
  nama_lengkap: yup.string().required('Nama lengkap harus diisi').min(3, 'Nama minimal 3 karakter'),
  nik: yup.string()
    .required('NIK harus diisi')
    .length(16, 'NIK harus 16 digit')
    .matches(/^[0-9]{16}$/, 'NIK harus berisi 16 digit angka'),
  jenis_kelamin: yup.string().required('Jenis kelamin harus dipilih').oneOf(['L', 'P']),
  tempat_lahir: yup.string().notRequired(),
  tanggal_lahir: yup.string().notRequired().test('is-valid-date', 'Tanggal lahir tidak valid', (val) => {
    if (!val) return true
    const date = new Date(val)
    return date <= new Date() && date.getFullYear() >= 1950
  }),
  alamat: yup.string().notRequired(),
  no_hp: yup.string().notRequired().test('phone-format', 'Format nomor HP tidak valid (contoh: 08xxxxxxxxxx)', (val) => {
    if (!val) return true
    return phoneRegex.test(val)
  }),
  nama_ayah: yup.string().notRequired(),
  nama_ibu: yup.string().notRequired(),
  no_hp_ortu: yup.string().notRequired().test('phone-format', 'Format nomor HP tidak valid', (val) => {
    if (!val) return true
    return phoneRegex.test(val)
  }),
  pekerjaan_ortu: yup.string().notRequired()
})

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    nama_lengkap: '',
    nik: '',
    jenis_kelamin: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    no_hp: '',
    nama_ayah: '',
    nama_ibu: '',
    no_hp_ortu: '',
    pekerjaan_ortu: ''
  }
})

const [nama_lengkap, nama_lengkapProps] = defineField('nama_lengkap')
const [nik, nikProps] = defineField('nik')
const [jenis_kelamin, jenis_kelaminProps] = defineField('jenis_kelamin')
const [tempat_lahir, tempat_lahirProps] = defineField('tempat_lahir')
const [tanggal_lahir, tanggal_lahirProps] = defineField('tanggal_lahir')
const [alamat, alamatProps] = defineField('alamat')
const [no_hp, no_hpProps] = defineField('no_hp')
const [nama_ayah, nama_ayahProps] = defineField('nama_ayah')
const [nama_ibu, nama_ibuProps] = defineField('nama_ibu')
const [no_hp_ortu, no_hp_ortuProps] = defineField('no_hp_ortu')
const [pekerjaan_ortu, pekerjaan_ortuProps] = defineField('pekerjaan_ortu')

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function handleFile(field, event) {
  const file = event.target.files[0]
  if (!file) return

  const maxSize = 2 * 1024 * 1024 // 2MB
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  const allowedTypes = [...allowedImageTypes, 'application/pdf']

  if (field === 'kartu_keluarga') {
    if (!allowedTypes.includes(file.type)) {
      fileErrors.value[field] = 'File harus berupa gambar atau PDF'
      return
    }
  } else {
    if (!allowedImageTypes.includes(file.type)) {
      fileErrors.value[field] = 'File harus berupa gambar (JPG, PNG, WebP)'
      return
    }
  }

  if (file.size > maxSize) {
    fileErrors.value[field] = 'Ukuran file maksimal 2MB'
    return
  }

  fileErrors.value[field] = ''
  files.value[field] = file
}

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    const formData = new FormData()
    formData.append('pesantren_id', route.params.id)
    Object.entries(values).forEach(([key, val]) => {
      if (val) formData.append(key, val)
    })
    Object.entries(files.value).forEach(([key, file]) => {
      formData.append(key, file)
    })

    const { data } = await pendaftaran.create(formData)
    success.value = data.data?.nomor_pendaftaran || 'Berhasil'
  } catch (err) {
    serverError.value = err.response?.data?.error || 'Gagal mengirim pendaftaran'
  }
})

onMounted(async () => {
  const id = route.params.id
  if (id) {
    try {
      const { data } = await pesantrenApi.getById(id)
      pesantrenInfo.value = data.data
    } catch {
      pesantrenInfo.value = null
    }
  }
})
</script>
