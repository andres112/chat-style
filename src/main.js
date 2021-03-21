import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueSpeech from "vue-speech";

Vue.config.productionTip = false

Vue.use(VueSpeech);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
