import Vue from 'vue'
import axios from 'axios'
import { API_URL } from '../constants';
// import store from '../store/index';

Vue.prototype.$axios = axios

axios.interceptors.request.use((config) => {
  config.mode = "cors";
  config.url = API_URL + config.url;
  // config.withCredentials = true;
  // config.headers.common['Authorization'] = `Bearer ${store.state.user.token}`;
  return config;
}, function (error) {
  return Promise.reject(error);
});