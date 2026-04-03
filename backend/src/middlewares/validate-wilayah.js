const WilayahService = require('../services/wilayah-service')

async function validateWilayah(request, reply) {
  const { province, provinsi, kota } = request.body

  if (!province && !provinsi) {
    return reply.code(400).send({ error: 'Provinsi wajib diisi' })
  }

  const provinceResult = await WilayahService.validateProvince(province || provinsi)
  if (!provinceResult.valid) {
    return reply.code(400).send({ error: provinceResult.message })
  }

  if (kota) {
    const regencyResult = await WilayahService.validateRegency(provinceResult.id, kota)
    if (!regencyResult.valid) {
      return reply.code(400).send({ error: regencyResult.message })
    }

    request.body.province = provinceResult.name
    request.body.kota = regencyResult.name
  } else {
    request.body.province = provinceResult.name
  }
}

module.exports = validateWilayah
