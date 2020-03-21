import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-theme-chalk';
import locale from 'element-ui/lib/locale/lang/en';
import App from './App.vue';
import router from './router';
import store from './store/store';
import 'normalize.css';

Vue.config.productionTip = false;

Vue.use(ElementUI, { locale });

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
