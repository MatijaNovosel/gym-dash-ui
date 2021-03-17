export default {
  state: {
    darkMode: false,
    locale: null
  },
  mutations: {
    setDarkMode(state, payload) {
      state.darkMode = payload;
    },
    setLocale(state, payload) {
      state.locale = payload;
    }
  },
  actions: {
    setDarkMode({ commit }, payload) {
      commit("setDarkMode", payload);
    },
    setLocale({ commit }, payload) {
      commit("setLocale", payload);
    }
  },
  getters: {
    darkMode: state => state.darkMode,
    locale: state => state.locale
  },
}