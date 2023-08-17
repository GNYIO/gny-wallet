import * as client from '@gny/client';
import { Notification } from 'element-ui';

const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  JSON.parse(process.env.VUE_APP_HTTPS || false),
);
const getKeys = client.crypto.getKeys;

export const actions = {
  setLogin({ commit }, loggedIn) {
    commit('setLogin', loggedIn);
  },
  setUser({ commit }, user) {
    commit('setUser', user);
  },
  setLatestBlock({ commit }, block) {
    commit('setLatestBlock', block);
  },
  setPassphrase({ commit }, passphrase) {
    commit('setPassphrase', passphrase);
  },
  setSecondPassphrase({ commit }, secondPassphrase) {
    commit('setSecondPassphrase', secondPassphrase);
  },
  async refreshAccounts({ commit, state }) {
    try {
      const keys = getKeys(state.passphrase);
      const response = await connection.api.Account.openAccount(keys.publicKey);
      commit('setUser', response.account);
      commit('setLatestBlock', response.latestBlock);
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async refreshDelegateInfo({ commit, state }) {
    try {
      if (state.user.username && state.user.isDelegate === 1) {
        const result = await connection.api.Delegate.getDelegateByUsername(
          state.user.username,
        );
        if (result.success) {
          commit('setDelegateInfo', result.delegate);
        } else {
          commit('setDelegateInfo', result.delegate);
        }
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getMyVoters({ commit, state }) {
    try {
      if (state.user.username) {
        const result = await connection.api.Delegate.getVoters(
          state.user.username,
        );
        if (result.accounts) {
          commit('setMyVoters', result.accounts);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getAllDelegateNames({ commit }) {
    try {
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
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async refreshIsIssuer({ commit, state }) {
    try {
      const isIssuer = await connection.api.Uia.isIssuer(state.user.address);
      if (isIssuer.success === true) {
        commit('setIsIssuer', isIssuer.isIssuer);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getIssuer({ state, commit }) {
    try {
      if (state.isIssuer === true) {
        const result = await connection.api.Uia.getIssuer(state.user.address);
        if (result.success === true) {
          console.log(JSON.stringify(result.issuer, null, 2));
          commit('setIssuer', result.issuer);
        }
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getAssets({ commit }) {
    const count = await connection.api.Uia.getAssets();
    if (count.success === true) {
      const all = [];

      const howManyAssets = count.count;
      const limit = 100;
      for (let offset = 0; offset < howManyAssets; offset += limit) {
        const result = await connection.api.Uia.getAssets(limit, offset);
        if (result.success) {
          all.push(...result.assets);
        }
      }

      commit('setAssets', all);
    }
  },
  async getTransactions({ commit, state }) {
    try {
      let result = await connection.api.Transaction.getTransactions({
        senderId: state.user.address,
      });
      if (result.success === true) {
        const count = result.count;
        const all = [];

        for (let offset = 0; offset < count; offset += 100) {
          const result = await connection.api.Transaction.getTransactions({
            offset: offset,
            senderId: state.user.address,
          });
          if (result.success === true) {
            all.push(...result.transactions);
          }
        }
        commit('setTransactions', all);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getWhoIVotedFor({ commit, state }) {
    try {
      const address = state.user.address;

      if (address) {
        let result = await connection.api.Delegate.getOwnVotes({
          address,
        });

        if (result.success === true) {
          commit('setOwnVotes', result.delegates);
        } else {
          commit('setOwnVotes', []);
        }
      } else {
        commit('setOwnVotes', []);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getTransfers({ commit, state }) {
    try {
      const count = await connection.api.Transfer.getRoot({
        ownerId: state.user.address,
      });

      if (count.success === true) {
        const all = [];
        for (let offset = 0; offset < count.count; offset += 100) {
          const result = await connection.api.Transfer.getRoot({
            ownerId: state.user.address,
            limit: 100,
            offset: offset,
          });
          if (result.success === true) {
            all.push(...result.transfers);
          }
        }

        commit('setTransfers', all);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getBalances({ state, commit }) {
    try {
      const address = state.user.address;
      const count = await connection.api.Uia.getBalances(address);

      if (count.success === true) {
        const all = [];
        for (let offset = 0; offset < count.count; offset += 100) {
          const result = await connection.api.Uia.getBalances(
            address,
            100,
            offset,
          );
          if (result.success) {
            all.push(...result.balances);
          }
        }

        commit('setBalances', all);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getBurn({ commit }) {
    try {
      const count = await connection.api.Burn.getAll(100, 0);

      if (count.success === true) {
        const all = [];
        for (let offset = 0; offset < count.count; offset += 100) {
          const result = await connection.api.Burn.getAll(100, offset);
          if (result.success === true) {
            all.push(...result.burn);
          }
        }

        commit('setBurn', all);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },

  async getSupply({ commit }) {
    try {
      const raw = await connection.api.Block.getSupply();

      if (raw.success === true) {
        const result = {
          burned: raw.burned,
          supply: raw.supply,
        };

        commit('setSupply', result);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },

  resetState({ commit }) {
    commit('resetState');
  },
};
