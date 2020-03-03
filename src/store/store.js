import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import {
  Notification
} from 'element-ui';

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
    delegate: null,
    isLoggedIn: false,
    token: '',
    latestBlock: {},
    myVoters: [],
    allDelegateNames: [],
  },
  getters: {
    passphrase: state => state.passphrase,
    user: state => state.user,
    isLoggedIn: state => state.isLoggedIn,
    latestBlock: state => state.latestBlock
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
    setDelegateInfo(state, delegate) {
      state.delegate = delegate;
    },
    setMyVoters(state, myVoters) {
      state.myVoters = myVoters;
    },
    setPassphrase(state, passphrase) {
      state.passphrase = passphrase
    },
    setAllDelegateNames(state, allDelegateNames) {
      state.allDelegateNames = allDelegateNames;
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
    async refreshDelegateInfo({
      commit,
      state,
    }) {
      try {
        const result = await connection.api.Delegate.getDelegateByUsername(state.user.username);

        if (result.success) {
          commit('setDelegateInfo', result.delegate);
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        Notification({
          title: 'Error',
          message: err.message
        })
      }
    },
    async getMyVoters({
      commit,
      state,
    }) {
      try {
        const result = await connection.api.Delegate.getVoters(state.user.username);
        if (result.accounts) {
          commit('setMyVoters', result.accounts)
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        Notification({
          title: 'Error',
          message: err.message
        });
      }
    },
    async getAllDelegateNames({
      commit,
    }) {
      const countWrapper = await connection.api.Delegate.count();
      if (countWrapper.success === true) {
        const count = countWrapper.count;
        const all = [];
        for (let offset = 0; offset < count; offset += 100) {
          const part = await connection.api.Delegate.getDelegates(offset, 100);
          if (part.success) {
            all.push(...part.delegates);
          }
        }

        console.log(`all.length: ${all.length}`);
        commit('setAllDelegateNames', all);
      } else {
        commit('setAllDelegateNames', []);
      }
    }
  }
});
