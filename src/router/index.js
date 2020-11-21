import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/store';

import Login from '../views/Login.vue';
import Main from '../components/Main.vue';
import Home from '../views/Home/Index';
import Transfer from '../views/Transfers/Index.vue';
import Delegates from '../views/Delegates/Index.vue';
import Assets from '../views/Assets/Index.vue';
import MachineLearning from '../views/MachineLearning/Index.vue';
import Error404 from '../views/Error404.vue';
import Demo from '../views/MachineLearning/Demo.vue';
import RetailDemo from '../views/MachineLearning/RetailDemo.vue';
import LocationDemo from '../views/MachineLearning/LocationDemo.vue';
import FraudDemo from '../views/MachineLearning/FraudDemo.vue';
import Jupyter from '../views/MachineLearning/Jupyter.vue';

Vue.use(VueRouter);

const Router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: 'login',
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/main',
      component: Main,
      children: [
        {
          path: '/home',
          component: Home,
        },
        {
          path: '/transfer',
          component: Transfer,
        },
        {
          path: '/delegates',
          component: Delegates,
        },
        {
          path: '/assets',
          component: Assets,
        },
        {
          path: '/machinelearning',
          component: MachineLearning,
        },
        {
          path: '/run_demo',
          component: Demo,
        },
        {
          path: '/run_retail_demo',
          component: RetailDemo,
        },
        {
          path: '/run_location_demo',
          component: LocationDemo,
        },
        {
          path: '/run_fraud_demo',
          component: FraudDemo,
        },
        {
          path: '/run_jupyter',
          component: Jupyter,
        },
      ],
    },
    {
      path: '*',
      component: Error404,
    },
  ],
});

Router.beforeEach(function(to, from, next) {
  const wantToNavigateToLogin = to.path.indexOf('login') > 0;
  const isLoggedIn = store.state.isLoggedIn;

  if (wantToNavigateToLogin || isLoggedIn) {
    next({
      params: {
        ...to.params,
      },
    });
    return null;
  } else {
    next({
      path: '/login',
      replace: true,
    });
    return null;
  }
});

export default Router;
