import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import i18n from './i18n/index';
import './registerServiceWorker';
import './validators/index';
import './plugins/axios';
import './filters';
import './assets/site.css';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import RequiredIcon from "./components/RequiredIcon.vue";

Vue.config.productionTip = false;

Vue.component('validation-provider', ValidationProvider);
Vue.component('validation-observer', ValidationObserver);
Vue.component('required-icon', RequiredIcon);

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
