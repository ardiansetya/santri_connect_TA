const fetch = require('node-fetch')

const BASE_URL = 'https://emsifa.github.io/api-wilayah-indonesia/api'

async function fetchFromApi(path) {
  const res = await fetch(`${BASE_URL}${path}`, { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

const WilayahService = {
  async getProvinces() {
    return fetchFromApi('/provinces.json')
  },

  async getRegencies(provinceId) {
    return fetchFromApi(`/regencies/${provinceId}.json`)
  }
}

module.exports = WilayahService
