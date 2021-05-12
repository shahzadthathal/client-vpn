import { Commit, createStore } from 'vuex'

export default createStore({
  state: {
    authenticated : false,
    isAdmin : false,
  },
  mutations: {
    SET_AUTH: (state: {authenticated: boolean}, auth: boolean) => state.authenticated = auth,
    SET_IS_ADMIN: (state: {isAdmin: boolean}, admin: boolean) => state.isAdmin = admin,
  },
  actions: {
    //create a function to set authenticated flag true
    //commit some changes via setAuth so mutations can handle it
    setAuth: ({commit}:{commit:Commit}, auth: boolean) => commit("SET_AUTH", auth),

    setAdmin: ({commit}:{commit:Commit}, isAdmin: boolean) => commit("SET_IS_ADMIN", isAdmin),
    
  },
  modules: {
  }
})
