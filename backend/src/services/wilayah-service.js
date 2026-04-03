const fetch = require('node-fetch')

const BASE_URL = 'https://emsifa.github.io/api-wilayah-indonesia/api'

let _provincesCache = null
let _regenciesCache = {}

async function fetchFromApi(path) {
  const res = await fetch(`${BASE_URL}${path}`, { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function getProvinces() {
  if (!_provincesCache) {
    _provincesCache = await fetchFromApi('/provinces.json')
  }
  return _provincesCache
}

async function getRegencies(provinceId) {
  if (!_regenciesCache[provinceId]) {
    _regenciesCache[provinceId] = await fetchFromApi(`/regencies/${provinceId}.json`)
  }
  return _regenciesCache[provinceId]
}

const WilayahService = {
  async getProvinces() {
    return getProvinces()
  },

  async getRegencies(provinceId) {
    return getRegencies(provinceId)
  },

  async getProvinceById(id) {
    const provinces = await getProvinces()
    return provinces.find(p => p.id === String(id)) || null
  },

  async getProvinceByName(name) {
    const provinces = await getProvinces()
    return provinces.find(p => p.name.toUpperCase() === String(name).toUpperCase()) || null
  },

  async getRegencyById(provinceId, regencyId) {
    const regencies = await getRegencies(provinceId)
    return regencies.find(r => r.id === String(regencyId)) || null
  },

  async validateProvince(province) {
    if (!province) return { valid: false, message: 'Provinsi wajib diisi' }
    const provinces = await getProvinces()
    const found = provinces.find(p =>
      p.id === String(province) || p.name.toUpperCase() === String(province).toUpperCase()
    )
    if (!found) return { valid: false, message: 'Provinsi tidak valid' }
    return { valid: true, id: found.id, name: found.name }
  },

  async validateRegency(provinceId, regency) {
    if (!regency) return { valid: false, message: 'Kota wajib diisi' }
    const regencies = await getRegencies(provinceId)
    const found = regencies.find(r =>
      r.id === String(regency) || r.name.toUpperCase() === String(regency).toUpperCase()
    )
    if (!found) return { valid: false, message: 'Kota tidak valid' }
    return { valid: true, id: found.id, name: found.name }
  },

  async validateWilayah(province, regency) {
    const provinceResult = await this.validateProvince(province)
    if (!provinceResult.valid) return provinceResult

    const regencyResult = await this.validateRegency(provinceResult.id, regency)
    return regencyResult
  }
}

module.exports = WilayahService
