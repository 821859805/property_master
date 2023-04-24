import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui';
Vue.use(Element, { size: 'small', zIndex: 3000 });
import router from './router'

Vue.config.productionTip = false


new Vue({
  el: "#app",
  router,
  render: h => h(App)
}).$mount('#app')

