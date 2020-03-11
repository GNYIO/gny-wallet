import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/store'

import * as Mnemonic from 'bitcore-mnemonic';
import * as Cookie from 'tiny-cookie';

import Login from '../views/Login.vue';
import Main from '../components/Main.vue';
import Home from '../views/Home.vue';
import Transfer from '../views/Transfer.vue';
import Delegates from '../views/Delegates.vue';
import Assets from '../views/Assets.vue';
import MachineLearning from '../views/MachineLearning.vue';
import Error404 from '../views/Error404.vue';


Vue.use(VueRouter);

const Router = new VueRouter({
  routes: [{
      path: '/',
      redirect: 'login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/main',
      component: Main,
      children: [{
          path: '/home',
          component: Home
        },
        {
          path: '/transfer',
          component: Transfer
        },
        {
          path: '/delegates',
          component: Delegates
        },
        {
          path: '/assets',
          component: Assets
        },
        {
          path: '/machinelearning',
          component: MachineLearning
        },
      ]
    },
    {
      path: '*',
      component: Error404
    }
  ],

});

Router.beforeEach(function (to, from, next) {
  const wantToNavigateToLogin = to.path.indexOf('login') > 0;

  const cookieIsSet = Mnemonic.isValid(Cookie.get('bip39'));
  const isLoggedIn = store.state.isLoggedIn;

  if (wantToNavigateToLogin || (cookieIsSet && isLoggedIn)) {
    next({
      params: {
        ...to.params,
      }
    })
    return null
  } else {
    next({
      path: '/login',
      replace: true
    })
    return null
  }
});

export default Router
