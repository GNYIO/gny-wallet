import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/store'

import Home from '../components/Home.vue';
import Transaction from '../components/Transaction.vue';
import Delegates from '../components/Delegates.vue';
import MachineLearning from '../components/MachineLearning.vue';
import Login from '../components/Login.vue';
import Error404 from '../components/Error404.vue';

Vue.use(VueRouter);

const Router = new VueRouter({
  routes: [{
      path: '/',
      redirect: 'login'
    },
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
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '*',
      component: Error404
    }
  ]
});

Router.beforeEach((to, from, next) => {
  let user = store.state.isLoggedIn
  if (to.path.indexOf('login') > 0 || user) {
    next({
      params: {
        ...to.params,
        user: user
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
})

export default Router