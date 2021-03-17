export default {
  state: {
    user: {
      id: null,
      username: null,
      email: null,
      token: null,
      roles: []
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    }
  },
  actions: {
    setUser({ commit }, payload) {
      commit("setUser", payload);
    }
  },
  getters: {
    user: state => state.user
  },
}