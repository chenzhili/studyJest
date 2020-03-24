import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import request from './request'

Vue.config.productionTip = false;
console.log(request);

console.log(router);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
