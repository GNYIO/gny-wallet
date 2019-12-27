import Vue from 'vue';
import './theme/index.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.component('icon', Icon);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');