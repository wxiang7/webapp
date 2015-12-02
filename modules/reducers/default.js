const authReducer = require('./auth')
const pendingReducer = require('./pending')
const { routeReducer } = require('redux-simple-router')

module.exports = (state, action) => {
  return {
    ...state,
    routing: routeReducer(state.routing, action),
    auth: authReducer(state.auth, action),
    pending: pendingReducer(state.pending, action),
  }
}
