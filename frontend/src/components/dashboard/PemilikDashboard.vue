<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
      <div class="card" style="border-left: 4px solid #22c55e">
        <div class="p-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-muted text-sm mb-1">Pendaftar Menunggu</p>
              <h3 class="font-bold mb-0">{{ pendingCount }}</h3>
            </div>
            <div class="text-4xl text-green-500 opacity-50">📋</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="card mb-4">
      <div class="border-b border-border">
        <nav class="flex gap-1 p-2">
          <button
            @click="activeTab = 'pesantren'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="activeTab === 'pesantren' ? 'bg-primary text-white' : 'text-muted hover:bg-muted'"
          >
            🕌 Pesantren Saya
          </button>
          <button
            @click="activeTab = 'pendaftar'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors relative"
            :class="activeTab === 'pendaftar' ? 'bg-primary text-white' : 'text-muted hover:bg-muted'"
          >
            📋 Pendaftar
            <span v-if="pendingCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ pendingCount }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Pesantren Tab -->
    <div v-if="activeTab === 'pesantren'" class="card">
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
              <button class="btn btn-outline-danger btn-sm" @click="confirmDelete(p)" :disabled="deletingId === p.id">
                <span v-if="deletingId === p.id" class="spinner-border spinner-border-sm me-1"></span>
                {{ deletingId === p.id ? 'Menghapus...' : 'Hapus' }}
              </button>
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
              <div class="md:col-span-2">
                <label class="form-label font-medium">Website</label>
                <input v-model="website" type="url" placeholder="https://contoh.com" class="form-input" />
              </div>
              <div class="md:col-span-2 border-t border-border pt-4 mt-2">
                <h6 class="font-semibold mb-3">Informasi Rekening Pembayaran</h6>
              </div>
              <div>
                <label class="form-label font-medium">Nama Bank</label>
                <input v-model="nama_bank" type="text" placeholder="Contoh: BRI, BNI, Mandiri" class="form-input" />
              </div>
              <div>
                <label class="form-label font-medium">Nomor Rekening</label>
                <input v-model="nomor_rekening" type="text" class="form-input" />
              </div>
              <div class="md:col-span-2">
                <label class="form-label font-medium">Atas Nama Rekening</label>
                <input v-model="atas_nama_rekening" type="text" class="form-input" />
              </div>
              <div class="md:col-span-2">
                <label class="form-label font-medium">Foto Utama</label>
                <input type="file" @change="onFileChange" accept="image/jpeg,image/jpg,image/png,image/webp" class="form-input" />
                <p class="text-muted text-sm mt-1">Format: JPG, JPEG, PNG, WEBP. Maksimal 1MB</p>
                <div v-if="fotoPreview" class="mt-3 relative">
                  <img :src="fotoPreview" class="w-full h-48 object-cover rounded-lg border" />
                  <button v-if="editingId" type="button" @click="removeFotoUtama" class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg">&times;</button>
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="form-label font-medium">Galeri Foto (maksimal 5)</label>
                <input type="file" @change="onGalleryChange" accept="image/jpeg,image/jpg,image/png,image/webp" multiple class="form-input" />
                <p class="text-muted text-sm mt-1">Format: JPG, JPEG, PNG, WEBP. Maksimal 1MB per foto</p>
                <div v-if="galleryPreview.length" class="grid grid-cols-3 gap-2 mt-3">
                  <div v-for="(img, idx) in galleryPreview" :key="idx" class="relative">
                    <img :src="img" class="w-full h-32 object-cover rounded-lg border" />
                    <button type="button" @click="removeGallery(idx)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">&times;</button>
                  </div>
                </div>
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

    <!-- Pendaftar Tab -->
    <div v-if="activeTab === 'pendaftar'" class="card">
      <div class="p-4 border-b border-border">
        <h5 class="font-semibold mb-0">Daftar Pendaftar Pesantren</h5>
        <p class="text-muted text-sm mt-1">Terima atau tolak pendaftar yang mendaftar ke pesantren Anda</p>
      </div>

      <div v-if="pendaftarLoading" class="text-center py-8">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-muted text-sm">Memuat data pendaftar...</p>
      </div>

      <div v-else-if="pendaftar.length === 0" class="text-center py-8">
        <p class="text-4xl mb-3">📭</p>
        <h6 class="font-semibold">Belum ada pendaftar</h6>
        <p class="text-muted text-sm mt-1">Pendaftar akan muncul ketika ada yang mendaftar ke pesantren Anda</p>
      </div>

      <div v-else>
        <!-- Filter by Status -->
        <div class="p-3 border-b border-border flex gap-2 flex-wrap">
          <button
            v-for="status in ['semua', 'pending', 'diterima', 'ditolak']"
            :key="status"
            @click="filterStatus = status"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            :class="filterStatus === status ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
          >
            {{ status === 'semua' ? 'Semua' : status === 'pending' ? '⏳ Pending' : status === 'diterima' ? '✅ Diterima' : '❌ Ditolak' }}
            <span v-if="status !== 'semua'" class="ml-1 opacity-75">({{ pendaftar.filter(p => p.status === status).length }})</span>
          </button>
        </div>

        <!-- Pendaftar List -->
        <div
          v-for="p in filteredPendaftar"
          :key="p.id"
          class="p-4 border-b border-border hover:bg-muted/30 transition-colors"
        >
          <div class="flex flex-col md:flex-row md:items-start gap-4">
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start gap-3">
                <div class="flex-1 min-w-0">
                  <h6 class="font-semibold text-base truncate">{{ p.nama_lengkap }}</h6>
                  <p class="text-muted text-sm">📍 {{ p.pesantren?.nama || 'Pesantren' }}</p>
                  <p class="text-xs text-muted mt-1">
                    📋 {{ p.nomor_pendaftaran }} • {{ formatDate(p.created_at) }}
                  </p>
                  <div class="flex flex-wrap gap-2 mt-2 text-xs text-muted">
                    <span>📞 {{ p.no_hp || '-' }}</span>
                    <span v-if="p.jenis_kelamin">• {{ p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</span>
                  </div>
                </div>
                <span class="badge text-xs px-2 py-1 whitespace-nowrap" :class="statusBadge(p.status)">
                  {{ statusLabel(p.status) }}
                </span>
              </div>

              <!-- Catatan Admin -->
              <div v-if="p.catatan_admin" class="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <strong>Catatan:</strong> {{ p.catatan_admin }}
              </div>

              <!-- Action Buttons -->
              <div v-if="p.status === 'pending'" class="flex gap-2 mt-3">
                <button
                  @click="openStatusModal(p, 'diterima')"
                  class="btn btn-success btn-sm"
                  :disabled="processingId === p.id"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Terima
                </button>
                <button
                  @click="openStatusModal(p, 'ditolak')"
                  class="btn btn-danger btn-sm"
                  :disabled="processingId === p.id"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(0,0,0,0.5)">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div class="text-center mb-4">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-3" :class="statusAction === 'diterima' ? 'bg-green-100' : 'bg-red-100'">
            <svg v-if="statusAction === 'diterima'" class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold">
            {{ statusAction === 'diterima' ? 'Terima Pendaftar?' : 'Tolak Pendaftar?' }}
          </h3>
          <p class="text-sm text-muted mt-1">{{ statusTarget?.nama_lengkap }}</p>
          <p class="text-xs text-muted">{{ statusTarget?.nomor_pendaftaran }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5">Catatan (Opsional)</label>
          <textarea
            v-model="statusCatatan"
            rows="3"
            class="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
            :placeholder="statusAction === 'diterima' ? 'Contoh: Selamat, Anda diterima. Silakan lapor...' : 'Contoh: Kuota sudah penuh...'"
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            class="btn btn-outline flex-1"
            @click="closeStatusModal"
            :disabled="processingId"
          >
            Batal
          </button>
          <button
            type="button"
            class="btn flex-1 "
            :class="statusAction === 'diterima' ? 'btn-success' : 'btn-danger'"
            @click="executeStatusUpdate"
            :disabled="processingId"
          >
            <span v-if="processingId" class="spinner-border  spinner-border-sm me-2"></span>
            {{ processingId ? 'Memproses...' : (statusAction === 'diterima' ? '✅ Terima' : '❌ Tolak') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(0,0,0,0.5)">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Hapus Pesantren?</h3>
          <p class="text-sm text-gray-600 mb-1">Apakah Anda yakin ingin menghapus</p>
          <p class="text-base font-bold text-gray-900 mb-4">"{{ deleteTarget?.nama }}"?</p>
          <p class="text-xs text-red-500 mb-6">⚠️ Tindakan ini tidak dapat dibatalkan. Semua data termasuk foto akan dihapus permanen.</p>
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            class="btn btn-outline flex-1"
            @click="closeDeleteModal"
            :disabled="deletingId"
          >
            Batal
          </button>
          <button
            type="button"
            class="btn btn-danger flex-1"
            @click="executeDelete"
            :disabled="deletingId"
          >
            <span v-if="deletingId" class="spinner-border spinner-border-sm me-2"></span>
            {{ deletingId ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { pemilik } from '../../services'
import { wilayah } from '../../services'
import { getUploadUrl } from '../../services/api'

const props = defineProps({
  user: Object
})

const emit = defineEmits(['refresh'])

const toast = useToast()

// Tab state
const activeTab = ref('pesantren')

// Pesantren state
const pesantren = ref([])
const provinces = ref([])
const cities = ref([])
const loading = ref(false)
const submitting = ref(false)
const showForm = ref(false)
const editingId = ref(null)
const showDeleteModal = ref(false)
const deleteTarget = ref(null)
const deletingId = ref(null)

// Pendaftar state
const pendaftar = ref([])
const pendaftarLoading = ref(false)
const filterStatus = ref('semua')
const showStatusModal = ref(false)
const statusTarget = ref(null)
const statusAction = ref('diterima')
const statusCatatan = ref('')
const processingId = ref(null)

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
const website = ref('')
const nama_bank = ref('')
const nomor_rekening = ref('')
const atas_nama_rekening = ref('')
const fotoFile = ref(null)
const fotoPreview = ref('')
const fotoDelete = ref(false) // Track if user wants to delete foto_utama
const galleryFiles = ref([])
const galleryPreview = ref([])
const existingGalleryFiles = ref([]) // Track existing gallery filenames from DB

const errors = ref({})

const currentYear = new Date().getFullYear()

const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const fasilitasOptions = [
  'Masjid', 'Asrama', 'Lab Komputer', 'Perpustakaan',
  'Lapangan Olahraga', 'Kantin', 'Klinik', 'Ruang Kelas AC',
  'Tempat Parkir', 'WiFi'
]

const totalSantri = computed(() => {
  return pesantren.value.reduce((sum, p) => sum + (p.jumlah_santri || 0), 0)
})

const pendingCount = computed(() => {
  return pendaftar.value.filter(p => p.status === 'pending').length
})

const filteredPendaftar = computed(() => {
  if (filterStatus.value === 'semua') return pendaftar.value
  return pendaftar.value.filter(p => p.status === filterStatus.value)
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

function statusBadge(status) {
  const map = {
    pending: 'bg-[#fef9c3] text-[#854d0e]',
    diproses: 'bg-[#dbeafe] text-[#1e40af]',
    diterima: 'bg-[#dcfce7] text-[#166534]',
    ditolak: 'bg-[#fee2e2] text-[#991b1b]'
  }
  return map[status] || 'bg-[#f3f4f6] text-[#1f2937]'
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

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function fetchPendaftar() {
  pendaftarLoading.value = true
  try {
    const { data } = await pemilik.getPendaftaran()
    pendaftar.value = data.data || []
  } catch (e) {
    console.error('Failed to load pendaftar:', e)
    toast.error('Gagal memuat data pendaftar', { title: 'Error' })
  } finally {
    pendaftarLoading.value = false
  }
}

function openStatusModal(pendaftarItem, action) {
  statusTarget.value = pendaftarItem
  statusAction.value = action
  statusCatatan.value = ''
  showStatusModal.value = true
}

function closeStatusModal() {
  showStatusModal.value = false
  statusTarget.value = null
  statusAction.value = 'diterima'
  statusCatatan.value = ''
}

async function executeStatusUpdate() {
  if (!statusTarget.value) return
  
  processingId.value = statusTarget.value.id
  try {
    await pemilik.updatePendaftaranStatus(statusTarget.value.id, {
      status: statusAction.value,
      catatan_admin: statusCatatan.value || null
    })
    
    toast.success(
      `Pendaftar ${statusAction.value === 'diterima' ? 'diterima' : 'ditolak'}${statusCatatan.value ? ' dengan catatan' : ''}`,
      { title: statusAction.value === 'diterima' ? '✅ Pendaftar Diterima' : '❌ Pendaftar Ditolak' }
    )
    
    closeStatusModal()
    await fetchPendaftar()
    emit('refresh')
  } catch (e) {
    console.error('Failed to update status:', e)
    toast.error(e.response?.data?.error || 'Gagal memperbarui status pendaftar', { title: 'Gagal' })
  } finally {
    processingId.value = null
  }
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

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Gunakan file JPG, JPEG, PNG, atau WEBP', { title: 'Format Tidak Didukung' })
      e.target.value = ''
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      toast.error(`Ukuran file ${sizeMB}MB melebihi batas maksimal 1MB`, { title: 'Ukuran File Terlalu Besar' })
      e.target.value = ''
      return
    }
    fotoFile.value = file
    fotoPreview.value = URL.createObjectURL(file)
    fotoDelete.value = false
    toast.success(`File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, { title: 'Foto Dipilih' })
  }
}

function onGalleryChange(e) {
  const files = Array.from(e.target.files)
  const validFiles = []
  let rejectedCount = 0
  
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      rejectedCount++
      continue
    }
    if (file.size > MAX_FILE_SIZE) {
      rejectedCount++
      continue
    }
    validFiles.push(file)
  }

  if (rejectedCount > 0) {
    toast.warning(`${rejectedCount} file tidak valid (format/ukuran)`, { title: 'File Ditolak' })
  }

  if (validFiles.length + galleryFiles.value.length > 5) {
    toast.warning('Maksimal 5 foto galeri', { title: 'Melebihi Batas' })
    e.target.value = ''
    return
  }

  validFiles.forEach(file => {
    galleryFiles.value.push(file)
    galleryPreview.value.push(URL.createObjectURL(file))
  })

  if (validFiles.length > 0) {
    toast.success(`${validFiles.length} foto berhasil ditambahkan (total: ${galleryFiles.value.length}/5)`, { title: 'Galeri Ditambahkan' })
  }
}

function remove_gallery(idx) {
  const fileName = galleryFiles.value[idx]?.name || 'Foto'
  if (galleryPreview.value[idx] && galleryPreview.value[idx].startsWith('blob:')) {
    URL.revokeObjectURL(galleryPreview.value[idx])
  }
  galleryFiles.value.splice(idx, 1)
  galleryPreview.value.splice(idx, 1)
  toast.info(`${fileName} dihapus dari galeri (sisa: ${galleryFiles.value.length}/5)`, { title: 'Foto Dihapus' })
}

function removeFotoUtama() {
  if (fotoPreview.value && fotoPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(fotoPreview.value)
  }
  fotoFile.value = null
  fotoPreview.value = ''
  fotoDelete.value = true
  toast.info('Foto utama akan dihapus saat disimpan', { title: 'Foto Utama Dihapus' })
}

function openForm(p = null) {
  console.log('[PemilikDashboard.openForm] Received pesantren data:', JSON.stringify(p, null, 2));
  
  if (p) {
    editingId.value = p.id
    nama.value = p.nama
    province.value = p.province
    kota.value = p.kota
    alamat.value = p.alamat || ''
    kurikulum.value = p.kurikulum || ''
    tahun_berdiri.value = p.tahun_berdiri || null
    jumlah_santri.value = p.jumlah_santri || null
    jumlah_pengajar.value = p.jumlah_pengajar || null
    biaya_bulanan.value = p.biaya_bulanan || null
    biaya_pendaftaran.value = p.biaya_pendaftaran || null
    fasilitas.value = p.fasilitas || []
    deskripsi.value = p.deskripsi || ''
    telepon.value = p.telepon || ''
    email.value = p.email || ''
    website.value = p.website || ''
    nama_bank.value = p.rekening?.nama_bank || ''
    nomor_rekening.value = p.rekening?.nomor_rekening || ''
    atas_nama_rekening.value = p.rekening?.atas_nama || ''
    fotoPreview.value = p.foto_utama ? getUploadUrl(p.foto_utama) : ''
    fotoDelete.value = false
    galleryPreview.value = (p.foto_galeri || []).map(f => getUploadUrl(f))
    existingGalleryFiles.value = p.foto_galeri || []
    // Load cities without resetting kota
    loadCitiesForEdit()
  } else {
    resetForm()
  }
  showForm.value = true
}

async function loadCitiesForEdit() {
  if (!province.value) return
  const p = provinces.value.find(pr => pr.name === province.value)
  if (p) {
    try {
      const { data } = await wilayah.getRegencies(p.id)
      cities.value = (data.data || []).map(r => r.name)
    } catch (e) {
      console.error(e)
    }
  }
}

function closeForm() {
  // Revoke all object URLs to prevent memory leak
  if (fotoPreview.value && fotoPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(fotoPreview.value)
  }
  galleryPreview.value.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
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
  website.value = ''
  nama_bank.value = ''
  nomor_rekening.value = ''
  atas_nama_rekening.value = ''
  fotoFile.value = null
  fotoPreview.value = ''
  galleryFiles.value = []
  galleryPreview.value = []
  errors.value = {}
}

async function onSubmit() {
  errors.value = {}
  if (!nama.value) errors.value.nama = 'Nama wajib diisi'
  if (!province.value) errors.value.province = 'Provinsi wajib dipilih'
  if (!kota.value) errors.value.kota = 'Kota wajib dipilih'

  if (Object.keys(errors.value).length > 0) {
    toast.warning('Mohon lengkapi semua field yang wajib diisi', { title: 'Validasi Gagal' })
    return
  }

  submitting.value = true
  console.log('[PemilikDashboard] 🚀 Submitting form...', {
    editingId: editingId.value,
    nama: nama.value,
    province: province.value,
    kota: kota.value,
  })

  try {
    const formData = new FormData()
    formData.append('nama', nama.value)
    formData.append('province', province.value)
    formData.append('kota', kota.value)
    formData.append('alamat', alamat.value)
    formData.append('kurikulum', kurikulum.value)
    formData.append('tahun_berdiri', tahun_berdiri.value || '')
    formData.append('jumlah_santri', jumlah_santri.value || '')
    formData.append('jumlah_pengajar', jumlah_pengajar.value || '')
    formData.append('biaya_bulanan', biaya_bulanan.value || '')
    formData.append('biaya_pendaftaran', biaya_pendaftaran.value || '')
    formData.append('fasilitas', JSON.stringify(fasilitas.value))
    formData.append('deskripsi', deskripsi.value)
    formData.append('telepon', telepon.value)
    formData.append('email', email.value)
    formData.append('website', website.value)
    formData.append('nama_bank', nama_bank.value)
    formData.append('nomor_rekening', nomor_rekening.value)
    formData.append('atas_nama_rekening', atas_nama_rekening.value)

    if (fotoFile.value) {
      formData.append('foto_utama', fotoFile.value)
      console.log('[PemilikDashboard] 📸 Appending foto_utama:', {
        name: fotoFile.value.name,
        size: fotoFile.value.size,
        type: fotoFile.value.type
      })
    } else if (editingId.value && fotoDelete.value) {
      formData.append('foto_utama', 'null')
      console.log('[PemilikDashboard] 🗑️ Marking foto_utama for deletion')
    }

    if (galleryFiles.value.length > 0) {
      galleryFiles.value.forEach((file) => {
        formData.append('foto_galeri', file)
      })
      console.log('[PemilikDashboard] 🖼️ Appending galeri files:', galleryFiles.value.length)
    }

    // When editing, also send existing gallery filenames so backend can merge them
    if (editingId.value && existingGalleryFiles.value.length > 0) {
      formData.append('existing_foto_galeri', JSON.stringify(existingGalleryFiles.value))
      console.log('[PemilikDashboard] 📋 Sending existing gallery:', existingGalleryFiles.value)
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    } else if (editingId.value) {
      console.log('[PemilikDashboard] 📋 No existing gallery to send (length:', existingGalleryFiles.value.length, ')')
    }

    // Debug: log all FormData entries
    console.log('[PemilikDashboard] 📦 FormData contents:')
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }

    if (editingId.value) {
      await pemilik.updatePesantren(editingId.value, formData)
      console.log('[PemilikDashboard] ✅ Pesantren berhasil diupdate:', {
        id: editingId.value,
        nama: nama.value,
        province: province.value,
        kota: kota.value,
        foto_utama: fotoFile.value?.name || 'tidak ada perubahan',
        jumlah_foto_galeri: galleryFiles.value.length
      })
      
      // Success toast for update
      let updateMsg = 'Data pesantren berhasil diperbarui'
      if (fotoFile.value) {
        updateMsg += ` • Foto utama: ${fotoFile.value.name}`
      }
      if (galleryFiles.value.length > 0) {
        updateMsg += ` • ${galleryFiles.value.length} foto galeri diupload`
      }
      toast.success(updateMsg, { title: 'Pesantren Diperbarui' })
    } else {
      const result = await pemilik.createPesantren(formData)
      console.log('[PemilikDashboard] 🎉 Pesantren baru berhasil dibuat:', {
        id: result?.data?.id || 'unknown',
        nama: nama.value,
        province: province.value,
        kota: kota.value,
        kurikulum: kurikulum.value,
        foto_utama: fotoFile.value?.name || 'tidak ada',
        jumlah_foto_galeri: galleryFiles.value.length,
        timestamp: new Date().toISOString()
      })

      // Success toast for create
      let createMsg = `Pesantren "${nama.value}" berhasil ditambahkan`
      if (fotoFile.value) {
        createMsg += ` • Foto utama: ${fotoFile.value.name}`
      }
      if (galleryFiles.value.length > 0) {
        createMsg += ` • ${galleryFiles.value.length} foto galeri diupload`
      }
      toast.success(createMsg, { title: 'Pesantren Ditambahkan' })
    }

    closeForm()
    await fetchData()
    emit('refresh')
  } catch (e) {
    console.error('[PemilikDashboard] ❌ Error saat menyimpan pesantren:', {
      message: e.message,
      response: e.response?.data,
      status: e.response?.status
    })
    
    // Show specific error messages with toast
    if (e.response?.data?.error) {
      const errorMsg = e.response.data.error
      if (errorMsg.includes('terlalu besar')) {
        toast.error('Ukuran file terlalu besar. Maksimal 1MB per foto.', { title: 'Upload Gagal' })
      } else if (errorMsg.includes('format') || errorMsg.includes('tidak didukung')) {
        toast.error('Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP.', { title: 'Upload Gagal' })
      } else if (errorMsg.includes('galeri maksimal')) {
        toast.error('Foto gallery maksimal 5 file.', { title: 'Upload Gagal' })
      } else {
        toast.error(errorMsg, { title: 'Gagal Menyimpan' })
      }
    } else if (e.response?.data?.errors) {
      errors.value = e.response.data.errors
      toast.warning('Mohon periksa kembali input Anda', { title: 'Validasi Gagal' })
    } else {
      toast.error('Terjadi kesalahan pada server. Silakan coba lagi.', { title: 'Server Error' })
    }
  } finally {
    submitting.value = false
  }
}

// Delete functions
function confirmDelete(p) {
  deleteTarget.value = p
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deleteTarget.value = null
  deletingId.value = null
}

async function executeDelete() {
  if (!deleteTarget.value) return
  
  deletingId.value = deleteTarget.value.id
  try {
    await pemilik.deletePesantren(deleteTarget.value.id)
    toast.success(`Pesantren "${deleteTarget.value.nama}" berhasil dihapus`, { title: 'Pesantren Dihapus' })
    closeDeleteModal()
    await fetchData()
    emit('refresh')
  } catch (e) {
    console.error('[PemilikDashboard] ❌ Error saat menghapus pesantren:', {
      message: e.message,
      response: e.response?.data,
      status: e.response?.status
    })
    
    if (e.response?.data?.error) {
      toast.error(e.response.data.error, { title: 'Gagal Menghapus' })
    } else {
      toast.error('Terjadi kesalahan saat menghapus pesantren', { title: 'Server Error' })
    }
  } finally {
    deletingId.value = null
  }
}

async function fetchData() {
  loading.value = true
  try {
    const { data } = await pemilik.getPesantren()
    pesantren.value = data.data || []
  } catch (e) {
    console.error(e)
    toast.error('Terjadi kesalahan saat mengambil data pesantren', { title: 'Gagal Memuat Data' })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchProvinces()
  await fetchData()
  await fetchPendaftar()
})
</script>

<style scoped>
/* All styles using Tailwind CSS */
</style>
