import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router';
import 'normalize.css'
import 'vue-awesome/icons';
import 'element-theme-chalk';
import Icon from 'vue-awesome/components/Icon';
import store from './store/store';
import locale from 'element-ui/lib/locale/lang/en';

Vue.config.productionTip = false;

Vue.use(ElementUI, { locale });
Vue.component('icon', Icon);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
