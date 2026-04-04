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
  }
}

export const wilayah = {
  getProvinces() {
    return api.get('/wilayah/provinces')
  },
  getRegencies(provinceId) {
    return api.get(`/wilayah/regencies/${provinceId}`)
  }
}

export const publicApi = {
  getStats() {
    return api.get('/public/stats')
  }
}
