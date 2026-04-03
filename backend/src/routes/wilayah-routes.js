const WilayahController = require('../controllers/wilayah-controller')

const wilayahRoutes = async (fastify) => {
  fastify.get('/api/wilayah/provinces', async (request, reply) => {
    return WilayahController.getProvinces(request, reply)
  })

  fastify.get('/api/wilayah/regencies/:provinceId', async (request, reply) => {
    return WilayahController.getRegencies(request, reply)
  })

  fastify.get('/api/wilayah/province/:id', async (request, reply) => {
    return WilayahController.getProvinceDetail(request, reply)
  })

  fastify.get('/api/wilayah/regency/:provinceId/:regencyId', async (request, reply) => {
    return WilayahController.getRegencyDetail(request, reply)
  })
}

module.exports = wilayahRoutes
