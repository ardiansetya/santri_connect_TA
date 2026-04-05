<template>
  <div>
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="card shadow-sm border-start border-primary border-3">
          <div class="card-body">
            <p class="text-muted small mb-1">Total Pesantren</p>
            <h3 class="fw-bold mb-0">{{ stats.total_pesantren || 0 }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card shadow-sm border-start border-success border-3">
          <div class="card-body">
            <p class="text-muted small mb-1">Total Pendaftaran</p>
            <h3 class="fw-bold mb-0">{{ stats.total_pendaftaran || 0 }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card shadow-sm border-start border-warning border-3">
          <div class="card-body">
            <p class="text-muted small mb-1">Pending</p>
            <h3 class="fw-bold mb-0">{{ pendingCount }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card shadow-sm border-start border-info border-3">
          <div class="card-body">
            <p class="text-muted small mb-1">Diproses</p>
            <h3 class="fw-bold mb-0">{{ diprosesCount }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-white py-3">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === 'pendaftaran' }" @click="activeTab = 'pendaftaran'">
              Manajemen Pendaftaran
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === 'pesantren' }" @click="activeTab = 'pesantren'">
              Manajemen Pesantren
            </button>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div v-if="activeTab === 'pendaftaran'">
          <div class="d-flex justify-content-end mb-3">
            <button class="btn btn-outline-success btn-sm" @click="exportData" :disabled="exporting">
              <span v-if="exporting" class="spinner-border spinner-border-sm me-2"></span>
              📥 Export Excel
            </button>
          </div>
          <div v-if="loadingPendaftaran" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted small">Memuat data...</p>
          </div>
          <div v-else-if="pendaftaran.length === 0" class="text-center py-5">
            <p class="fs-3 mb-3">📭</p>
            <h6 class="fw-semibold">Belum ada pendaftaran</h6>
            <p class="text-muted small">Data pendaftaran akan muncul saat ada yang mendaftar</p>
          </div>
          <div v-else class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>No. Pendaftaran</th>
                  <th>Nama</th>
                  <th>Pesantren</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in pendaftaran" :key="p.id">
                  <td><code>{{ p.nomor_pendaftaran }}</code></td>
                  <td>{{ p.nama_lengkap }}</td>
                  <td>{{ p.pesantren?.nama || '-' }}</td>
                  <td>
                    <select
                      class="form-select form-select-sm"
                      :value="p.status"
                      @change="updateStatus(p.id, $event.target.value)"
                      style="width: auto; display: inline-block;"
                    >
                      <option value="pending">Pending</option>
                      <option value="diproses">Diproses</option>
                      <option value="diterima">Diterima</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                  </td>
                  <td>{{ formatDate(p.created_at) }}</td>
                  <td>
                    <button class="btn btn-outline-primary btn-sm" @click="viewDetail(p)">Detail</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab === 'pesantren'">
          <AdminPesantrenManagement @refresh="loadData" />
        </div>
      </div>
    </div>

    <div v-if="selectedItem" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold">Detail Pendaftaran</h5>
            <button type="button" class="btn-close" @click="selectedItem = null"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12">
                <span class="badge bg-primary fs-6">{{ selectedItem.nomor_pendaftaran }}</span>
                <span class="badge ms-2" :class="statusBadge(selectedItem.status)">{{ statusLabel(selectedItem.status) }}</span>
              </div>
              <div class="col-sm-6">
                <div class="p-3 bg-light rounded">
                  <small class="text-muted d-block">Nama Lengkap</small>
                  <strong>{{ selectedItem.nama_lengkap }}</strong>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="p-3 bg-light rounded">
                  <small class="text-muted d-block">NIK</small>
                  <strong>{{ selectedItem.nik || '-' }}</strong>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="p-3 bg-light rounded">
                  <small class="text-muted d-block">Pesantren</small>
                  <strong>{{ selectedItem.pesantren?.nama || '-' }}</strong>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="p-3 bg-light rounded">
                  <small class="text-muted d-block">Jenis Kelamin</small>
                  <strong>{{ selectedItem.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</strong>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="p-3 bg-light rounded">
                  <small class="text-muted d-block">No. HP</small>
                  <strong>{{ selectedItem.no_hp || '-' }}</strong>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="p-3 bg-light rounded">
                  <small class="text-muted d-block">Orang Tua</small>
                  <strong>{{ selectedItem.nama_ayah || '-' }} & {{ selectedItem.nama_ibu || '-' }}</strong>
                </div>
              </div>
              <div v-if="selectedItem.catatan_admin" class="col-12">
                <div class="alert alert-info mb-0">
                  <strong>Catatan Admin:</strong> {{ selectedItem.catatan_admin }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="selectedItem = null">Tutup</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedItem" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { admin } from '../../services'
import AdminPesantrenManagement from './AdminPesantrenManagement.vue'

const activeTab = ref('pendaftaran')
const stats = ref({})
const pendaftaran = ref([])
const loadingPendaftaran = ref(true)
const selectedItem = ref(null)
const exporting = ref(false)

const pendingCount = computed(() => pendaftaran.value.filter(p => p.status === 'pending').length)
const diprosesCount = computed(() => pendaftaran.value.filter(p => p.status === 'diproses').length)

function statusBadge(status) {
  const map = {
    pending: 'bg-warning text-dark',
    diproses: 'bg-info',
    diterima: 'bg-success',
    ditolak: 'bg-danger'
  }
  return map[status] || 'bg-secondary'
}

function statusLabel(status) {
  const map = {
    pending: 'Pending',
    diproses: 'Diproses',
    diterima: 'Diterima',
    ditolak: 'Ditolak'
  }
  return map[status] || status
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function viewDetail(p) {
  selectedItem.value = p
}

async function updateStatus(id, status) {
  try {
    await admin.updatePendaftaranStatus(id, { status })
    await loadData()
  } catch (err) {
    alert(err.response?.data?.error || 'Gagal update status')
    await loadData()
  }
}

async function exportData() {
  exporting.value = true
  try {
    const response = await admin.exportPendaftaran()
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `pendaftaran_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch {
    alert('Gagal export data')
  } finally {
    exporting.value = false
  }
}

async function loadData() {
  loadingPendaftaran.value = true
  try {
    const [statsRes, pendaftaranRes] = await Promise.all([
      admin.getStats(),
      admin.getPendaftaran()
    ])
    stats.value = statsRes.data.data || {}
    pendaftaran.value = pendaftaranRes.data.data || []
  } catch {
    stats.value = {}
    pendaftaran.value = []
  } finally {
    loadingPendaftaran.value = false
  }
}

onMounted(async () => {
  await loadData()
})
</script>

<style scoped>
.nav-link {
  color: var(--bs-body-color);
  cursor: pointer;
}
.nav-link.active {
  color: var(--bs-primary);
  border-color: var(--bs-primary);
  background-color: transparent;
}
</style>
