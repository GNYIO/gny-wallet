import Vue from 'vue';
import Router from 'vue-router';

import Home from '../components/Home.vue';
import Transaction from '../components/Transaction.vue';
import Delegates from '../components/Delegates.vue';
import MachineLearning from '../components/MachineLearning.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/home',
      component: Home
    },
    {
      path: '/transaction',
      component: Transaction
    },
    {
      path: '/delegates',
      component: Delegates
    },
    {
      path: '/machinelearning',
      component: MachineLearning
    }
  ]
});
