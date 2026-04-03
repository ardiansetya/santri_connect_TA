const WilayahController = require('../controllers/wilayah-controller')

const wilayahRoutes = async (fastify) => {
  fastify.get('/api/wilayah/provinces', async (request, reply) => {
    return WilayahController.getProvinces(request, reply)
  })

  fastify.get('/api/wilayah/regencies/:provinceId', async (request, reply) => {
    return WilayahController.getRegencies(request, reply)
  })
}

module.exports = wilayahRoutes
