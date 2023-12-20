'use strict'

const Hapi = require('@hapi/hapi')
const routes = require('./routes')
const { validateUser } = require('./handlers')

const init = async () => {
  const PORT = process.env.PORT || 80
  const server = Hapi.server({
    port: PORT,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })
  await server.register(require('@hapi/basic'))
  server.auth.strategy('login', 'basic', { validate: validateUser })
  server.auth.default('login')

  server.route(routes)
  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
