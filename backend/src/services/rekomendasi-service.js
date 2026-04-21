const Pesantren = require('../models/Pesantren')

const RekomendasiService = {
  async getRekomendasi({ budget, provinsi, kota, fasilitas, bobot }) {
    const [pesantren] = await require('../config/db').getPool().query(
      'SELECT id, nama, province, kota, biaya_bulanan, fasilitas, kurikulum, foto_utama FROM pesantren'
    )

    // Normalize weights
    const defaultBobot = { budget: 40, lokasi: 30, fasilitas: 30 }
    const actualBobot = bobot || defaultBobot
    const totalBobot = (actualBobot.budget || 0) + (actualBobot.lokasi || 0) + (actualBobot.fasilitas || 0) || 100
    
    const WEIGHTS = { 
      budget: (actualBobot.budget || 0) / totalBobot, 
      lokasi: (actualBobot.lokasi || 0) / totalBobot, 
      fasilitas: (actualBobot.fasilitas || 0) / totalBobot 
    }

    const scored = pesantren.map(p => {
      // 1. Budget Score
      const biaya = parseFloat(p.biaya_bulanan) || 0
      const budget_score = biaya <= budget ? 1 : Math.max(0, 1 - ((biaya - budget) / budget))
      
      // 2. Location Score
      let location_score = 0;
      if (!provinsi && !kota) {
        location_score = 1;
      } else if (provinsi && kota) {
        location_score = (p.province === provinsi && p.kota === kota) ? 1 : 0;
      } else if (provinsi) {
        location_score = (p.province === provinsi) ? 1 : 0;
      } else if (kota) {
        location_score = (p.kota === kota) ? 1 : 0;
      }

      // 3. Facilities Score
      let pFasilitas = p.fasilitas
      if (typeof pFasilitas === 'string') { try { pFasilitas = JSON.parse(pFasilitas) } catch { pFasilitas = [] } }

      const matchedFasilitas = Array.isArray(fasilitas) && fasilitas.length > 0 
        ? fasilitas.filter(f => pFasilitas.includes(f))
        : []
      
      // BUG FIX: Jika tidak ada fasilitas yang direquest, anggap 100% cocok (1)
      const fasilitas_score = fasilitas.length > 0 ? (matchedFasilitas.length / fasilitas.length) : 1
      
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
