async function getPesantrenDetail(fastify, id) {
  const connection = fastify.mysql

  const parsedId = parseInt(id, 10)

  const [pesantren] = await connection.query(
    'SELECT id, user_id, nama, province, kota, alamat, tahun_berdiri, jumlah_santri, jumlah_pengajar, biaya_pendaftaran, biaya_bulanan, fasilitas, kurikulum, email, telepon, website, deskripsi, nama_bank, nomor_rekening, atas_nama_rekening FROM santo_connect.pesantren WHERE id = ?',
    [parsedId]
  )

  if (pesantren.length === 0) {
    throw new Error('Pesantren tidak ditemukan')
  }

  const data = pesantren[0]
  
  let fasilitas = data.fasilitas
  if (typeof fasilitas === 'string') {
    try {
      fasilitas = JSON.parse(fasilitas)
    } catch {
      fasilitas = []
    }
  }

  return {
    id: data.id,
    user_id: data.user_id,
    nama: data.nama,
    province: data.province,
    kota: data.kota,
    alamat: data.alamat,
    tahun_berdiri: data.tahun_berdiri,
    jumlah_santri: data.jumlah_santri,
    jumlah_pengajar: data.jumlah_pengajar,
    biaya_pendaftaran: data.biaya_pendaftaran,
    biaya_bulanan: data.biaya_bulanan,
    fasilitas,
    kurikulum: data.kurikulum,
    email: data.email,
    telepon: data.telepon,
    website: data.website,
    deskripsi: data.deskripsi,
    rekening: {
      nama_bank: data.nama_bank,
      nomor_rekening: data.nomor_rekening,
      atas_nama_rekening: data.atas_nama_rekening
    }
  }
}

module.exports = { getPesantrenDetail }
