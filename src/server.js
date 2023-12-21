'use strict'

const Hapi = require('@hapi/hapi')
const routes = require('./routes')

const init = async () => {
  const PORT = process.env.PORT || 3000
  const servers = Hapi.server({
    port: PORT,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']

      }
    }
  })

  servers.route(routes)
  await servers.start()
  console.log(`Server berjalan pada ${servers.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()

module.exports = { init }
