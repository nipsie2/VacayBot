const {
  editUserHandler,
  editPictureHandler,
  getUserHandler,
  registerHandler,
  preferenceHandler,
  loginHandler,
  logoutHandler,
  deleteUserHandler,
  deletePictureHandler
} = require('./handler')

const routes = [

  {
    method: 'GET',
    path: '/user/{id}',
    handler: getUserHandler
  },
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
    method: 'POST',
    path: '/login',
    handler: loginHandler
  },
  {
    method: 'POST',
    path: '/logout',
    handler: logoutHandler
  },
  {
    method: 'POST',
    path: '/preference/{id}',
    handler: preferenceHandler
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
