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
    isIssuer: false,
    issuer: {},
    assets: [],
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
    },
    setIsIssuer(state, isIssuer) {
      state.isIssuer = isIssuer;
    },
    setIssuer(state, issuer) {
      state.issuer = issuer;
    },
    setAssets(state, assets) {
      state.assets = assets;
    },
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

        commit('setAllDelegateNames', all);
      } else {
        commit('setAllDelegateNames', []);
      }
    },
    async refreshIsIssuer({
      commit
    }) {
      const isIssuer = await connection.api.Uia.isIssuer(this.user.address);
      if (isIssuer.success === true) {
        commit('setIsIssuer', isIssuer.isIssuer);

        if (isIssuer.isIssuer === true) {
          const issuer = await connection.api.Uia.getIssuer(this.user.username);
          if (issuer.success === true) {
            commit('setIssuer', issuer.issuer);
          }
        }
      }
    },
    async refreshAssets({
      commit
    }) {
      const count = await connection.api.Uia.getAssets();
      if (count.success === true) {
        const allAssets = [];

        const howManyAssets = count.count;
        const limit = 100;
        for (let offset = 0; offset < howManyAssets; offset += limit) {
          const result = await connection.api.Uia.getAssets(limit, offset);
          if (result.success) {
            allAssets.push(...result.assets);
          }
        }

        commit('setAssets', allAssets);
      }
    },
  },
});
