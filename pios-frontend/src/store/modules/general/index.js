export default {
  state: {
    darkMode: false,
    locale: null,
    loading: false
  },
  mutations: {
    setDarkMode(state, payload) {
      state.darkMode = payload;
    },
    setLocale(state, payload) {
      state.locale = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    }
  },
  actions: {
    setDarkMode({ commit }, payload) {
      commit("setDarkMode", payload);
    },
    setLocale({ commit }, payload) {
      commit("setLocale", payload);
    },
    setLoading({ commit }, payload) {
      commit("setLoading", payload);
    }
  },
  getters: {
    darkMode: state => state.darkMode,
    locale: state => state.locale,
    loading: state => state.loading
  },
}