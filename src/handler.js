const { nanoid } = require('nanoid')
const { Storage } = require('@google-cloud/storage')
const { knex } = require('knex')
const init = require('./server')
const btoa = require('btoa')

const storage = new Storage({
  projectId: 'vacaybot-407302',
  credentials: {

    type: 'service_account',
    project_id: 'vacaybot-407302',
    private_key_id: '1997a69362ee12818e604e69a68e13fcc5861cad',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3LMDQ8KMxEaIK\n2UYdqepqW48J6FKKaPwA8BHQJygp112StDfShe2EcGdQoQEy72G9HwUkLGYMlwKQ\nFhdIZT2GEaiUkAezWzntX/gYNWF6EK1UZKJTlDIILMjiJvG/1yrJdu2hkZwJ9l0q\ntQUAdt9HhgLir7rvqDXIGHWR+QMLY8HhIyv98eOveyWSIU945tmLlC1WR+4Z+e1i\nveaM84kIe+bmZeGBwEL725obJ/iaEPgyrWoxfMePY0+/KOMNk43Jd6djY0+tN5E3\ntMPmhB3ofWMCPKH+y2JH5pXz01c6w1nh6+iyOeJFjKjHyZ0FRtCHrHm3RKWmtzyB\nD2YolOmLAgMBAAECggEAMaMzhwtGtdPY7Qau7PfwGa1BCEbII1DKxXhI43bQ9/Gw\nHkKvA+IeGK8bGCrhN8vN2SGQU5qidtPvMluCKLCiqPOdEtEq/QwCGRTSFsFUbm8Z\ngU6Z/HsiybtVHo++ICXvJtQPFiLuvXZhDeMq/VK5M9kZbBOB3VLgbB5QseNgU1PZ\nbCpqoAI1lqAiw2au+Y/jo3KuQXbZPNJhWyALw+M3w4ThC4FaZqZ88X7AglChbLGS\nMxIjiL/7CCpydz5L40Gix4veBZeEcBz9tQFtDAlUjrCNvc6fu+CoZSXq237+4940\nCxINf2m5xzCBK3s0WAZvg2jEfmVMMX7+VjA0ghJ/MQKBgQD0WIIs+k9woy0A5pXN\njomziiWCT3ug2AVnalY6tU6jS+Q4n2PhtkS+GWRrnAYgfFVDw8XEv13nA5n2ofDh\nCp8b7lCBW4UK3hFHwGbh5GBX+lJRLArSyr2zI3aVN/392YtTWvyXdViIwrqju/p1\n7KUhVLZH4zHqM2IFFNvgkRXmEQKBgQC/6VcaAcyPl3+slj9xODaK7RTIEgEK7r5x\njTmYirg9aysXz1g64ZMmnKiyTCx+SRfTAyCpntemQfJoJWNhUlKQ2GXHrAJc8eXC\n+c6QLQwWmGuKe8lo0nHvb2s9Gq9eI3xs0zso8RHLjEINwL0WFVr6p9rJSFbC/hDM\niL3zpRqJ2wKBgDy3ZZmBlY3arkskASN0ANmhQVLRJ1o/c5BQBx9NgD3plMtRKAOl\nRA2sx5xJx+f4nUNaeWE7YD0QUwjLEs0I06KgJFcQg83AgrC+qZIGKr6R0DSlagcZ\nI+xIqqXHpRCYJxvOZyfHm/lX0gLvqfv1ks7meukAFp4oqHm0xjJWOwfRAoGAEuSy\nAolyziAoHaGdFVRnaj308c1z9NOURDGXHgFqKgHG+E0dbo6OohqCMSt2pegkRE3m\nhUxyBpgveTlVE1u7bS8gtgulH+lgqVVWlLMaoY7X54ZQSdWOCfh6IkXiRe5QbZZO\nGLXC/rsMNbZn5yirEEo+K9rHT+MbXEeKC9aRSkkCgYEA2F4YZ7M005N+66FIfoKz\nyKHQPbmXzjAcpZNwCldvqKEq51zVXrhxwiqmtUzeOYFNF0N2IdhF0GurNiQos/22\nBXGLIFgg/a1zw/yaaPmodzkmehkzgF1rqz0Ob/hUHOj37W/GKXL9ijvKkS0Yenf/\nGhxNiwfC5XOlPrc3COB0lBA=\n-----END PRIVATE KEY-----\n',
    client_email: 'vacaybot-storage@vacaybot-407302.iam.gserviceaccount.com',
    client_id: '108158151243537343709',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/vacaybot-storage%40vacaybot-407302.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com'
  }
})

const bucketName = 'vacaybot-bucket-testing'
const bucket = storage.bucket(bucketName)

// vacaybot vacaybot
// createUnixSocketPool initializes a Unix socket connection pool for
// a Cloud SQL instance of MySQL.

const createUnixSocketPool = async config => {
  try {
    return knex({
      client: 'pg',
      connection: {
        user: process.env.DB_USER, // e.g. 'my-db-user'
        password: process.env.DB_PASS, // e.g. 'my-db-password'
        database: process.env.DB_NAME, // e.g. 'my-database'
        socketPath: process.env.INSTANCE_UNIX_SOCKET, // e.g. '/cloudsql/project:region:instance'
        // Specify additional properties here.
        ...config,
      }
    })
  } catch (error) {
    console.error('Error creating database pool:', error)
    throw error // Rethrow the error to handle it elsewhere if needed
  }
  // Note: Saving credentials in environment variables is convenient, but not
  // secure - consider a more secure solution such as
  // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
  // keep secrets safe.
}

createUnixSocketPool()

const registerHandler = (request, h) => {
  const { nama, email, password } = request.payload

  if (!nama) {
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
    createUnixSocketPool().knex('users').insert({ id: id, email: email, nama: nam, password: password })
  } catch (e) {
    const response = h.response({
      status: 'failed',
      message: e.message
    })
    response.code(500)
    return response
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
    createUnixSocketPool().knex('users').where({ id: id })
      .update({
        password
      })
  } catch (e) {
    const response = h.response({
      status: 'failed',
      message: e.message
    })
    response.code(500)
    return response
  }

  const response = h.response({
    status: 'success',
    message: 'Edit password berhasil'
  })

  response.code(200)
  return response
}


const deleteUserHandler = async (request, h) => {
  try {
    const { id } = request.params
    const { fileName } = request.payload

    const deleteProfilePhoto = async ( fileName) => {
      await bucket.file(fileName).delete()
    }

    const deleteUserData = async (id) => {
      try {
        await createUnixSocketPool().knex('users').where({ id }).del()
      } catch (e) {
        console.error(e.message)
      }
    }

    // Hapus foto profil dari Cloud Storage
    await deleteProfilePhoto(bucket, fileName)

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
    const { image } = request.payload.image
    const { id } = request.params
    const newFileName = `picture/${id}-${nanoid(8)}.jpg`

    await bucket.file(newFileName).upload(image)

    // Update link photo profil di Cloud SQL
    await createUnixSocketPool().knex('users').where({ id: id }).update({ picture: newFileName })

    success = true
  } catch (error) {
    console.error('Error updating photo profile:', error)
  }

  if (success) {
    const response = h.response({
      status: 'success',
      message: 'Photo profile berhasil diubah'
    });

    response.code(200)
    return response
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Internal Server Error',
    });
    response.code(500)
    return response
  }
}

const deletePictureHandler = async (request, h) => {
  let success = false

  try {
    const { id } = request.params
    const { fileName } = request.payload

    const deleteProfilePhoto = async ( fileName) => {
      await bucket.file(fileName).delete()
    }

    // Hapus foto profil dari Cloud Storage
    await deleteProfilePhoto(fileName)
    await createUnixSocketPool().knex('users').where({ id: id }).update({ picture: null })

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
const logoutHandler = (request, h) => {
  const logout = async () => {
    return { credentials: null, isValid: false }
  }
  try {
    init.server.auth.strategy('simple', 'basic', { logout })

    const response = h.response({
      status: 'success',
      message: 'Telah logout'
    })
    response.code(200)
    return response
  } catch (e) {
    const response = h.response({
      status: 'failed',
      message: e.message
    })
    response.code(500)
    return response
  }
}

const getUserHandler = (request, h) => {
  const { id } = request.params
  try {
    const fileName = knex('users').where({ id: id }).select('picture')
    const picContent = btoa(storage.bucket(bucketName).file(fileName).download())
    const userData = knex('users').where({ id: id }).select('nama', 'email')

    const response = h.response({
      status: 'success',
      message: 'Berhasil mengirim data dan foto',
      picture: picContent,
      data: userData
    })
    response.code(200)
    return response
  } catch (e) {
    const response = h.response({
      status: 'failed',
      message: e.message
    })
    response.code(500)
    return response
  }
}

const loginHandler = async (request, h) => {
  const { username, password } = request.payload

  init.server.register(require('@hapi/basic'))
  init.server.auth.strategy('login', 'basic', { validate })

  async function validate (request, username, password, h) {
    try {
      const users = knex('users').where({ email: username }).first()

      if (!users) {
        return { isValid: false, credentials: null, message: 'Email tidak terdaftar' }
      }

      if (password !== users.password) {
        return { isValid: false, credentials: null, message: 'Password salah' }
      }

      return { isValid: true, credentials: { username } }
    } catch (error) {
      console.error('Error validating user:', error)
      return { isValid: false, credentials: null, message: 'Terjadi kesalahan saat validasi' }
    }
  }

  if (!email || !password) {
    return h.response({
      status: 'fail',
      message: 'Mohon masukkan email dan password.'
    }).code(400)
  }

  const { isValid, message } = await validate(request, username, password, h)

  if (!isValid) {
    return h.response({
      status: 'fail',
      message: message || 'Invalid credentials'
    }).code(401)
  }

  return h.response({
    status: 'success',
    message: 'Login berhasil'
  }).code(200)
}


module.exports = { registerHandler, editUserHandler, deleteUserHandler, editPictureHandler, deletePictureHandler, logoutHandler, getUserHandler, loginHandler }