const { nanoid } = require('nanoid')
const { gcloud } = require('@google-cloud/storage')
const { Knex } = require('knex')

const storage = new gcloud() // Create a new Storage instance
const bucketName = 'vacaybot-bucket-testing'

// createUnixSocketPool initializes a Unix socket connection pool for
// a Cloud SQL instance of Postgres.
const createUnixSocketPool = async config => {
  // Note: Saving credentials in environment variables is convenient, but not
  // secure - consider a more secure solution such as
  // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
  // keep secrets safe.
  return Knex({
    client: 'pg',
    connection: {
      user: process.env.DB_USER, // e.g. 'my-user'
      password: process.env.DB_PASS, // e.g. 'my-user-password'
      database: process.env.DB_NAME, // e.g. 'my-database'
      host: process.env.INSTANCE_UNIX_SOCKET, // e.g. '/cloudsql/project:region:instance'
    },
    // ... Specify additional properties here.
    ...config,
  });
};

// createTcpPool initializes a TCP conneconst storage = new Storage();ction pool for a Cloud SQL
// instance of Postgres.
// const createTcpPool = async config => {
//   // Note: Saving credentials in environment variables is convenient, but not
//   // secure - consider a more secure solution such as
//   // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
//   // keep secrets safe.
//   const dbConfig = {
//     client: 'pg',
//     connection: {
//       host: process.env.INSTANCE_HOST, // e.g. '127.0.0.1'
//       port: process.env.DB_PORT, // e.g. '5432'
//       user: process.env.DB_USER, // e.g. 'my-user'
//       password: process.env.DB_PASS, // e.g. 'my-user-password'
//       database: process.env.DB_NAME // e.g. 'my-database'
//     },
//     // ... Specify additional properties here.
//     ...config
//   }
//   // Establish a connection to the database.
//   return Knex(dbConfig)
// }
const validateUser = async (request, username, password, h) => {
  const knex = await createTcpPool()

  try {
    const user = await knex('user').where({ email: username }).first()

    if (!user) {
      return { isValid: false, credentials: null, message: 'Email tidak terdaftar ' }
    }

    if (password !== user.password) {
      return { isValid: false, credentials: null, message: 'Password salah' }
    }
    return { isValid: true, credentials: { username } }
  } catch (error) {
    console.error('Error validating user:', error)
    return { isValid: false, credentials: null }
  }
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
  await 
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
const deleteProfilePhoto = async (bucketName, fileName) => {
  await storage.bucket(bucketName).file(fileName).delete()
}

const deleteUserData = async (id) => {
  const knex = await createTcpPool()

  try {
    await knex('user').where({ id: id }).del()
  } catch (e) {
    console.error(e.message)
  }
}

const deleteUserHandler = async (request, h) => {
  try {
    const { id } = request.params
    const { fileName } = request.payload

    // Hapus foto profil dari Cloud Storage
    await deleteProfilePhoto(bucketName, fileName)

    // Hapus data pengguna dari Cloud SQL
    await deleteUserData(id)

    const response = h.response({
      status: 'success',
      message: 'Data user dan profile photo berhasil dihapus'
    })

    response.code(200)
    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan saat menghapus data user dan profile photo'
    })

    return response.code(400)
  }
}
const editPictureHandler = async (request, h) => {
  let success = false

  try {
    const { id } = request.params
    const { image } = request.payload.image

    // Update photo profile di Cloud Storage
    const newFileName = `picture/${id}-${nanoid(8)}.jpg`
    await storage.bucket(bucketName).file(newFileName).save(image)

    // Update link photo profil di Cloud SQL
    const knex = await createTcpPool()
    await knex('user').where({ id: id }).update({ picture: newFileName })
    success = true
  } catch (error) {
    console.error('Error updating photo profile:', error)
  }

  if (success) {
    const response = h.response({
      status: 'success',
      message: 'Photo profile berhasil diubah'
    })

    response.code(200)
    return response
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Internal Server Error'
    })
    response.code(500)
    return response
  }
}

const deletePictureHandler = async (request, h) => {
  let success = false

  try {
    const { id } = request.params
    const { fileName } = request.payload

    // Hapus foto profil dari Cloud Storage
    await deleteProfilePhoto(bucketName, fileName)

    const knex = await createTcpPool()
    await knex('user').where({ id: id }).update({ picture: null })
    success = true
  } catch (error) {
    console.error('Error deleting photo profile:', error)
  }

  if (success) {
    const response = h.response({
      status: 'success',
      message: 'Photo profile berhasil dihapus'
    })
    response.code(200)
    return response
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Photo profile tidak berhasil dihapus'
    })
    response.code(500)
    return response
  }
}
const loginHandler = async (request, h) => {
  const { email, password } = request.payload

  if (!email || !password) {
    const response = h.response({
      status: 'fail',
      message: 'Mohon Masukan Email dan password '
    })
    response.code(400)
    return response
  }

  const { isValid } = await validateUser(request, email, password)

  if (!isValid) {
    const response = h.response({
      status: 'fail',
      message: 'Invalid credentials'
    })
    response.code(401)
    return response
  }

  const response = h.response({
    status: 'success',
    message: 'Login berhasil'
  })
  response.code(200)
  return response
}
module.exports = { registerHandler, editUserHandler, deleteUserHandler, editPictureHandler, deletePictureHandler, loginHandler }
