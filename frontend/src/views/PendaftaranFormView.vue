<template>
  <div class="py-4">
    <div class="container mx-auto px-4 max-w-4xl">
      <nav class="mb-4 text-sm">
        <router-link to="/pesantren" class="text-primary hover:underline">Pesantren</router-link>
        <span class="mx-2 text-muted">/</span>
        <span class="text-muted-foreground">Pendaftaran</span>
      </nav>

      <div v-if="pesantrenInfo" class="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
        <h4 class="font-semibold text-primary">📍 {{ pesantrenInfo.nama }}</h4>
        <p class="text-sm text-muted-foreground mt-1">{{ pesantrenInfo.kota }}, {{ pesantrenInfo.province }}</p>
      </div>

      <div class="bg-white rounded-xl shadow-md border border-border overflow-hidden">
        <div class="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
          <h3 class="font-semibold text-lg text-foreground">Form Pendaftaran Pesantren</h3>
          <p class="text-sm text-muted-foreground mt-1">Lengkapi data di bawah ini untuk mendaftar</p>
        </div>

        <div class="p-6">
          <form @submit="onSubmit">
            <!-- Data Pribadi -->
            <div class="mb-6">
              <h5 class="font-semibold text-base text-foreground flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <span class="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-semibold">1</span>
                Data Pribadi
              </h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium mb-1.5 text-foreground">Nama Lengkap <span class="text-red-500">*</span></label>
                  <input v-model="nama_lengkap" v-bind="nama_lengkapProps" type="text" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" :class="{ 'border-red-500 ring-1 ring-red-500': errors.nama_lengkap }" placeholder="Masukkan nama lengkap" />
                  <p v-if="errors.nama_lengkap" class="text-red-500 text-xs mt-1">{{ errors.nama_lengkap }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">NIK <span class="text-red-500">*</span></label>
                  <input v-model="nik" v-bind="nikProps" type="text" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" :class="{ 'border-red-500 ring-1 ring-red-500': errors.nik }" maxlength="16" inputmode="numeric" placeholder="16 digit NIK" />
                  <p v-if="errors.nik" class="text-red-500 text-xs mt-1">{{ errors.nik }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">Jenis Kelamin <span class="text-red-500">*</span></label>
                  <select v-model="jenis_kelamin" v-bind="jenis_kelaminProps" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" :class="{ 'border-red-500 ring-1 ring-red-500': errors.jenis_kelamin }">
                    <option value="">Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                  <p v-if="errors.jenis_kelamin" class="text-red-500 text-xs mt-1">{{ errors.jenis_kelamin }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">Tempat Lahir</label>
                  <input v-model="tempat_lahir" v-bind="tempat_lahirProps" type="text" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" :class="{ 'border-red-500 ring-1 ring-red-500': errors.tempat_lahir }" placeholder="Contoh: Jakarta" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">Tanggal Lahir</label>
                  <input v-model="tanggal_lahir" v-bind="tanggal_lahirProps" type="date" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" :class="{ 'border-red-500 ring-1 ring-red-500': errors.tanggal_lahir }" :max="maxDate" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium mb-1.5 text-foreground">Alamat</label>
                  <textarea v-model="alamat" v-bind="alamatProps" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white resize-none" :class="{ 'border-red-500 ring-1 ring-red-500': errors.alamat }" rows="2" placeholder="Alamat lengkap"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">No. HP</label>
                  <input v-model="no_hp" v-bind="no_hpProps" type="tel" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" :class="{ 'border-red-500 ring-1 ring-red-500': errors.no_hp }" placeholder="08xxxxxxxxxx" />
                  <p v-if="errors.no_hp" class="text-red-500 text-xs mt-1">{{ errors.no_hp }}</p>
                </div>
              </div>
            </div>

            <!-- Data Orang Tua -->
            <div class="mb-6">
              <h5 class="font-semibold text-base text-foreground flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <span class="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-semibold">2</span>
                Data Orang Tua
              </h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">Nama Ayah</label>
                  <input v-model="nama_ayah" v-bind="nama_ayahProps" type="text" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="Nama lengkap ayah" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">Nama Ibu</label>
                  <input v-model="nama_ibu" v-bind="nama_ibuProps" type="text" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="Nama lengkap ibu" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">No. HP Orang Tua</label>
                  <input v-model="no_hp_ortu" v-bind="no_hp_ortuProps" type="tel" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" :class="{ 'border-red-500 ring-1 ring-red-500': errors.no_hp_ortu }" placeholder="08xxxxxxxxxx" />
                  <p v-if="errors.no_hp_ortu" class="text-red-500 text-xs mt-1">{{ errors.no_hp_ortu }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">Pekerjaan Orang Tua</label>
                  <input v-model="pekerjaan_ortu" v-bind="pekerjaan_ortuProps" type="text" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="Pekerjaan" />
                </div>
              </div>
            </div>

            <!-- Dokumen -->
            <div class="mb-6">
              <h5 class="font-semibold text-base text-foreground flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <span class="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-semibold">3</span>
                Upload Dokumen
              </h5>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">Foto KTP</label>
                  <input type="file" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:text-sm file:font-medium file:cursor-pointer hover:file:bg-primary/20" accept="image/*" :class="{ 'border-red-500': fileErrors.foto_ktp }" @change="handleFile('foto_ktp', $event)" />
                  <p v-if="fileErrors.foto_ktp" class="text-red-500 text-xs mt-1">{{ fileErrors.foto_ktp }}</p>
                  <p v-if="files.foto_ktp" class="text-green-600 text-xs mt-1">✓ {{ files.foto_ktp.name }} ({{ formatFileSize(files.foto_ktp.size) }})</p>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">Pas Foto</label>
                  <input type="file" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:text-sm file:font-medium file:cursor-pointer hover:file:bg-primary/20" accept="image/*" :class="{ 'border-red-500': fileErrors.pas_foto }" @change="handleFile('pas_foto', $event)" />
                  <p v-if="fileErrors.pas_foto" class="text-red-500 text-xs mt-1">{{ fileErrors.pas_foto }}</p>
                  <p v-if="files.pas_foto" class="text-green-600 text-xs mt-1">✓ {{ files.pas_foto.name }} ({{ formatFileSize(files.pas_foto.size) }})</p>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-foreground">Kartu Keluarga</label>
                  <input type="file" class="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:text-sm file:font-medium file:cursor-pointer hover:file:bg-primary/20" accept="image/*,.pdf" :class="{ 'border-red-500': fileErrors.kartu_keluarga }" @change="handleFile('kartu_keluarga', $event)" />
                  <p v-if="fileErrors.kartu_keluarga" class="text-red-500 text-xs mt-1">{{ fileErrors.kartu_keluarga }}</p>
                  <p v-if="files.kartu_keluarga" class="text-green-600 text-xs mt-1">✓ {{ files.kartu_keluarga.name }} ({{ formatFileSize(files.kartu_keluarga.size) }})</p>
                </div>
              </div>
            </div>

            <!-- Alerts -->
            <div v-if="serverError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <span class="font-semibold">❌ Gagal:</span> {{ serverError }}
            </div>
            <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start gap-3">
                <div class="flex-1">
                  <p class="text-green-700 font-semibold">✅ Pendaftaran Berhasil!</p>
                  <p class="text-green-600 text-sm mt-1">Nomor pendaftaran Anda:</p>
                  <div class="flex items-center gap-2 mt-2">
                    <code class="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg font-mono font-semibold text-base">{{ success }}</code>
                    <button
                      @click="copyNomor"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                      :class="{ 'opacity-75': copiedNomor }"
                    >
                      <svg v-if="copiedNomor" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {{ copiedNomor ? 'Tersalin!' : 'Salin' }}
                    </button>
                  </div>
                </div>
              </div>
              <router-link to="/track" class="inline-block mt-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                📋 Cek Status Pendaftaran
              </router-link>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <button type="submit" class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!!success">
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran' }}
              </button>
              <router-link to="/pesantren" class="inline-flex items-center justify-center px-6 py-2.5 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors">
                Batal
              </router-link>
            </div>

            <!-- Validation Errors Display -->
            <div v-if="Object.keys(errors).length > 0" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-sm font-semibold text-yellow-800 mb-2">⚠️ Mohon perbaiki field berikut:</p>
              <ul class="text-sm text-yellow-700 list-disc pl-5 space-y-1">
                <li v-for="(msg, key) in errors" :key="key" class="capitalize">{{ key.replace(/_/g, ' ') }}: {{ msg }}</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { pesantren as pesantrenApi, pendaftaran } from '../services'
import { useToast } from 'vue-toastification'

const route = useRoute()
const toast = useToast()
const pesantrenInfo = ref(null)
const files = ref({})
const fileErrors = ref({})
const serverError = ref('')
const success = ref('')
const copiedNomor = ref(false)

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

async function copyNomor() {
  if (!success.value) return
  
  try {
    await navigator.clipboard.writeText(success.value)
    copiedNomor.value = true
    toast.success(`Nomor "${success.value}" berhasil disalin`, { title: 'Berhasil Disalin' })
    setTimeout(() => {
      copiedNomor.value = false
    }, 2000)
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = success.value
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      copiedNomor.value = true
      toast.success(`Nomor "${success.value}" berhasil disalin`, { title: 'Berhasil Disalin' })
      setTimeout(() => {
        copiedNomor.value = false
      }, 2000)
    } catch (e) {
      toast.error('Gagal menyalin nomor pendaftaran', { title: 'Gagal' })
    }
    document.body.removeChild(textArea)
  }
}

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  console.log('[PendaftaranForm] 📤 Submitting form with values:', values);
  console.log('[PendaftaranForm] 📎 Files:', Object.keys(files.value));
  
  try {
    const formData = new FormData()
    formData.append('pesantren_id', route.params.id)
    Object.entries(values).forEach(([key, val]) => {
      if (val) formData.append(key, val)
    })
    Object.entries(files.value).forEach(([key, file]) => {
      formData.append(key, file)
    })

    console.log('[PendaftaranForm] 📦 FormData entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${(value.size / 1024).toFixed(1)} KB)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    // Add timeout to prevent hanging
    const { data } = await pendaftaran.create(formData, {
      timeout: 30000 // 30 seconds timeout
    })
    
    success.value = data.data?.nomor_pendaftaran || 'Berhasil'
    
    console.log('[PendaftaranForm] ✅ Pendaftaran berhasil:', {
      nomor: success.value,
      pesantren_id: route.params.id,
      nama: values.nama_lengkap,
      nik: values.nik,
      timestamp: new Date().toISOString()
    });
    
    toast.success(`Nomor pendaftaran: ${success.value}`, { title: 'Pendaftaran Berhasil' })
  } catch (err) {
    console.error('[PendaftaranForm] ❌ Error:', {
      message: err.message,
      code: err.code,
      response: err.response?.data,
      status: err.response?.status
    });
    
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      serverError.value = 'Waktu permintaan habis. Periksa koneksi internet Anda dan coba lagi.'
      toast.error('Waktu permintaan habis', { title: 'Timeout' })
    } else {
      serverError.value = err.response?.data?.error || 'Gagal mengirim pendaftaran'
      toast.error(serverError.value, { title: 'Gagal Mendaftar' })
    }
  }
})

// Debug logging
watch([() => isSubmitting.value, () => success.value, errors], ([submitting, suc, errs]) => {
  console.log('[PendaftaranForm] 📊 State:', {
    isSubmitting: submitting,
    success: suc,
    errors: errs,
    errorsCount: Object.keys(errs).length
  });
});

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
