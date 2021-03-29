import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import hr from "vuetify/es5/locale/hr";
import en from "vuetify/es5/locale/en";
import i18n from "../i18n/index";

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { hr, en },
    current: "en",
    t: (key, ...params) => i18n.t(key, params).toString()
  },
});
