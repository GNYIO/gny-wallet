import Vue from 'vue';
import Vuex from 'vuex';

import { getDefaultState } from './state';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

let state = getDefaultState();

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  plugins: [],
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions,
});
