import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import * as client from '@gny/client';
const connection = new client.Connection(process.env['GNY_ENDPOINT'], process.env['GNY_PORT'], process.env['GNY_NETWORK']);
const getKeys = client.crypto.getKeys;

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: {
    passphrase: null,
    user: null,
    isLoggedIn: false,
    token: '',
    latestBlock: {}
  },
  getters: {
    passphrase: state => state.passphrase,
    user: state => state.user,
    isLoggedIn: state => state.isLoggedIn
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      if (token) {
        state.isLoggedIn = true;
      } else {
        state.isLoggedIn = false;
      }
    },
    setUser(state, user) {
      state.user = user;
    },
    setLatestBlock(state, block) {
      state.latestBlock = block;
    },
    setPassphrase(state, passphrase) {
      state.passphrase = passphrase
    }
  },
  actions: {
    setToken({
      commit
    }, token) {
      commit('setToken', token);
    },
    setUser({
      commit
    }, user) {
      commit('setUser', user);
    },
    setLatestBlock({
      commit
    }, block) {
      commit('setLatestBlock', block);
    },
    setPassphrase({
      commit
    }, passphrase) {
      commit('setPassphrase', passphrase);
    },
    async refreshAccounts({
      commit,
      state
    }) {
      try {
        const keys = getKeys(state.passphrase)
        const response = await connection.api.Account.openAccount(
          keys.publicKey
        );
        console.log(JSON.stringify(response, null, 2))
        commit('setUser', response.account);
        // commit('setToken', response.account.address)
        commit('setLatestBlock', response.latestBlock)
      } catch (error) {
        console.log('in store', error)
      }
    },
  }
});
