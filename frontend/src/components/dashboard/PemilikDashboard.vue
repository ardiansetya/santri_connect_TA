<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="card" style="border-left: 4px solid hsl(231 84% 60%)">
        <div class="p-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-muted text-sm mb-1">Pesantren Saya</p>
              <h3 class="font-bold mb-0">{{ pesantren.length }}</h3>
            </div>
            <div class="text-4xl text-primary opacity-50">🕌</div>
          </div>
        </div>
      </div>
      <div class="card" style="border-left: 4px solid #3b82f6">
        <div class="p-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-muted text-sm mb-1">Total Mahasiswa</p>
              <h3 class="font-bold mb-0">{{ totalSantri }}</h3>
            </div>
            <div class="text-4xl text-blue-500 opacity-50">👥</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex justify-between items-center p-3 border-b border-border">
        <h5 class="font-semibold mb-0">Pesantren Saya</h5>
        <button class="btn btn-primary btn-sm" @click="openForm()" :disabled="!canAdd">
          + Tambah Pesantren
        </button>
      </div>
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted text-sm">Memuat data...</p>
      </div>
      <div v-else-if="pesantren.length === 0" class="text-center py-5">
        <p class="text-3xl mb-3">🏫</p>
        <h6 class="font-semibold">Belum ada pesantren</h6>
        <p class="text-muted text-sm mb-3">Tambahkan pesantren Anda untuk mulai mengelola</p>
        <button class="btn btn-primary btn-sm" @click="openForm()">+ Tambah Pesantren</button>
      </div>
      <div v-else>
        <div
          v-for="p in pesantren"
          :key="p.id"
          class="p-3 border-b border-border"
        >
          <div class="flex justify-between items-center">
            <div>
              <h6 class="font-semibold mb-1">{{ p.nama }}</h6>
              <small class="text-muted">📍 {{ p.kota }}, {{ p.province }}</small>
              <span v-if="p.kurikulum" class="badge ml-2" :class="kurikulumBadge(p.kurikulum)">{{ p.kurikulum }}</span>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-outline-primary btn-sm" @click="openForm(p)">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(0,0,0,0.5)">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h5 class="font-semibold text-lg">{{ editingId ? 'Edit Pesantren' : 'Tambah Pesantren' }}</h5>
          <button type="button" class="text-2xl" @click="closeForm">&times;</button>
        </div>
        <div class="p-4">
          <form @submit="onSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label font-medium">Nama Pesantren *</label>
                <input v-model="nama" v-bind="namaProps" type="text" class="form-input" :class="{ 'border-red-500': errors.nama }" />
                <p v-if="errors.nama" class="text-red-500 text-sm mt-1">{{ errors.nama }}</p>
              </div>
              <div>
                <label class="form-label font-medium">Provinsi *</label>
                <select v-model="province" v-bind="provinceProps" class="form-select" :class="{ 'border-red-500': errors.province }" @change="onProvinceChange">
                  <option value="">Pilih Provinsi</option>
                  <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                </select>
                <p v-if="errors.province" class="text-red-500 text-sm mt-1">{{ errors.province }}</p>
              </div>
              <div>
                <label class="form-label font-medium">Kota *</label>
                <select v-model="kota" v-bind="kotaProps" class="form-select" :class="{ 'border-red-500': errors.kota }" :disabled="!cities.length && province">
                  <option value="">Pilih Kota</option>
                  <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
                </select>
                <p v-if="errors.kota" class="text-red-500 text-sm mt-1">{{ errors.kota }}</p>
              </div>
              <div>
                <label class="form-label font-medium">Alamat</label>
                <input v-model="alamat" v-bind="alamatProps" type="text" class="form-input" />
              </div>
              <div>
                <label class="form-label font-medium">Kurikulum</label>
                <select v-model="kurikulum" v-bind="kurikulumProps" class="form-select">
                  <option value="">Pilih Kurikulum</option>
                  <option value="modern">Modern</option>
                  <option value="salaf">Salaf</option>
                  <option value="campuran">Campuran</option>
                </select>
              </div>
              <div>
                <label class="form-label font-medium">Tahun Berdiri</label>
                <input v-model="tahun_berdiri" v-bind="tahun_berdiriProps" type="number" class="form-input" :class="{ 'border-red-500': errors.tahun_berdiri }" min="1900" :max="currentYear" />
                <p v-if="errors.tahun_berdiri" class="text-red-500 text-sm mt-1">{{ errors.tahun_berdiri }}</p>
              </div>
              <div>
                <label class="form-label font-medium">Jumlah Santri</label>
                <input v-model="jumlah_santri" v-bind="jumlah_santriProps" type="number" class="form-input" min="0" />
              </div>
              <div>
                <label class="form-label font-medium">Jumlah Pengajar</label>
                <input v-model="jumlah_pengajar" v-bind="jumlah_pengajarProps" type="number" class="form-input" min="0" />
              </div>
              <div>
                <label class="form-label font-medium">Biaya Bulanan (Rp)</label>
                <input v-model="biaya_bulanan" v-bind="biaya_bulananProps" type="number" class="form-input" min="0" />
              </div>
              <div>
                <label class="form-label font-medium">Biaya Pendaftaran (Rp)</label>
                <input v-model="biaya_pendaftaran" v-bind="biaya_pendaftaranProps" type="number" class="form-input" min="0" />
              </div>
              <div class="md:col-span-2">
                <label class="form-label font-medium">Fasilitas</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <label v-for="f in fasilitasOptions" :key="f" class="flex items-center">
                    <input type="checkbox" :value="f" v-model="fasilitas" class="w-4 h-4 mr-2" />
                    {{ f }}
                  </label>
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="form-label font-medium">Deskripsi</label>
                <textarea v-model="deskripsi" v-bind="deskripsiProps" class="form-input" rows="3"></textarea>
              </div>
              <div class="md:col-span-2">
                <label class="form-label font-medium">Telepon</label>
                <input v-model="telepon" type="text" class="form-input" />
              </div>
              <div class="md:col-span-2">
                <label class="form-label font-medium">Email</label>
                <input v-model="email" type="email" class="form-input" />
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <button type="button" class="btn btn-outline" @click="closeForm">Batal</button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ editingId ? 'Simpan' : 'Tambah' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { pemilik } from '../../services'
import { wilayah } from '../../services'

const props = defineProps({
  user: Object
})

const emit = defineEmits(['refresh'])

const pesantren = ref([])
const provinces = ref([])
const cities = ref([])
const loading = ref(false)
const submitting = ref(false)
const showForm = ref(false)
const editingId = ref(null)

const nama = ref('')
const province = ref('')
const kota = ref('')
const alamat = ref('')
const kurikulum = ref('')
const tahun_berdiri = ref(null)
const jumlah_santri = ref(null)
const jumlah_pengajar = ref(null)
const biaya_bulanan = ref(null)
const biaya_pendaftaran = ref(null)
const fasilitas = ref([])
const deskripsi = ref('')
const telepon = ref('')
const email = ref('')

const errors = ref({})

const currentYear = new Date().getFullYear()

const fasilitasOptions = [
  'Masjid', 'Asrama', 'Lab Komputer', 'Perpustakaan',
  'Lapangan Olahraga', 'Kantin', 'Klinik', 'Ruang Kelas AC',
  'Tempat Parkir', 'WiFi'
]

const totalSantri = computed(() => {
  return pesantren.value.reduce((sum, p) => sum + (p.jumlah_santri || 0), 0)
})

const canAdd = computed(() => {
  return true
})

function kurikulumBadge(kurikulum) {
  const map = {
    modern: 'bg-[hsl(231 84% 60%)] text-white',
    salaf: 'bg-[#dcfce7] text-[#166534]',
    campuran: 'bg-[#fef9c3] text-[#854d0e]'
  }
  return map[kurikulum] || 'bg-[#f3f4f6] text-[#1f2937]'
}

async function fetchProvinces() {
  try {
    const { data } = await wilayah.getProvinces()
    provinces.value = data.data || []
  } catch (e) {
    console.error(e)
  }
}

async function onProvinceChange() {
  kota.value = ''
  cities.value = []
  if (!province.value) return
  const p = provinces.value.find(p => p.name === province.value)
  if (p) {
    try {
      const { data } = await wilayah.getRegencies(p.id)
      cities.value = (data.data || []).map(r => r.name)
    } catch (e) {
      console.error(e)
    }
  }
}

function openForm(p = null) {
  if (p) {
    editingId.value = p.id
    nama.value = p.nama
    province.value = p.province
    kota.value = p.kota
    alamat.value = p.alamat || ''
    kurikulum.value = p.kurikulum || ''
    tahun_berdiri.value = p.tahun_berdiri
    jumlah_santri.value = p.jumlah_santri
    jumlah_pengajar.value = p.jumlah_pengajar
    biaya_bulanan.value = p.biaya_bulanan
    biaya_pendaftaran.value = p.biaya_pendaftaran
    fasilitas.value = p.fasilitas || []
    deskripsi.value = p.deskripsi || ''
    telepon.value = p.telepon || ''
    email.value = p.email || ''
    onProvinceChange()
  } else {
    resetForm()
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  resetForm()
}

function resetForm() {
  editingId.value = null
  nama.value = ''
  province.value = ''
  kota.value = ''
  alamat.value = ''
  kurikulum.value = ''
  tahun_berdiri.value = null
  jumlah_santri.value = null
  jumlah_pengajar.value = null
  biaya_bulanan.value = null
  biaya_pendaftaran.value = null
  fasilitas.value = []
  deskripsi.value = ''
  telepon.value = ''
  email.value = ''
  errors.value = {}
}

async function onSubmit() {
  errors.value = {}
  if (!nama.value) errors.value.nama = 'Nama wajib diisi'
  if (!province.value) errors.value.province = 'Provinsi wajib dipilih'
  if (!kota.value) errors.value.kota = 'Kota wajib dipilih'

  if (Object.keys(errors.value).length > 0) return

  submitting.value = true
  try {
    const data = {
      nama: nama.value,
      province: province.value,
      kota: kota.value,
      alamat: alamat.value,
      kurikulum: kurikulum.value,
      tahun_berdiri: tahun_berdiri.value,
      jumlah_santri: jumlah_santri.value,
      jumlah_pengajar: jumlah_pengajar.value,
      biaya_bulanan: biaya_bulanan.value,
      biaya_pendaftaran: biaya_pendaftaran.value,
      fasilitas: fasilitas.value,
      deskripsi: deskripsi.value,
      telepon: telepon.value,
      email: email.value
    }

    if (editingId.value) {
      await pemilik.updatePesantren(editingId.value, data)
    } else {
      await pemilik.createPesantren(data)
    }

    closeForm()
    await fetchData()
    emit('refresh')
  } catch (e) {
    console.error(e)
    if (e.response?.data?.errors) {
      errors.value = e.response.data.errors
    }
  } finally {
    submitting.value = false
  }
}

async function fetchData() {
  loading.value = true
  try {
    const { data } = await pemilik.getPesantren()
    pesantren.value = data.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchProvinces()
  await fetchData()
})
</script>

<style scoped>
/* All styles using Tailwind CSS */
</style>
