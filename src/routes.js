const {
  getRecommendationHandler,
  editUserHandler,
  registerHandler,
  PreferenceHandler,
  deleteUserHandler
} = require('./handler')

const routes = [

  {
    method: 'GET',
    path: '/recommendation/{id}',
    handler: getRecommendationHandler,
  },
  {
    method: 'PUT',
    path: '/user/{id}',
    handler: editUserHandler,
  },
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler,
  },
  {
    method: 'POST',
    path: '/recommendation/{id}',
    handler: PreferenceHandler,
  },
  {
    method: 'DELETE',
    path: '/user/{id}',
    handler: deleteUserHandler,
  },
  {
    method: 'DELETE',
    path: '/user/picture/{id}',
    handler: deleteUserHandler,
  }
]
module.exports = routes
