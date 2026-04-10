import api from './api'

export const auth = {
  register(data) {
    return api.post('/register', data)
  },
  login(email, password) {
    return api.post('/login', { email, password })
  },
  getMe() {
    return api.get('/me')
  },
  updateMe(data) {
    return api.put('/me', data)
  },
  logout() {
    return api.post('/logout')
  }
}

export const pesantren = {
  list(params) {
    return api.get('/pesantren', { params })
  },
  getById(id) {
    return api.get(`/pesantren/${id}`)
  },
  getPendaftaranInfo(id) {
    return api.get(`/pesantren/${id}/pendaftaran-info`)
  },
  compare(ids) {
    return api.post('/compare', { pesantren_ids: ids })
  },
  getRekomendasi(data) {
    return api.post('/rekomendasi', data)
  }
}

export const pendaftaran = {
  getStatus(nomor) {
    return api.get(`/pendaftaran/status/${nomor}`)
  },
  create(formData, config = {}) {
    return api.post('/pendaftaran', formData, config)
  },
  getMyRegistrations() {
    return api.get('/pendaftaran/saya')
  },
  getPesantrenInfo(pesantrenId) {
    return api.get(`/pesantren/${pesantrenId}/pendaftaran-info`)
  }
}

export const admin = {
  getStats() {
    return api.get('/admin/stats')
  },
  getUsers(params) {
    return api.get('/admin/users', { params })
  },
  createPesantren(data) {
    return api.post('/admin/pesantren', data)
  },
  updatePesantren(id, data) {
    return api.put(`/admin/pesantren/${id}`, data)
  },
  deletePesantren(id) {
    return api.delete(`/admin/pesantren/${id}`)
  },
  getPendaftaran(params) {
    return api.get('/admin/pendaftaran', { params })
  },
  getPendaftaranDetail(id) {
    return api.get(`/admin/pendaftaran/${id}`)
  },
  updatePendaftaranStatus(id, data) {
    return api.put(`/admin/pendaftaran/${id}/status`, data)
  },
  exportPendaftaran() {
    return api.get('/admin/pendaftaran/export', { responseType: 'blob' })
  }
}

export const pemilik = {
  getPesantren(params) {
    return api.get('/pemilik/pesantren', { params })
  },
  createPesantren(data) {
    return api.post('/pemilik/pesantren', data)
  },
  updatePesantren(id, data) {
    return api.put(`/pemilik/pesantren/${id}`, data)
  },
  deletePesantren(id) {
    return api.delete(`/pemilik/pesantren/${id}`)
  },
  getPendaftaran() {
    return api.get('/pemilik/pendaftaran')
  },
  updatePendaftaranStatus(id, data) {
    return api.put(`/pemilik/pendaftaran/${id}/status`, data)
  }
}

export const wilayah = {
  getProvinces() {
    return api.get('/wilayah/provinces')
  },
  getRegencies(provinceId) {
    return api.get(`/wilayah/regencies/${provinceId}`)
  },
  getProvinceDetail(id) {
    return api.get(`/wilayah/province/${id}`)
  },
  getRegencyDetail(provinceId, regencyId) {
    return api.get(`/wilayah/regency/${provinceId}/${regencyId}`)
  }
}

export const publicApi = {
  getStats() {
    return api.get('/public/stats')
  },
  getPesantren(params) {
    return api.get('/pesantren', { params })
  }
}
