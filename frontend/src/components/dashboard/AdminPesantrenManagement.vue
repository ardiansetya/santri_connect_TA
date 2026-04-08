<template>
  <div>
    <div class="card">
      <div class="px-5 py-4 border-b border-border flex justify-between items-center">
        <h5 class="text-lg font-semibold mb-0">Manajemen Pesantren</h5>
        <button class="btn btn-primary px-4 py-2" @click="openForm()">+ Tambah Pesantren</button>
      </div>
      <div class="p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted text-sm">Memuat data...</p>
        </div>
        <div v-else-if="pesantren.length === 0" class="text-center py-6">
          <p class="text-3xl mb-3">🕌</p>
          <h6 class="font-semibold">Belum ada pesantren</h6>
          <p class="text-muted text-sm">Tambahkan pesantren baru untuk mulai mengelola</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-muted">
              <tr>
                <th class="text-left px-4 py-3 text-sm font-medium">Nama</th>
                <th class="text-left px-4 py-3 text-sm font-medium">Lokasi</th>
                <th class="text-left px-4 py-3 text-sm font-medium">Kurikulum</th>
                <th class="text-left px-4 py-3 text-sm font-medium">Santri</th>
                <th class="text-left px-4 py-3 text-sm font-medium">Biaya/Bulan</th>
                <th class="text-left px-4 py-3 text-sm font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in pesantren" :key="p.id" class="border-b border-border hover:bg-muted/50">
                <td class="px-4 py-3 font-medium">{{ p.nama }}</td>
                <td class="px-4 py-3">{{ p.kota }}, {{ p.province }}</td>
                <td class="px-4 py-3"><span class="badge px-2 py-1 text-xs" :class="kurikulumBadge(p.kurikulum)">{{ p.kurikulum || '-' }}</span></td>
                <td class="px-4 py-3">{{ p.jumlah_santri || '-' }}</td>
                <td class="px-4 py-3">{{ formatCurrency(p.biaya_bulanan) }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button class="btn btn-outline-primary px-3 py-1 text-sm" @click="openForm(p)">Edit</button>
                    <button class="btn bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-1 text-sm" @click="confirmDelete(p)">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(0,0,0,0.5)">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center px-5 py-4 border-b border-border">
          <h5 class="text-lg font-semibold mb-0">{{ editingId ? 'Edit Pesantren' : 'Tambah Pesantren' }}</h5>
          <button type="button" class="text-2xl" @click="closeForm">&times;</button>
        </div>
        <div class="p-5">
          <form @submit="onSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label font-medium">Nama Pesantren *</label>
                <input v-model="nama" v-bind="namaProps" type="text" class="form-input" :class="{ 'border-red-500': errors.nama }" />
                <p v-if="errors.nama" class="text-red-500 text-sm mt-1">{{ errors.nama }}</p>
              </div>
              <div>
                <label class="form-label font-medium">Provinsi *</label>
                <select v-model="province" v-bind="provinceProps" class="form-select" :class="{ 'border-red-500': errors.province }">
                  <option value="">Pilih Provinsi</option>
                  <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                </select>
                <p v-if="errors.province" class="text-red-500 text-sm mt-1">{{ errors.province }}</p>
              </div>
              <div>
                <label class="form-label font-medium">Kota *</label>
                <input v-model="kota" v-bind="kotaProps" type="text" class="form-input" :class="{ 'border-red-500': errors.kota }" />
                <p v-if="errors.kota" class="text-red-500 text-sm mt-1">{{ errors.kota }}</p>
              </div>
              <div class="md:col-span-2">
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
                <input v-model="jumlah_santri" v-bind="jumlah_santriProps" type="number" class="form-input" :class="{ 'border-red-500': errors.jumlah_santri }" min="0" />
                <p v-if="errors.jumlah_santri" class="text-red-500 text-sm mt-1">{{ errors.jumlah_santri }}</p>
              </div>
              <div>
                <label class="form-label font-medium">Biaya Pendaftaran</label>
                <input v-model="biaya_pendaftaran" v-bind="biaya_pendaftaranProps" type="number" class="form-input" :class="{ 'border-red-500': errors.biaya_pendaftaran }" min="0" />
                <p v-if="errors.biaya_pendaftaran" class="text-red-500 text-sm mt-1">{{ errors.biaya_pendaftaran }}</p>
              </div>
              <div>
                <label class="form-label font-medium">Biaya Bulanan</label>
                <input v-model="biaya_bulanan" v-bind="biaya_bulananProps" type="number" class="form-input" :class="{ 'border-red-500': errors.biaya_bulanan }" min="0" />
                <p v-if="errors.biaya_bulanan" class="text-red-500 text-sm mt-1">{{ errors.biaya_bulanan }}</p>
              </div>
              <div>
                <label class="form-label font-medium">Email</label>
                <input v-model="email" v-bind="emailProps" type="email" class="form-input" :class="{ 'border-red-500': errors.email }" />
                <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
              </div>
              <div>
                <label class="form-label font-medium">Telepon</label>
                <input v-model="telepon" v-bind="teleponProps" type="text" class="form-input" :class="{ 'border-red-500': errors.telepon }" placeholder="08xxxxxxxxxx" />
                <p v-if="errors.telepon" class="text-red-500 text-sm mt-1">{{ errors.telepon }}</p>
              </div>
               <div class="md:col-span-2">
                 <label class="form-label font-medium">Deskripsi</label>
                 <textarea v-model="deskripsi" v-bind="deskripsiProps" class="form-input" rows="3"></textarea>
               </div>

               <!-- Foto Utama -->
               <div class="md:col-span-2">
                 <label class="form-label font-medium">Foto Utama *</label>
                 <input
                   @change="handleFileUpload('foto_utama', $event)"
                   class="form-input"
                   type="file"
                   accept="image/*"
                   :class="{ 'border-red-500': fileErrors.foto_utama }"
                 />
                 <p v-if="fileErrors.foto_utama" class="text-red-500 text-sm mt-1">{{ fileErrors.foto_utama }}</p>
                 <div class="text-sm text-muted mt-2" v-if="files.foto_utama">
                   ✓ {{ files.foto_utama.name }} ({{ formatFileSize(files.foto_utama.size) }})
                   <button type="button" class="text-red-600 hover:text-red-700 p-0" @click="removeFile('foto_utama')">
                     Hapus
                   </button>
                 </div>
                 <p class="text-xs text-muted mt-1">Format: JPG, JPEG, PNG, WebP. Maksimal 1MB.</p>
               </div>

               <!-- Foto Gallery -->
               <div class="md:col-span-2">
                 <label class="form-label font-medium">Foto Gallery (maksimal 5)</label>
                 <input
                   @change="handleFileUpload('foto_galeri', $event)"
                   class="form-input"
                   type="file"
                   accept="image/*"
                   multiple
                   :class="{ 'border-red-500': fileErrors.foto_galeri }"
                 />
                 <p v-if="fileErrors.foto_galeri" class="text-red-500 text-sm mt-1">{{ fileErrors.foto_galeri }}</p>
                 <div class="text-sm text-muted mt-2" v-if="files.foto_galeri && files.foto_galeri.length > 0">
                   {{ files.foto_galeri.length }} file terpilih:
                   <div class="flex flex-wrap gap-2 mt-2">
                     <div v-for="(file, index) in files.foto_galeri" :key="index" class="bg-gray-200 text-gray-800 text-xs px-3 py-2 rounded flex items-center gap-2">
                       {{ file.name }} ({{ formatFileSize(file.size) }})
                       <button type="button" class="text-red-600 hover:text-red-700 font-bold" @click="removeGalleryFile(index)">
                         ×
                       </button>
                     </div>
                   </div>
                   <button type="button" class="text-red-600 hover:text-red-700 text-sm mt-2" @click="clearGalleryFiles()">
                     Hapus Semua
                   </button>
                 </div>
                 <p class="text-xs text-muted mt-1">Format: JPG, JPEG, PNG, WebP. Maksimal 5 file, masing-masing maksimal 1MB.</p>
               </div>

               <div class="md:col-span-2">
                 <label class="form-label font-medium">Fasilitas (pisahkan dengan koma)</label>
                 <input v-model="fasilitasInput" type="text" class="form-input" placeholder="Masjid, Asrama, Lab Komputer" />
               </div>
            </div>
            <div v-if="serverError" class="bg-red-50 text-red-600 px-4 py-3 rounded mt-4">{{ serverError }}</div>
            <div class="flex justify-end gap-2 mt-4">
              <button type="button" class="btn bg-gray-200 hover:bg-gray-300 px-4 py-2" @click="closeForm">Batal</button>
              <button type="submit" class="btn btn-primary px-4 py-2" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(0,0,0,0.5)">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="flex justify-between items-center px-5 py-4 border-b border-border">
          <h5 class="text-lg font-semibold text-red-600 mb-0">Konfirmasi Hapus</h5>
          <button type="button" class="text-2xl" @click="showDeleteConfirm = false">&times;</button>
        </div>
        <div class="p-5">
          <p>Hapus pesantren <strong>{{ deleteTarget?.nama }}</strong>?</p>
          <p class="text-muted text-sm">Tindakan ini tidak dapat dibatalkan.</p>
          <div v-if="deleteError" class="bg-red-50 text-red-600 px-4 py-2 rounded text-sm mt-3">{{ deleteError }}</div>
        </div>
        <div class="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <button type="button" class="btn bg-gray-200 hover:bg-gray-300 px-4 py-2" @click="showDeleteConfirm = false">Batal</button>
          <button type="button" class="btn bg-red-600 text-white hover:bg-red-700 px-4 py-2" @click="executeDelete" :disabled="deleting">
            <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
            Hapus
          </button>
        </div>
      </div>
    </div>
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
  const map = {
    modern: 'bg-[hsl(231 84% 60%)] text-white',
    salaf: 'bg-[#dcfce7] text-[#166534]',
    campuran: 'bg-[#fef9c3] text-[#854d0e]'
  }
  return map[kurikulum] || 'bg-[#f3f4f6] text-[#1f2937]'
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
     const formData = new FormData()

     Object.entries(values).forEach(([key, value]) => {
       if (value !== null && value !== undefined && value !== '') {
         formData.append(key, value)
       }
     })

     if (fasilitasInput.value.trim()) {
       const fasilitas = fasilitasInput.value.split(',').map(f => f.trim()).filter(Boolean)
       formData.append('fasilitas', JSON.stringify(fasilitas))
     }

     if (files.value.foto_utama) {
       formData.append('foto_utama', files.value.foto_utama)
     }

     if (files.value.foto_galeri && files.value.foto_galeri.length > 0) {
       files.value.foto_galeri.forEach(file => {
         formData.append('foto_galeri', file)
       })
     }

     if (editingId.value) {
       await admin.updatePesantren(editingId.value, formData)
     } else {
       await admin.createPesantren(formData)
     }
     closeForm()
     await loadPesantren()
     emit('refresh')
   } catch (err) {
     serverError.value = err.response?.data?.error || err.response?.data?.message || 'Gagal menyimpan data'
   } finally {
     files.value.foto_utama = null
     files.value.foto_galeri = []
     fileErrors.value.foto_utama = ''
     fileErrors.value.foto_galeri = ''

     const fotoUtamaInput = document.querySelector('input[name="foto_utama"]')
     if (fotoUtamaInput) fotoUtamaInput.value = ''

     const fotoGaleriInput = document.querySelector('input[name="foto_galeri"]')
     if (fotoGaleriInput) fotoGaleriInput.value = ''
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

const files = ref({
   foto_utama: null,
   foto_galeri: []
})
const fileErrors = ref({
   foto_utama: '',
   foto_galeri: ''
})

function handleFileUpload(fieldName, event) {
   const fileInput = event.target
   if (!fileInput.files || fileInput.files.length === 0) {
      if (fieldName === 'foto_utama') {
         files.value.foto_utama = null
         fileErrors.value.foto_utama = ''
      } else if (fieldName === 'foto_galeri') {
         files.value.foto_galeri = []
         fileErrors.value.foto_galeri = ''
      }
      return
   }

   if (fieldName === 'foto_utama') {
      const file = fileInput.files[0]
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
         fileErrors.value.foto_utama = 'Format file tidak didukung. Gunakan jpg, jpeg, png, atau webp'
         files.value.foto_utama = null
         return
      }

      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
         fileErrors.value.foto_utama = 'File terlalu besar. Maksimal ukuran adalah 1MB'
         files.value.foto_utama = null
         return
      }

      fileErrors.value.foto_utama = ''
      files.value.foto_utama = file
   } else if (fieldName === 'foto_galeri') {
      const selectedFiles = Array.from(fileInput.files)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

      for (const file of selectedFiles) {
         if (!allowedTypes.includes(file.type)) {
            fileErrors.value.foto_galeri = 'Format file tidak didukung. Gunakan jpg, jpeg, png, atau webp'
            files.value.foto_galeri = []
            return
         }

         const maxSize = 1 * 1024 * 1024
         if (file.size > maxSize) {
            fileErrors.value.foto_galeri = 'File terlalu besar. Maksimal ukuran adalah 1MB per file'
            files.value.foto_galeri = []
            return
         }
      }

      if (selectedFiles.length > 5) {
         fileErrors.value.foto_galeri = 'Foto gallery maksimal 5 file'
         files.value.foto_galeri = []
         return
      }

      fileErrors.value.foto_galeri = ''
      files.value.foto_galeri = selectedFiles
   }
}

function removeFile(fieldName) {
   if (fieldName === 'foto_utama') {
      files.value.foto_utama = null
      const fileInput = document.querySelector(`input[name="${fieldName}"]`)
      if (fileInput) fileInput.value = ''
   }
}

function removeGalleryFile(index) {
   files.value.foto_galeri.splice(index, 1)
   const fileInput = document.querySelector('input[name="foto_galeri"]')
   if (fileInput) fileInput.value = ''
}

function clearGalleryFiles() {
   files.value.foto_galeri = []
   const fileInput = document.querySelector('input[name="foto_galeri"]')
   if (fileInput) fileInput.value = ''
}

function formatFileSize(bytes) {
   if (bytes === 0) return '0 Bytes'
   const k = 1024
   const sizes = ['Bytes', 'KB', 'MB', 'GB']
   const i = Math.floor(Math.log(bytes) / Math.log(k))
   return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

onMounted(async () => {
  await Promise.all([loadPesantren(), loadProvinces()])
})
</script>

<style scoped>
/* All styles using Tailwind CSS */
</style>
