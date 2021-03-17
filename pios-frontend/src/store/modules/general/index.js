export default {
  state: {
    darkMode: false
  },
  mutations: {
    setDarkMode(state, payload) {
      state.darkMode = payload;
    }
  },
  actions: {
    setDarkMode({ commit }, payload) {
      commit("setDarkMode", payload);
    }
  },
  getters: {
    darkMode: state => state.darkMode
  },
}