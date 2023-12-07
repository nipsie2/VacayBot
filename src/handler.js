const { nanoid } = require('nanoid')
const { gcloud } = require('@google-cloud/storage')
const { Knex } = require('knex')

// createTcpPool initializes a TCP connection pool for a Cloud SQL
// instance of Postgres.
const createTcpPool = async config => {
  // Note: Saving credentials in environment variables is convenient, but not
  // secure - consider a more secure solution such as
  // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
  // keep secrets safe.
  const dbConfig = {
    client: 'pg',
    connection: {
      host: process.env.INSTANCE_HOST, // e.g. '127.0.0.1'
      port: process.env.DB_PORT, // e.g. '5432'
      user: process.env.DB_USER, // e.g. 'my-user'
      password: process.env.DB_PASS, // e.g. 'my-user-password'
      database: process.env.DB_NAME // e.g. 'my-database'
    },
    // ... Specify additional properties here.
    ...config
  }
  // Establish a connection to the database.
  return Knex(dbConfig)
}

const registerHandler = (request, h) => {
  const { name, email, password } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Registrasi gagal. Mohon isi nama anda'
    })

    response.code(400)
    return response
  } else if (!email) {
    const response = h.response({
      status: 'fail',
      message: 'Registrasi gagal. Mohon isi email anda'
    })

    response.code(400)
    return response
  } else if (!password) {
    const response = h.response({
      status: 'fail',
      message: 'Registrasi gagal. Mohon isi password anda'
    })

    response.code(400)
    return response
  }

  const id = nanoid(16)
  try {
    createTcpPool().Knex('user').insert({ id: id, email: email, name: name, password: password })
  } catch (e) {
    console.log(e.message)
  }

  const response = h.response({
    status: 'success',
    message: 'Registrasi berhasil ditambahkan'
  })

  response.code(201)
  return response
}

const editUserHandler = (request, h) => {
  const { id } = request.params
  const { password } = request.payload

  if (!password) {
    const response = h.response({
      status: 'fail',
      message: 'Edit password gagal. Mohon isi password baru anda'
    })

    response.code(400)
    return response
  }
  try {
    createTcpPool().Knex('user').where({ id: id })
      .update({
        password: password
      })
  } catch (e) {
    console.log(e.message)
  }

  const response = h.response({
    status: 'success',
    message: 'Edit password berhasil'
  })

  response.code(200)
  return response
}

module.exports = { registerHandler, editUserHandler }
