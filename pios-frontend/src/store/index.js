import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import user from "./modules/user";
import membership from "./modules/membership";
import general from "./modules/general";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { user, general, membership },
  plugins: [createPersistedState()]
})
