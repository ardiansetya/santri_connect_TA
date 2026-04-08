const WilayahService = require('../services/wilayah-service')
const { normalizeWilayahData } = require('./normalize-wilayah')

async function validateWilayah(request, reply) {
  // For multipart/form-data, request.body is undefined, so we parse parts first
  if (!request.body) {
    const body = {}
    try {
      for await (const part of request.parts()) {
        if (!part.file) {
          body[part.fieldname] = part.value
        }
      }
      request.body = body
    } catch {
      return reply.code(400).send({ error: 'Input tidak valid' })
    }
  }

  // Normalize input to handle both 'province' and 'provinsi'
  const normalizedData = normalizeWilayahData(request.body)
  request.body = normalizedData
  
  const { province, kota } = request.body

  if (!province) {
    return reply.code(400).send({ error: 'Provinsi wajib diisi' })
  }

  const provinceResult = await WilayahService.validateProvince(province)
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

  return true
}

module.exports = validateWilayah
