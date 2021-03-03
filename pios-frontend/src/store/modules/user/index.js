export default {
  state: {
    user: {
      username: "Matija Novosel",
      email: "mnovosel5@gmail.com",
      token: "jwtToken"
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