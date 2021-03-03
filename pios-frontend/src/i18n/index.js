import VueI18n from 'vue-i18n';
import Vue from 'vue'
import en from "./en";
import hr from "./hr";

Vue.use(VueI18n);

const messages = { ...en, ...hr };

const i18n = new VueI18n({
  locale: "en",
  fallbackLocale: "en",
  messages,
})

export default i18n;