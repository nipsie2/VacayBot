const { nanoid } = require('nanoid')
const { gcloud } = require('@google-cloud/storage')
const { Knex } = require('knex')

const storage = new gcloud(); // Create a new Storage instance

// createTcpPool initializes a TCP conneconst storage = new Storage();ction pool for a Cloud SQL
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
const deleteProfilePhoto = async (bucketName, fileName) => {
  await storage.bucket(bucketName).file(fileName).delete();
};

const deleteUserData = async (id) => {
  const knex = await createTcpPool();

  try {
    await knex('user').where({ id: id }).del()
  } catch (e) {
    console.error(e.message)
  } finally {
    await knex.destroy(); // Menutup koneksi pool setelah penggunaannya
  }
}

const deleteUserHandler = async (request, h) => {
  try {
    const { id, bucketName, fileName } = request.payload

    // Hapus foto profil dari Cloud Storage
    await deleteProfilePhoto(bucketName, fileName)

    // Hapus data pengguna dari Cloud SQL
    await deleteUserData(id)

    return h.response({ message: 'User data and profile photo deleted successfully' }).code(200)
  } catch (error) {
    console.error('Error deleting user:', error)
    return h.response({ error: 'Internal Server Error' }).code(500)
  }
}
const editPictureHandler = async (request, h) => {
  try {
    const { id, bucketName, fileName } = request.payload

    // Hapus foto profil dari Cloud Storag
    const newFileName = `picture/${id}-${nanoid(8)}.jpg` // Generate a unique filename
    await storage.bucket(bucketName).file(fileName).move(newFileName)

    // Update link photo profil di Cloud SQL
    const knex = await createTcpPool();
    try {
      await knex('user').where({ id: id }).update({ picture: newFileName })
    } finally {
      await knex.destroy(); // Menutup koneksi pool setelah penggunaannya
    }

    return h.response({ message: 'Photo profile updated successfully' }).code(200)
  } catch (error) {
    console.error('Error updating photo profile:', error)
    return h.response({ error: 'Internal Server Error' }).code(500)
  }
};

module.exports = { registerHandler, editUserHandler, deleteUserHandler, editPictureHandler }
