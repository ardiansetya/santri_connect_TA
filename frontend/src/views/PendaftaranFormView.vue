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
              <form @submit.prevent="submitPendaftaran">
                <h6 class="fw-semibold mb-3 pb-2 border-bottom">Data Pribadi</h6>
                <div class="row g-3 mb-4">
                  <div class="col-12">
                    <label class="form-label fw-medium">Nama Lengkap *</label>
                    <input v-model="form.nama_lengkap" type="text" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">NIK *</label>
                    <input v-model="form.nik" type="text" class="form-control" maxlength="16" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Jenis Kelamin *</label>
                    <select v-model="form.jenis_kelamin" class="form-select" required>
                      <option value="">Pilih</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Tempat Lahir</label>
                    <input v-model="form.tempat_lahir" type="text" class="form-control" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Tanggal Lahir</label>
                    <input v-model="form.tanggal_lahir" type="date" class="form-control" />
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-medium">Alamat</label>
                    <textarea v-model="form.alamat" class="form-control" rows="2"></textarea>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">No. HP</label>
                    <input v-model="form.no_hp" type="tel" class="form-control" />
                  </div>
                </div>

                <h6 class="fw-semibold mb-3 pb-2 border-bottom">Data Orang Tua</h6>
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Nama Ayah</label>
                    <input v-model="form.nama_ayah" type="text" class="form-control" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Nama Ibu</label>
                    <input v-model="form.nama_ibu" type="text" class="form-control" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">No. HP Orang Tua</label>
                    <input v-model="form.no_hp_ortu" type="tel" class="form-control" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Pekerjaan Orang Tua</label>
                    <input v-model="form.pekerjaan_ortu" type="text" class="form-control" />
                  </div>
                </div>

                <h6 class="fw-semibold mb-3 pb-2 border-bottom">Dokumen</h6>
                <div class="row g-3 mb-4">
                  <div class="col-md-4">
                    <label class="form-label fw-medium">Foto KTP</label>
                    <input type="file" class="form-control" accept="image/*" @change="handleFile('foto_ktp', $event)" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-medium">Pas Foto</label>
                    <input type="file" class="form-control" accept="image/*" @change="handleFile('pas_foto', $event)" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-medium">Kartu Keluarga</label>
                    <input type="file" class="form-control" accept="image/*,.pdf" @change="handleFile('kartu_keluarga', $event)" />
                  </div>
                </div>

                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                <div v-if="success" class="alert alert-success">
                  <strong>Berhasil!</strong> Pendaftaran Anda telah dikirim. Nomor: <strong>{{ success }}</strong>
                  <router-link to="/track" class="btn btn-sm btn-outline-success ms-2">Cek Status</router-link>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" :disabled="submitting || success">
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                    {{ submitting ? 'Mengirim...' : 'Kirim Pendaftaran' }}
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { pesantren as pesantrenApi, pendaftaran } from '../services'

const route = useRoute()
const pesantrenInfo = ref(null)
const form = ref({
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
})
const files = ref({})
const error = ref('')
const success = ref('')
const submitting = ref(false)

function handleFile(field, event) {
  const file = event.target.files[0]
  if (file) files.value[field] = file
}

async function submitPendaftaran() {
  error.value = ''
  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('pesantren_id', route.params.id)
    Object.entries(form.value).forEach(([key, val]) => {
      if (val) formData.append(key, val)
    })
    Object.entries(files.value).forEach(([key, file]) => {
      formData.append(key, file)
    })

    const { data } = await pendaftaran.create(formData)
    success.value = data.data?.nomor_pendaftaran || 'Berhasil'
  } catch (err) {
    error.value = err.response?.data?.error || 'Gagal mengirim pendaftaran'
  } finally {
    submitting.value = false
  }
}

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
