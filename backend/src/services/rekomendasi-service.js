async function getRekomendasi(fastify, preferences) {
  const connection = fastify.mysql
  const { budget, provinsi, fasilitas } = preferences

  const [pesantren] = await connection.query(
    'SELECT id, nama, province, biaya_bulanan, fasilitas FROM santo_connect.pesantren'
  )

  const WEIGHTS = { budget: 0.4, lokasi: 0.3, fasilitas: 0.3 }

  const scored = pesantren.map(p => {
    let biaya = parseFloat(p.biaya_bulanan)
    if (biaya === 0) biaya = 1

    const skorBudget = biaya <= budget ? 1 : budget / biaya
    const skorLokasi = p.province === provinsi ? 1 : 0

    let pFasilitas = p.fasilitas
    if (typeof pFasilitas === 'string') {
      try { pFasilitas = JSON.parse(pFasilitas) } catch { pFasilitas = [] }
    }

    const matchCount = fasilitas.filter(f => pFasilitas.includes(f)).length
    const skorFasilitas = fasilitas.length > 0 ? matchCount / fasilitas.length : 0

    const skorAkhir = (skorBudget * WEIGHTS.budget) + (skorLokasi * WEIGHTS.lokasi) + (skorFasilitas * WEIGHTS.fasilitas)

    return {
      id: p.id,
      nama: p.nama,
      province: p.province,
      biaya_bulanan: p.biaya_bulanan,
      skor: Math.round(skorAkhir * 100) / 100
    }
  })

  scored.sort((a, b) => b.skor - a.skor)

  return scored.slice(0, 10)
}

module.exports = { getRekomendasi }
