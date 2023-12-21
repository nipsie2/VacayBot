const {
  editUserHandler,
  editPictureHandler,
  registerHandler,
  deleteUserHandler,
  deletePictureHandler
} = require('./handler')

const routes = [

  {
    method: 'PUT',
    path: '/user/{id}',
    handler: editUserHandler
  },
  {
    method: 'PUT',
    path: '/user/picture/{id}',
    handler: editPictureHandler
  },
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler
  },
  {
    method: 'DELETE',
    path: '/user/{id}',
    handler: deleteUserHandler
  },
  {
    method: 'DELETE',
    path: '/user/picture/{id}',
    handler: deletePictureHandler
  }
]
module.exports = routes
