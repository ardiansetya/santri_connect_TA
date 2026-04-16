const Pesantren = require('../models/Pesantren')

const RekomendasiService = {
  async getRekomendasi({ budget, provinsi, fasilitas }) {
    const [pesantren] = await require('../config/db').getPool().query(
      'SELECT id, nama, province, kota, biaya_bulanan, fasilitas, kurikulum, foto_utama FROM pesantren'
    )

    const WEIGHTS = { budget: 0.4, lokasi: 0.3, fasilitas: 0.3 }

    const scored = pesantren.map(p => {
      // 1. Budget Score (40%)
      const biaya = parseFloat(p.biaya_bulanan) || 0
      const budget_score = biaya <= budget ? 1 : Math.max(0, 1 - ((biaya - budget) / budget))
      
      // 2. Location Score (30%)
      // If user selected empty provinsi, location score is 1 (neutral)
      const location_score = !provinsi || p.province === provinsi ? 1 : 0

      // 3. Facilities Score (30%)
      let pFasilitas = p.fasilitas
      if (typeof pFasilitas === 'string') { try { pFasilitas = JSON.parse(pFasilitas) } catch { pFasilitas = [] } }

      const matchedFasilitas = Array.isArray(fasilitas) && fasilitas.length > 0 
        ? fasilitas.filter(f => pFasilitas.includes(f))
        : []
      
      const fasilitas_score = fasilitas.length > 0 ? (matchedFasilitas.length / fasilitas.length) : 0
      
      // Combined Score
      const total_score = (budget_score * WEIGHTS.budget) + (location_score * WEIGHTS.lokasi) + (fasilitas_score * WEIGHTS.fasilitas)

      return {
        score: total_score,
        budget_score,
        location_score,
        fasilitas_score,
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
