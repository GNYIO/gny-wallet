import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    currentUser: null,
    isLoggedIn: false,
    token: ''
  },
  getters: {
    currentUser: state => state.currentUser,
    isLoggedIn: state => state.isLoggedIn
  },
  mutations: {},
  actions: {}
})