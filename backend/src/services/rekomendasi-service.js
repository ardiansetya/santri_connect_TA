const Pesantren = require('../models/Pesantren')

const RekomendasiService = {
  async getRekomendasi({ budget, provinsi, kota, kurikulum, fasilitas, bobot }) {
    const [pesantren] = await require('../config/db').getPool().query(
      'SELECT id, nama, province, kota, biaya_bulanan, fasilitas, kurikulum, foto_utama FROM pesantren'
    )

    // Normalize weights (4 criteria)
    const defaultBobot = { budget: 40, lokasi: 30, fasilitas: 20, kurikulum: 10 }
    const actualBobot = bobot || defaultBobot
    const totalBobot = (actualBobot.budget || 0) + (actualBobot.lokasi || 0) + (actualBobot.fasilitas || 0) + (actualBobot.kurikulum || 0) || 100
    
    const WEIGHTS = { 
      budget: (actualBobot.budget || 0) / totalBobot, 
      lokasi: (actualBobot.lokasi || 0) / totalBobot, 
      fasilitas: (actualBobot.fasilitas || 0) / totalBobot,
      kurikulum: (actualBobot.kurikulum || 0) / totalBobot
    }

    const scored = pesantren.map(p => {
      // 1. Budget Score
      const biaya = parseFloat(p.biaya_bulanan) || 0
      const budget_score = biaya <= budget ? 1 : Math.max(0, 1 - ((biaya - budget) / budget))
      
      // 2. Location Score
      let location_score = 0;
      const pProvince = (p.province || '').toUpperCase().trim()
      const pKota = (p.kota || '').toUpperCase().trim()
      const inputProvinsi = (provinsi || '').toUpperCase().trim()
      const inputKota = (kota || '').toUpperCase().trim()

      if (!inputProvinsi && !inputKota) {
        location_score = 1;
      } else if (inputProvinsi && inputKota) {
        location_score = (pProvince === inputProvinsi && pKota === inputKota) ? 1 : 0;
      } else if (inputProvinsi) {
        location_score = (pProvince === inputProvinsi) ? 1 : 0;
      } else if (inputKota) {
        location_score = (pKota === inputKota) ? 1 : 0;
      }

      // 3. Facilities Score
      let pFasilitas = p.fasilitas
      if (typeof pFasilitas === 'string') { try { pFasilitas = JSON.parse(pFasilitas) } catch { pFasilitas = [] } }

      const matchedFasilitas = Array.isArray(fasilitas) && fasilitas.length > 0 
        ? fasilitas.filter(f => pFasilitas.includes(f))
        : []
      
      const fasilitas_score = fasilitas.length > 0 ? (matchedFasilitas.length / fasilitas.length) : 1

      // 4. Kurikulum Score
      let kurikulum_score = 1 // Default: no preference = full score
      if (kurikulum && kurikulum.trim() !== '') {
        kurikulum_score = (p.kurikulum || '').toLowerCase() === kurikulum.toLowerCase() ? 1 : 0
      }
      
      // Combined Score
      const total_score = (budget_score * WEIGHTS.budget) + (location_score * WEIGHTS.lokasi) + (fasilitas_score * WEIGHTS.fasilitas) + (kurikulum_score * WEIGHTS.kurikulum)

      return {
        score: total_score,
        budget_score,
        location_score,
        fasilitas_score,
        kurikulum_score,
        fasilitas_match: matchedFasilitas,
        pesantren: {
          id: p.id,
          nama: p.nama,
          province: p.province,
          kota: p.kota,
          biaya_bulanan: p.biaya_bulanan,
          kurikulum: p.kurikulum,
          foto_utama: p.foto_utama
        }
      }
    })

    // Sort by score descending and return top 10
    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, 10)
  }
}

module.exports = RekomendasiService
